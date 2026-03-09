import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { 
  register, 
  login, 
  refreshAccessToken, 
  logout, 
  requestPasswordReset, 
  resetPassword 
} from '../auth/auth.js';

const router = express.Router();

// Enhanced validation schemas
const emailSchema = z.string()
  .email('Invalid email format')
  .min(5, 'Email too short')
  .max(255, 'Email too long')
  .transform(email => email.toLowerCase().trim());

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .regex(/^[\p{L}\s'-]+$/u, 'Name contains invalid characters')
  .transform(name => name.trim());

const phoneSchema = z.string()
  .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format')
  .max(20, 'Phone number too long')
  .optional()
  .nullable()
  .transform(phone => phone?.trim() || null);

// Request validation schemas
const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

const passwordResetRequestSchema = z.object({
  email: emailSchema
});

const passwordResetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: passwordSchema
});

// Rate limiting configurations
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.body?.email || req.ip
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset requests per hour
  message: {
    error: 'Too many password reset attempts, please try again later.',
    retryAfter: 3600
  }
});

const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Too many requests' }
});

// Validation middleware
function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.validatedBody = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code
          }))
        });
      }
      next(error);
    }
  };
}

// Input sanitization middleware
function sanitizeInput(req, res, next) {
  if (typeof req.body === 'object' && req.body !== null) {
    // Remove null bytes and limit input sizes
    const sanitize = (value) => {
      if (typeof value === 'string') {
        return value
          // eslint-disable-next-line no-control-regex
          .replace(/\x00/g, '')
          .trim()
          .substring(0, 10000);
      }
      return value;
    };
    
    req.body = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [key, sanitize(value)])
    );
  }
  next();
}

router.use(sanitizeInput);

// ===== AUTHENTICATION ENDPOINTS =====

// POST /auth/register - User registration
router.post('/register', 
  authLimiter, 
  validateRequest(registerSchema),
  async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.validatedBody;
      
      const result = await register({
        email,
        password,
        firstName,
        lastName,
        phone
      });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        code: 'REGISTRATION_SUCCESS',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific error codes
      if (error.code === 'USER_EXISTS') {
        return res.status(409).json({
          success: false,
          error: 'User with this email already exists',
          code: 'USER_EXISTS'
        });
      }
      
      res.status(400).json({
        success: false,
        error: error.message || 'Registration failed',
        code: error.code || 'REGISTRATION_FAILED'
      });
    }
  }
);

// POST /auth/login - User login
router.post('/login', 
  authLimiter, 
  validateRequest(loginSchema),
  async (req, res) => {
    try {
      const { email, password } = req.validatedBody;
      
      const result = await login(email, password);
      
      res.json({
        success: true,
        message: 'Login successful',
        code: 'LOGIN_SUCCESS',
        data: {
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      
      // Generic error message for security (don't reveal if user exists)
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }
  }
);

// POST /auth/refresh - Refresh access token
router.post('/refresh', 
  strictLimiter,
  validateRequest(refreshTokenSchema),
  async (req, res) => {
    try {
      const { refreshToken } = req.validatedBody;
      
      const result = await refreshAccessToken(refreshToken);
      
      res.json({
        success: true,
        message: 'Token refreshed successfully',
        code: 'TOKEN_REFRESHED',
        data: {
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      
      res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }
  }
);

// POST /auth/logout - User logout
router.post('/logout', 
  strictLimiter,
  validateRequest(refreshTokenSchema),
  async (req, res) => {
    try {
      const { refreshToken } = req.validatedBody;
      
      await logout(refreshToken);
      
      res.json({
        success: true,
        message: 'Logged out successfully',
        code: 'LOGOUT_SUCCESS'
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Still return success for client-side cleanup
      res.json({
        success: true,
        message: 'Logged out successfully',
        code: 'LOGOUT_SUCCESS'
      });
    }
  }
);

// POST /auth/password-reset/request - Request password reset
router.post('/password-reset/request', 
  passwordResetLimiter, 
  validateRequest(passwordResetRequestSchema),
  async (req, res) => {
    try {
      const { email } = req.validatedBody;
      
      await requestPasswordReset(email);
      
      // Always return same message for security (don't reveal if email exists)
      res.json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.',
        code: 'RESET_REQUEST_RECEIVED'
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      // Don't reveal if email exists
      res.json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.',
        code: 'RESET_REQUEST_RECEIVED'
      });
    }
  }
);

// POST /auth/password-reset/reset - Reset password with token
router.post('/password-reset/reset', 
  strictLimiter,
  validateRequest(passwordResetSchema),
  async (req, res) => {
    try {
      const { token, newPassword } = req.validatedBody;
      
      await resetPassword(token, newPassword);
      
      res.json({
        success: true,
        message: 'Password reset successfully. Please log in with your new password.',
        code: 'PASSWORD_RESET_SUCCESS'
      });
    } catch (error) {
      console.error('Password reset error:', error);
      
      res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
        code: 'INVALID_RESET_TOKEN'
      });
    }
  }
);

// GET /auth/me - Get current user info
router.get('/me', 
  strictLimiter,
  async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          error: 'Authorization header required',
          code: 'MISSING_AUTH_HEADER'
        });
      }
      
      const [scheme, token] = authHeader.split(' ');
      
      if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
          success: false,
          error: 'Invalid authorization format. Use: Bearer <token>',
          code: 'INVALID_AUTH_FORMAT'
        });
      }
      
      // Import here to avoid circular dependency
      const { verifyAccessToken } = await import('../auth/auth.js');
      const decoded = verifyAccessToken(token);
      
      // Fetch user data from database
      const { db } = await import('../db/database.js');
      const userResult = await db.query`
        SELECT id, email, first_name, last_name, phone, role, created_at
        FROM users WHERE id = ${decoded.userId}
      `;
      
      if (userResult.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }
      
      const user = userResult[0];
      
      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      console.error('User info error:', error);
      
      if (error.code === 'INVALID_TOKEN') {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user information',
        code: 'FETCH_ERROR'
      });
    }
  }
);

export default router;
