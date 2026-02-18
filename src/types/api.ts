/**
 * API Request and Response Types
 */

// User types
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  isActive: boolean;
  role: 'admin' | 'staff' | 'customer';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// Vehicle types
export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  color: string | null;
  licensePlate: string | null;
  vin: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Service types
export interface ServicePackage {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  durationHours: number | null;
  category: string;
  isActive: boolean;
}

export interface ServiceModule {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationHours: number | null;
  category: string;
  isActive: boolean;
}

// Booking types
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string | null;
  vehicleId: string | null;
  date: string;
  time: string;
  carModel: string;
  packageId: string | null;
  selectedModules: string[];
  totalPrice: number;
  status: BookingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  date: string;
  time: string;
  carModel: string;
  packageId?: string;
  selectedModules?: string[];
  totalPrice: number;
  notes?: string;
}

// Payment types
export type PaymentMethod = 'credit_card' | 'debit_card' | 'cash' | 'paypal';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string | null;
  status: PaymentStatus;
}

// Pagination types
export interface PaginationParams {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// API Error type
export interface ApiError {
  error: string;
  code: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}
