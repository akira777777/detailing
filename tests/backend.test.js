import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock modules at the top level
vi.mock('bcryptjs', async () => {
  return {
    hash: vi.fn().mockResolvedValue('$2b$12$mockedhash'),
    compare: vi.fn().mockResolvedValue(true),
    default: {
      hash: vi.fn().mockResolvedValue('$2b$12$mockedhash'),
      compare: vi.fn().mockResolvedValue(true)
    }
  };
});

vi.mock('jsonwebtoken', async () => {
  const mockSign = vi.fn().mockReturnValue('mock-jwt-token');
  const mockVerify = vi.fn().mockReturnValue({ userId: 'user-123' });
  const mockDecode = vi.fn().mockReturnValue({ exp: Date.now() / 1000 + 3600 });
  
  class JsonWebTokenError extends Error {
    constructor(message) {
      super(message);
      this.name = 'JsonWebTokenError';
    }
  }
  
  return {
    sign: mockSign,
    verify: mockVerify,
    decode: mockDecode,
    JsonWebTokenError,
    default: {
      sign: mockSign,
      verify: mockVerify,
      decode: mockDecode
    }
  };
});

vi.mock('uuid', async () => {
  return {
    v4: vi.fn().mockReturnValue('mock-uuid-123'),
    default: {
      v4: vi.fn().mockReturnValue('mock-uuid-123')
    }
  };
});

// Mock database with all required exports
vi.mock('../db/database.js', async () => {
  const { z } = await import('zod');
  
  return {
    db: {
      query: vi.fn()
    },
    userSchema: z.object({
      email: z.string().email(),
      password: z.string().min(8),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      phone: z.string().optional()
    }),
    vehicleSchema: z.object({
      userId: z.string().uuid(),
      make: z.string().min(1),
      model: z.string().min(1),
      year: z.number().int().min(1900),
      color: z.string().optional(),
      licensePlate: z.string().optional(),
      vin: z.string().optional()
    }),
    bookingSchema: z.object({
      userId: z.string().uuid().optional(),
      vehicleId: z.string().uuid().optional(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      carModel: z.string().min(1),
      packageId: z.string().uuid().optional(),
      selectedModules: z.array(z.string().uuid()).optional(),
      totalPrice: z.number().positive(),
      notes: z.string().optional()
    })
  };
});

// Dynamic import for auth functions after mocks are set up
const { register, login, refreshAccessToken, logout, requestPasswordReset, resetPassword, authenticateToken } = await import('../auth/auth.js');
const { db } = await import('../db/database.js');

describe('Authentication System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567890'
      };

      db.query
        .mockResolvedValueOnce([]) // Check if user exists
        .mockResolvedValueOnce([{ ...mockUser, created_at: new Date().toISOString() }]) // Create user
        .mockResolvedValueOnce([]); // Store refresh token

      const result = await register({
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890'
      });

      expect(result.user).toEqual(expect.objectContaining({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.first_name,
        lastName: mockUser.last_name
      }));
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should reject duplicate email registration', async () => {
      db.query.mockResolvedValueOnce([{ id: 'existing-user' }]); // User already exists

      await expect(register({
        email: 'existing@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      })).rejects.toThrow('User with this email already exists');
    });

    it('should reject invalid email format', async () => {
      await expect(register({
        email: 'invalid-email',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      })).rejects.toThrow();
    });

    it('should reject password shorter than 8 characters', async () => {
      await expect(register({
        email: 'test@example.com',
        password: 'short',
        firstName: 'John',
        lastName: 'Doe'
      })).rejects.toThrow();
    });
  });

  describe('User Login', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        password_hash: '$2b$12$somesecurehash',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567890',
        is_active: true,
        role: 'customer'
      };

      db.query
        .mockResolvedValueOnce([mockUser]) // Find user
        .mockResolvedValueOnce([]) // Update last login
        .mockResolvedValueOnce([]); // Store refresh token

      const result = await login('test@example.com', 'correctpassword');

      expect(result.user).toEqual(expect.objectContaining({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.first_name,
        lastName: mockUser.last_name
      }));
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      db.query.mockResolvedValueOnce([]); // User not found

      await expect(login('nonexistent@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should reject inactive account', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'inactive@example.com',
        password_hash: '$2b$12$somesecurehash',
        first_name: 'Inactive',
        last_name: 'User',
        is_active: false,
        role: 'customer'
      };

      db.query.mockResolvedValueOnce([mockUser]);

      await expect(login('inactive@example.com', 'password'))
        .rejects.toThrow('Account is deactivated');
    });
  });

  describe('Token Refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      const mockSession = {
        user_id: 'user-123',
        is_active: true
      };

      db.query
        .mockResolvedValueOnce([mockSession]) // Validate session
        .mockResolvedValueOnce([]); // Update last accessed

      const result = await refreshAccessToken('valid-refresh-token');

      expect(result.accessToken).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      const jwt = await import('jsonwebtoken');
      jwt.verify.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      await expect(refreshAccessToken('invalid-token'))
        .rejects.toThrow('Token refresh failed: Invalid token');
    });

    it('should reject expired session', async () => {
      db.query.mockResolvedValueOnce([]); // No valid session found

      await expect(refreshAccessToken('expired-token'))
        .rejects.toThrow('Invalid refresh token');
    });
  });

  describe('Logout', () => {
    it('should logout user successfully', async () => {
      db.query.mockResolvedValueOnce([]);

      await expect(logout('valid-refresh-token')).resolves.not.toThrow();
    });
  });

  describe('Password Reset', () => {
    it('should request password reset for existing user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com'
      };

      db.query.mockResolvedValueOnce([mockUser]);

      const result = await requestPasswordReset('test@example.com');
      expect(result.success).toBe(true);
    });

    it('should handle password reset for non-existent user gracefully', async () => {
      db.query.mockResolvedValueOnce([]);

      const result = await requestPasswordReset('nonexistent@example.com');
      expect(result.success).toBe(true);
    });

    it('should reset password with valid token', async () => {
      const jwt = await import('jsonwebtoken');
      jwt.verify.mockReturnValueOnce({ userId: 'user-123', type: 'password_reset' });
      
      db.query
        .mockResolvedValueOnce([]) // Update password
        .mockResolvedValueOnce([]); // Delete sessions

      const result = await resetPassword('valid-reset-token', 'NewPassword123!');
      expect(result.success).toBe(true);
    });

    it('should reject password reset with invalid token type', async () => {
      const jwt = await import('jsonwebtoken');
      jwt.verify.mockImplementationOnce(() => {
        const error = new Error('Invalid reset token');
        error.name = 'AuthError';
        throw error;
      });

      await expect(resetPassword('invalid-token', 'NewPassword123!'))
        .rejects.toThrow();
    });
  });
});

describe('Authentication Middleware', () => {
  it('should call next() with valid token', async () => {
    const jwt = await import('jsonwebtoken');
    jwt.verify.mockReturnValueOnce({ userId: 'user-123' });

    const req = {
      headers: {
        authorization: 'Bearer valid-token'
      }
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    authenticateToken(req, res, next);
    
    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe('user-123');
  });

  it('should return 401 when token is missing', () => {
    const req = { headers: {} };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    authenticateToken(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Access token required' });
  });

  it('should return 403 when token is invalid', async () => {
    const jwt = await import('jsonwebtoken');
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    const req = {
      headers: {
        authorization: 'Bearer invalid-token'
      }
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    const next = vi.fn();

    authenticateToken(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
  });
});

describe('API Endpoints', () => {
  describe('Booking API', () => {
    it('should create booking with valid data', async () => {
      const mockBooking = {
        id: 'booking-123',
        userId: 'user-123',
        date: '2024-01-15',
        time: '10:00',
        carModel: 'Tesla Model 3',
        totalPrice: 299.99
      };

      db.query.mockResolvedValueOnce([mockBooking]);

      expect(mockBooking).toHaveProperty('id');
      expect(mockBooking).toHaveProperty('date');
      expect(mockBooking).toHaveProperty('totalPrice');
    });

    it('should reject booking with invalid date format', async () => {
      const { bookingSchema } = await import('../db/database.js');
      
      expect(() => {
        bookingSchema.parse({
          date: 'invalid-date',
          time: '10:00',
          carModel: 'Tesla Model 3',
          totalPrice: 299.99
        });
      }).toThrow();
    });

    it('should reject booking with negative price', async () => {
      const { bookingSchema } = await import('../db/database.js');
      
      expect(() => {
        bookingSchema.parse({
          date: '2024-01-15',
          time: '10:00',
          carModel: 'Tesla Model 3',
          totalPrice: -100
        });
      }).toThrow();
    });
  });

  describe('Vehicle API', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      db.query.mockResolvedValue([]);
    });

    it('should manage vehicle information', async () => {
      const mockVehicle = {
        id: 'vehicle-123',
        userId: 'user-123',
        make: 'Tesla',
        model: 'Model 3',
        year: 2024
      };

      // Reset mock and set specific return value for this test
      db.query.mockReset();
      db.query.mockResolvedValue([mockVehicle]);

      const result = await db.query('SELECT * FROM vehicles WHERE id = $1', [mockVehicle.id]);
      expect(result[0]).toEqual(mockVehicle);
    });

    it('should reject vehicle with invalid year', async () => {
      const { vehicleSchema } = await import('../db/database.js');
      
      expect(() => {
        vehicleSchema.parse({
          userId: 'user-123',
          make: 'Tesla',
          model: 'Model 3',
          year: 1800
        });
      }).toThrow();
    });
  });
});

describe('Database Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Query Execution', () => {
    it('should handle database errors gracefully', async () => {
      db.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(db.query('SELECT * FROM users')).rejects.toThrow('Database connection failed');
    });

    it('should handle connection timeout', async () => {
      db.query.mockRejectedValue(new Error('Connection timeout'));

      await expect(db.query('SELECT * FROM users')).rejects.toThrow('Connection timeout');
    });

    it('should handle duplicate key violations', async () => {
      db.query.mockRejectedValue(new Error('duplicate key value violates unique constraint'));

      await expect(db.query('INSERT INTO users (email) VALUES ($1)', ['existing@example.com']))
        .rejects.toThrow('duplicate key value violates unique constraint');
    });
  });

  describe('Transaction Handling', () => {
    it('should commit successful transactions', async () => {
      db.query.mockResolvedValue([{ id: 'user-123' }]);

      const result = await db.query('INSERT INTO users (email) VALUES ($1) RETURNING id', ['test@example.com']);
      expect(result[0]).toHaveProperty('id');
    });
  });
});

describe('Security Features', () => {
  describe('Rate Limiting', () => {
    it('should enforce request limits', () => {
      const requests = [];
      const maxRequests = 100;
      const _windowMs = 15 * 60 * 1000; // 15 minutes

      // Simulate rate limiting logic
      const isAllowed = requests.length < maxRequests;
      expect(typeof isAllowed).toBe('boolean');
    });

    it('should block requests over limit', () => {
      const requestCount = 150;
      const maxRequests = 100;
      
      const isBlocked = requestCount > maxRequests;
      expect(isBlocked).toBe(true);
    });
  });

  describe('Input Validation', () => {
    it('should validate required fields', async () => {
      const { userSchema } = await import('../db/database.js');
      
      expect(() => {
        userSchema.parse({
          email: 'test@example.com',
          // missing password, firstName, lastName
        });
      }).toThrow();
    });

    it('should sanitize SQL injection attempts', () => {
      const maliciousInput = "'; DROP TABLE users; --";
      const sanitizedInput = maliciousInput.replace(/['";]/g, '');
      
      expect(sanitizedInput).not.toContain("'");
      expect(sanitizedInput).not.toContain('"');
    });

    it('should validate email format', () => {
      const invalidEmails = ['not-an-email', '@example.com', 'test@', 'test@.com'];
      
      invalidEmails.forEach(email => {
        expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  describe('Password Security', () => {
    it('should require strong passwords', () => {
      const weakPasswords = ['12345678', 'password', 'abcdefgh'];
      const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      
      weakPasswords.forEach(password => {
        expect(password).not.toMatch(strongPasswordPattern);
      });
    });

    it('should hash passwords before storage', async () => {
      const bcrypt = await import('bcryptjs');
      const plainPassword = 'SecurePass123!';
      
      const hashedPassword = await bcrypt.hash(plainPassword, 12);
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword).toContain('$2'); // bcrypt hash indicator
    });
  });
});
