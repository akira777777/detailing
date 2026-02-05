import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { userSchema } from '../db/database.js';
import { db } from '../db/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const SALT_ROUNDS = 12;

export class AuthError extends Error {
  constructor(message, code = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

// User registration
export async function register(userData) {
  try {
    // Validate input
    const validatedData = userSchema.parse(userData);
    
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [validatedData.email.toLowerCase()]
    );
    
    if (existingUser.length > 0) {
      throw new AuthError('User with this email already exists', 'USER_EXISTS');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, SALT_ROUNDS);
    
    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, first_name, last_name, phone, created_at`,
      [
        validatedData.email.toLowerCase(),
        hashedPassword,
        validatedData.firstName,
        validatedData.lastName,
        validatedData.phone || null
      ]
    );
    
    const user = result[0];
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user.id);
    
    // Store refresh token
    await storeRefreshToken(user.id, refreshToken);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        createdAt: user.created_at
      },
      accessToken,
      refreshToken
    };
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError('Registration failed: ' + error.message);
  }
}

// User login
export async function login(email, password) {
  try {
    // Find user
    const result = await db.query(
      `SELECT id, email, password_hash, first_name, last_name, phone, is_active, role 
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
    
    if (result.length === 0) {
      throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS');
    }
    
    const user = result[0];
    
    // Check if user is active
    if (!user.is_active) {
      throw new AuthError('Account is deactivated', 'ACCOUNT_DEACTIVATED');
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS');
    }
    
    // Update last login
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateTokens(user.id);
    
    // Store refresh token
    await storeRefreshToken(user.id, refreshToken);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role
      },
      accessToken,
      refreshToken
    };
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError('Login failed: ' + error.message);
  }
}

// Token generation
async function generateTokens(userId) {
  const payload = { userId };
  
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'detailing-app',
    audience: 'detailing-client'
  });
  
  const refreshToken = jwt.sign(
    { userId, tokenId: uuidv4() },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}

// Store refresh token
async function storeRefreshToken(userId, refreshToken) {
  const decoded = jwt.decode(refreshToken);
  const expiresAt = new Date(decoded.exp * 1000);
  
  await db.query(
    `INSERT INTO sessions (user_id, token, expires_at) 
     VALUES ($1, $2, $3) 
     ON CONFLICT (token) DO UPDATE SET 
     expires_at = $3, last_accessed = NOW()`,
    [userId, refreshToken, expiresAt]
  );
}

// Token verification
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'detailing-app',
      audience: 'detailing-client'
    });
  } catch {
    throw new AuthError('Invalid or expired token', 'INVALID_TOKEN');
  }
}

// Refresh token
export async function refreshAccessToken(refreshToken) {
  try {
    // Verify refresh token
    const _decoded = jwt.verify(refreshToken, JWT_SECRET);
    
    // Check if session exists and is valid
    const sessionResult = await db.query(
      `SELECT s.*, u.is_active 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.token = $1 AND s.expires_at > NOW() AND u.is_active = true`,
      [refreshToken]
    );
    
    if (sessionResult.length === 0) {
      throw new AuthError('Invalid refresh token', 'INVALID_REFRESH_TOKEN');
    }
    
    const session = sessionResult[0];
    
    // Update session last accessed
    await db.query(
      'UPDATE sessions SET last_accessed = NOW() WHERE token = $1',
      [refreshToken]
    );
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: session.user_id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    return { accessToken: newAccessToken };
  } catch (error) {
    if (error instanceof AuthError) throw error;
    throw new AuthError('Token refresh failed: ' + error.message);
  }
}

// Logout
export async function logout(refreshToken) {
  try {
    await db.query('DELETE FROM sessions WHERE token = $1', [refreshToken]);
  } catch (error) {
    throw new AuthError('Logout failed: ' + error.message);
  }
}

// Middleware for protecting routes
export function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const decoded = verifyAccessToken(token);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Authorization middleware
export function authorizeRoles() {
  return (req, res, next) => {
    // This would typically check the user's role from database
    // For now, we'll implement basic role checking
    // In a real implementation, you'd fetch user role from database
    next();
  };
}

// Password reset functionality
export async function requestPasswordReset(email) {
  try {
    const result = await db.query(
      'SELECT id, email FROM users WHERE email = $1 AND is_active = true',
      [email.toLowerCase()]
    );
    
    if (result.length === 0) {
      // Don't reveal if email exists for security
      return { success: true };
    }
    
    const user = result[0];
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // In a real app, you'd send this via email
    console.log(`Password reset token for ${user.email}: ${resetToken}`);
    
    return { success: true, resetToken }; // Remove resetToken in production
  } catch (error) {
    throw new AuthError('Password reset request failed: ' + error.message);
  }
}

export async function resetPassword(token, newPassword) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.type !== 'password_reset') {
      throw new AuthError('Invalid reset token', 'INVALID_RESET_TOKEN');
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, decoded.userId]
    );
    
    // Invalidate all sessions for this user
    await db.query('DELETE FROM sessions WHERE user_id = $1', [decoded.userId]);
    
    return { success: true };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthError('Invalid or expired reset token', 'INVALID_RESET_TOKEN');
    }
    throw new AuthError('Password reset failed: ' + error.message);
  }
}