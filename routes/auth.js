import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, refreshAccessToken, logout, requestPasswordReset, resetPassword } from '../auth/auth.js';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    error: 'Too many password reset attempts, please try again later.'
  }
});

// Registration endpoint
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, password, firstName, lastName' 
      });
    }
    
    const result = await register({
      email,
      password,
      firstName,
      lastName,
      phone
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      error: error.message,
      code: error.code 
    });
  }
});

// Login endpoint
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    const result = await login(email, password);
    
    res.json({
      message: 'Login successful',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      error: error.message,
      code: error.code 
    });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    
    const result = await refreshAccessToken(refreshToken);
    
    res.json({
      accessToken: result.accessToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ 
      error: error.message,
      code: error.code 
    });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      await logout(refreshToken);
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    // Still return success for client-side cleanup
    res.json({ message: 'Logged out successfully' });
  }
});

// Password reset request
router.post('/password-reset/request', passwordResetLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    await requestPasswordReset(email);
    
    res.json({ 
      message: 'If an account exists with this email, password reset instructions have been sent.' 
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    // Don't reveal if email exists
    res.json({ 
      message: 'If an account exists with this email, password reset instructions have been sent.' 
    });
  }
});

// Password reset
router.post('/password-reset/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    await resetPassword(token, newPassword);
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(400).json({ 
      error: error.message,
      code: error.code 
    });
  }
});

// Get current user info
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    // In a real implementation, you'd verify the token and fetch user data
    // For now, we'll return a basic response
    res.json({ 
      message: 'Protected route accessed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User info error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;