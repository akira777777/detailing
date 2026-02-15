# Full Stack Modernization Implementation Plan

## Overview

Detailed implementation plan for modernizing LUXE Detailing from JavaScript to a type-safe, modern architecture.

## Current Issues

| Issue | Impact |
|-------|--------|
| Broken `tsconfig.json` | TypeScript not working |
| All files are `.jsx`/`.js` | No type safety |
| Raw SQL queries | SQL injection risk |
| Mixed state management | Inconsistent patterns |
| Manual fetch calls | No caching strategy |

## Technology Changes

| Layer | Current | Target |
|-------|---------|--------|
| Language | JavaScript | TypeScript |
| Backend | Express.js | Hono.js |
| Database | Raw SQL | Prisma ORM |
| Data Fetching | Manual fetch | TanStack Query |
| State | Zustand + Context | Zustand only |

---

## Phase 1: TypeScript Foundation

### Tasks
- [ ] Fix broken `tsconfig.json`
- [ ] Create `src/types/` directory
- [ ] Migrate constants to TypeScript
- [ ] Migrate utilities to TypeScript
- [ ] Update ESLint config

### Type Definitions to Create

```
src/types/
├── api.ts          # API request/response types
├── models.ts       # Database model types
├── components.ts   # Component prop types
└── hooks.ts        # Hook type definitions
```

---

## Phase 2: Database Layer with Prisma

### Tasks
- [ ] Install Prisma
- [ ] Create Prisma schema from `db/schema.sql`
- [ ] Run initial migration
- [ ] Create repository layer

### Models to Create

- User, Vehicle, ServicePackage, ServiceModule
- Booking, Payment, Session
- Enums: Role, BookingStatus, PaymentMethod

---

## Phase 3: Backend Migration to Hono

### Tasks
- [ ] Install Hono
- [ ] Create app structure
- [ ] Migrate auth routes
- [ ] Migrate API routes
- [ ] Implement three-layer architecture

### Architecture

```
Repository Layer → Database operations
Service Layer → Business logic
Route Layer → HTTP handling
```

---

## Phase 4: Frontend Data Layer

### Tasks
- [ ] Install TanStack Query
- [ ] Create API client
- [ ] Create custom hooks
- [ ] Migrate components

### Hooks to Create

- `useBookings()` - Fetch bookings
- `useCreateBooking()` - Create booking
- `useUser()` - Current user

---

## Phase 5: Frontend TypeScript

### Migration Order

1. Context Providers
2. Custom Hooks
3. UI Components
4. Feature Components
5. Pages

### State Consolidation

- `useUIStore()` - Theme, sidebar
- `useAuthStore()` - Authentication

---

## Phase 6: Testing & Polish

### Tasks
- [ ] Update test config
- [ ] Migrate tests to TypeScript
- [ ] Update CI/CD pipeline
- [ ] Performance optimization

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Type Coverage | > 90% |
| Build Time | < 30s |
| Bundle Size | < 200KB |
| Test Coverage | > 80% |
| Lighthouse | > 90 |

## Overview

Detailed implementation plan for modernizing LUXE Detailing from JavaScript to a type-safe, modern architecture.

## Current Issues

| Issue | Impact |
|-------|--------|
| Broken `tsconfig.json` | TypeScript not working |
| All files are `.jsx`/`.js` | No type safety |
| Raw SQL queries | SQL injection risk |
| Mixed state management | Inconsistent patterns |
| Manual fetch calls | No caching strategy |

## Technology Changes

| Layer | Current | Target |
|-------|---------|--------|
| Language | JavaScript | TypeScript |
| Backend | Express.js | Hono.js |
| Database | Raw SQL | Prisma ORM |
| Data Fetching | Manual fetch | TanStack Query |
| State | Zustand + Context | Zustand only |

---

## Phase 1: TypeScript Foundation

### Tasks
- [ ] Fix broken `tsconfig.json`
- [ ] Create `src/types/` directory
- [ ] Migrate constants to TypeScript
- [ ] Migrate utilities to TypeScript
- [ ] Update ESLint config

### Type Definitions to Create

```
src/types/
├── api.ts          # API request/response types
├── models.ts       # Database model types
├── components.ts   # Component prop types
└── hooks.ts        # Hook type definitions
```

---

## Phase 2: Database Layer with Prisma

### Tasks
- [ ] Install Prisma
- [ ] Create Prisma schema from `db/schema.sql`
- [ ] Run initial migration
- [ ] Create repository layer

### Models to Create

- User, Vehicle, ServicePackage, ServiceModule
- Booking, Payment, Session
- Enums: Role, BookingStatus, PaymentMethod

---

## Phase 3: Backend Migration to Hono

### Tasks
- [ ] Install Hono
- [ ] Create app structure
- [ ] Migrate auth routes
- [ ] Migrate API routes
- [ ] Implement three-layer architecture

### Architecture

```
Repository Layer → Database operations
Service Layer → Business logic
Route Layer → HTTP handling
```

---

## Phase 4: Frontend Data Layer

### Tasks
- [ ] Install TanStack Query
- [ ] Create API client
- [ ] Create custom hooks
- [ ] Migrate components

### Hooks to Create

- `useBookings()` - Fetch bookings
- `useCreateBooking()` - Create booking
- `useUser()` - Current user

---

## Phase 5: Frontend TypeScript

### Migration Order

1. Context Providers
2. Custom Hooks
3. UI Components
4. Feature Components
5. Pages

### State Consolidation

- `useUIStore()` - Theme, sidebar
- `useAuthStore()` - Authentication

---

## Phase 6: Testing & Polish

### Tasks
- [ ] Update test config
- [ ] Migrate tests to TypeScript
- [ ] Update CI/CD pipeline
- [ ] Performance optimization

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Type Coverage | > 90% |
| Build Time | < 30s |
| Bundle Size | < 200KB |
| Test Coverage | > 80% |
| Lighthouse | > 90 |

- `useAuthStore()` - User authentication state

---

## Phase 6: Testing and Polish

### 6.1 Update Configuration

- Migrate vitest config to TypeScript
- Update test setup files

### 6.2 Migrate Tests

- Convert `.test.jsx` to `.test.tsx`
- Update mocks for TypeScript

### 6.3 CI/CD Updates

- Add TypeScript type checking to pipeline
- Update build scripts

---

## Implementation Checklist

### Phase 1: TypeScript Foundation
- [ ] Fix broken `tsconfig.json`
- [ ] Create `src/types/` directory with type definitions
- [ ] Migrate constants files to TypeScript
- [ ] Migrate utility files to TypeScript
- [ ] Update ESLint configuration

### Phase 2: Database Layer
- [ ] Install Prisma
- [ ] Create Prisma schema
- [ ] Run initial migration
- [ ] Create repository layer

### Phase 3: Backend Migration
- [ ] Install Hono
- [ ] Create Hono app structure
- [ ] Migrate authentication routes
- [ ] Migrate API routes
- [ ] Implement three-layer architecture

### Phase 4: Frontend Data Layer
- [ ] Install TanStack Query
- [ ] Create API client
- [ ] Create custom hooks
- [ ] Migrate components to use hooks

### Phase 5: Frontend TypeScript
- [ ] Migrate context providers
- [ ] Migrate hooks
- [ ] Migrate components
- [ ] Consolidate state management

### Phase 6: Testing & Polish
- [ ] Update test configuration
- [ ] Migrate tests
- [ ] Update CI/CD pipeline
- [ ] Performance optimization

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Type Coverage | > 90% |
| Build Time | < 30 seconds |
| Initial JS Bundle | < 200KB |
| Test Coverage | > 80% |
| Lighthouse Score | > 90 all metrics |

## Overview

This document provides a detailed implementation plan for modernizing the LUXE Detailing application from JavaScript to a fully type-safe, modern architecture.

## Current State Summary

### Critical Issues
1. **Broken `tsconfig.json`** - Malformed JSON with duplicate `compilerOptions` blocks
2. **No TypeScript Migration** - All files are `.jsx`/`.js` despite TypeScript being installed
3. **Raw SQL Queries** - Using tagged template literals without ORM protection
4. **Mixed State Management** - Both Zustand and Context API used inconsistently
5. **No Data Fetching Layer** - Manual fetch calls without caching

### Technology Stack Changes

| Layer | Current | Target |
|-------|---------|--------|
| Language | JavaScript | TypeScript |
| Backend Framework | Express.js 5.x | Hono.js |
| Database Access | Raw SQL + Neon serverless | Prisma ORM |
| Data Fetching | Manual fetch | TanStack Query |
| State Management | Zustand + Context API | Zustand only |

---

## Phase 1: TypeScript Foundation

### 1.1 Fix tsconfig.json

Replace the malformed `tsconfig.json` with a clean configuration.

### 1.2 Create Type Definitions

Create `src/types/` directory with:
- `api.ts` - API request/response types
- `models.ts` - Database model types  
- `components.ts` - Component prop types
- `hooks.ts` - Hook type definitions

### 1.3 Migrate Files

- `src/constants/config.js` → `config.ts`
- `src/constants/pricing.js` → `pricing.ts`
- Utility files in `src/utils/`

---

## Phase 2: Database Layer with Prisma

### 2.1 Install and Initialize

```bash
npm install prisma @prisma/client
npx prisma init
```

### 2.2 Create Prisma Schema

Convert `db/schema.sql` to `prisma/schema.prisma` with models for:
- User, Vehicle, ServicePackage, ServiceModule
- Booking, Payment, Session
- Enums for Role, BookingStatus, PaymentMethod, PaymentStatus

### 2.3 Repository Layer

Create `src/repositories/` with:
- `base.repository.ts`
- `user.repository.ts`
- `booking.repository.ts`
- `vehicle.repository.ts`

---

## Phase 3: Backend Migration to Hono

### 3.1 Install Hono

```bash
npm install hono @hono/node-server
```

### 3.2 Project Structure

```
src/server/
├── index.ts              # Entry point
├── app.ts                # Hono app configuration
├── middleware/           # auth, validation, errorHandler
├── routes/               # auth, booking, user routes
├── services/             # Business logic layer
└── repositories/         # Database operations
```

### 3.3 Three-Layer Architecture

- **Repository Layer** - Database operations only
- **Service Layer** - Business logic and validation
- **Route Layer** - HTTP handling and request validation

---

## Phase 4: Frontend Data Layer

### 4.1 Install TanStack Query

```bash
npm install @tanstack/react-query
```

### 4.2 API Client

Create type-safe API client with Zod validation.

### 4.3 Custom Hooks

- `useBookings()` - Fetch user bookings
- `useCreateBooking()` - Create new booking
- `useUser()` - Fetch current user

---

## Phase 5: Frontend TypeScript Migration

### 5.1 Migration Order

1. Context Providers (ThemeContext, ToastContext)
2. Custom Hooks (useScrollAnimation, useOptimizedAnimation)
3. UI Components (Components.jsx, Toast.jsx)
4. Feature Components (Layout, ErrorBoundary)
5. Pages (Home, Gallery, Calculator, Booking, Dashboard)

### 5.2 State Management

Consolidate to Zustand stores:
- `useUIStore()` - Theme, sidebar state
- `useAuthStore()` - User authentication state

---

## Phase 6: Testing and Polish

### 6.1 Update Configuration

- Migrate vitest config to TypeScript
- Update test setup files

### 6.2 Migrate Tests

- Convert `.test.jsx` to `.test.tsx`
- Update mocks for TypeScript

### 6.3 CI/CD Updates

- Add TypeScript type checking to pipeline
- Update build scripts

---

## Implementation Checklist

### Phase 1: TypeScript Foundation
- [ ] Fix broken `tsconfig.json`
- [ ] Create `src/types/` directory with type definitions
- [ ] Migrate constants files to TypeScript
- [ ] Migrate utility files to TypeScript
- [ ] Update ESLint configuration

### Phase 2: Database Layer
- [ ] Install Prisma
- [ ] Create Prisma schema
- [ ] Run initial migration
- [ ] Create repository layer

### Phase 3: Backend Migration
- [ ] Install Hono
- [ ] Create Hono app structure
- [ ] Migrate authentication routes
- [ ] Migrate API routes
- [ ] Implement three-layer architecture

### Phase 4: Frontend Data Layer
- [ ] Install TanStack Query
- [ ] Create API client
- [ ] Create custom hooks
- [ ] Migrate components to use hooks

### Phase 5: Frontend TypeScript
- [ ] Migrate context providers
- [ ] Migrate hooks
- [ ] Migrate components
- [ ] Consolidate state management

### Phase 6: Testing & Polish
- [ ] Update test configuration
- [ ] Migrate tests
- [ ] Update CI/CD pipeline
- [ ] Performance optimization

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Type Coverage | > 90% |
| Build Time | < 30 seconds |
| Initial JS Bundle | < 200KB |
| Test Coverage | > 80% |
| Lighthouse Score | > 90 all metrics |

}

model Booking {
  id               String                 @id @default(uuid())
  userId           String?
  vehicleId        String?
  date             DateTime               @db.Date
  time             DateTime               @db.Time
  carModel         String
  packageId        String?
  selectedModules  String[]
  totalPrice       Decimal                @db.Decimal(10, 2)
  status           BookingStatus          @default(PENDING)
  notes            String?
  createdAt        DateTime               @default(now())
  updatedAt        DateTime               @updatedAt
  completedAt      DateTime?
  user             User?                  @relation(fields: [userId], references: [id], onDelete: SetNull)
  vehicle          Vehicle?               @relation(fields: [vehicleId], references: [id], onDelete: SetNull)
  package          ServicePackage?        @relation(fields: [packageId], references: [id], onDelete: SetNull)
  payments         Payment[]
  statusHistory    BookingStatusHistory[]

  @@index([date])
  @@index([status])
  @@index([userId])
  @@map("bookings")
}

enum BookingStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model BookingStatusHistory {
  id        String       @id @default(uuid())
  bookingId String
  status    String
  notes     String?
  createdAt DateTime     @default(now())
  updatedBy String?
  booking   Booking      @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@map("booking_status_history")
}

model Payment {
  id             String        @id @default(uuid())
  bookingId      String
  amount         Decimal       @db.Decimal(10, 2)
  paymentMethod  PaymentMethod
  transactionId  String?
  status         PaymentStatus @default(PENDING)
  notes          String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  booking        Booking       @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@map("payments")
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  CASH
  PAYPAL
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token        String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  lastAccessed DateTime @default(now())

  @@index([token])
  @@index([expiresAt])
  @@map("sessions")
}
```

### 2.3 Repository Layer Structure

```
src/
├── repositories/
│   ├── base.repository.ts
│   ├── user.repository.ts
│   ├── booking.repository.ts
│   ├── vehicle.repository.ts
│   └── index.ts
```

---

## Phase 3: Backend Migration to Hono

### 3.1 Install Hono

```bash
npm install hono @hono/node-server
npm install -D @types/hono
```

### 3.2 Project Structure

```
src/
├── server/
│   ├── index.ts              # Entry point
│   ├── app.ts                # Hono app configuration
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   └── user.service.ts
│   └── repositories/
│       ├── user.repository.ts
│       ├── booking.repository.ts
│       └── index.ts
```

### 3.3 Three-Layer Architecture Example

**Repository Layer** (Database operations):
```typescript
// src/server/repositories/booking.repository.ts
import { prisma } from '@/lib/prisma';
import type { Booking, BookingStatus } from '@prisma/client';

export class BookingRepository {
  async findById(id: string): Promise<Booking | null> {
    return prisma.booking.findUnique({ where: { id } });
  }

  async findByUserId(userId: string, options?: { status?: BookingStatus }) {
    return prisma.booking.findMany({
      where: { userId, ...(options?.status && { status: options.status }) },
      include: { vehicle: true, package: true },
    });
  }

  async create(data: CreateBookingInput): Promise<Booking> {
    return prisma.booking.create({ data });
  }
}

export const bookingRepository = new BookingRepository();
```

**Service Layer** (Business logic):
```typescript
// src/server/services/booking.service.ts
import { bookingRepository } from '@/server/repositories';
import type { CreateBookingInput } from '@/types';

export class BookingService {
  async createBooking(input: CreateBookingInput) {
    // Validate business rules
    const existingBooking = await bookingRepository.findByDateAndTime(
      input.date,
      input.time
    );
    if (existingBooking) {
      throw new ConflictError('Time slot already booked');
    }

    // Calculate pricing
    const totalPrice = await this.calculatePrice(input);

    return bookingRepository.create({ ...input, totalPrice });
  }

  private async calculatePrice(input: CreateBookingInput): Promise<number> {
    // Price calculation logic
  }
}

export const bookingService = new BookingService();
```

**Route Layer** (HTTP handling):
```typescript
// src/server/routes/booking.routes.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { bookingService } from '@/server/services';
import { createBookingSchema } from '@/schemas';

const app = new Hono();

app.post('/', zValidator('json', createBookingSchema), async (c) => {
  const data = c.req.valid('json');
  const booking = await bookingService.createBooking(data);
  return c.json({ booking }, 201);
});

export default app;
```

---

## Phase 4: Frontend Data Layer

### 4.1 Install TanStack Query

```bash
npm install @tanstack/react-query
```

### 4.2 API Client Setup

```typescript
// src/lib/api-client.ts
import { z } from 'zod';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '/api';
  }

  async get<T extends z.ZodType>(
    path: string,
    schema: T
  ): Promise<z.infer<T>> {
    const response = await fetch(`${this.baseUrl}${path}`);
    if (!response.ok) throw new ApiError(response);
    const data = await response.json();
    return schema.parse(data);
  }

  async post<T extends z.ZodType>(
    path: string,
    body: unknown,
    schema: T
  ): Promise<z.infer<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new ApiError(response);
    const data = await response.json();
    return schema.parse(data);
  }
}

export const apiClient = new ApiClient();
```

### 4.3 Custom Hooks

```typescript
// src/hooks/useBookings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { bookingSchema } from '@/schemas';

export function useBookings(userId: string) {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => apiClient.get(`/bookings?userId=${userId}`, z.array(bookingSchema)),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingInput) =>
      apiClient.post('/bookings', data, bookingSchema),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
```

---

## Phase 5: Frontend TypeScript Migration

### 5.1 Migration Order

1. **Context Providers** (ThemeContext, ToastContext)
2. **Custom Hooks** (useScrollAnimation, useOptimizedAnimation)
3. **UI Components** (Components.jsx, Toast.jsx)
4. **Feature Components** (Layout, ErrorBoundary, etc.)
5. **Pages** (Home, Gallery, Calculator, Booking, Dashboard)

### 5.2 Component Migration Example

**Before (JSX):**
```jsx
// src/components/ui/Components.jsx
export function Button({ children, variant = 'primary', onClick, className }) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

**After (TSX):**
```typescript
// src/components/ui/Components.tsx
import { type ReactNode, type MouseEventHandler } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### 5.3 State Management Consolidation

Replace Context API with Zustand stores:

```typescript
// src/stores/ui.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    { name: 'ui-storage' }
  )
);
```

---

## Phase 6: Testing and Polish

### 6.1 Update Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 6.2 Test Migration Example

```typescript
// src/components/ui/Components.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Components';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Implementation Checklist

### Phase 1: TypeScript Foundation
- [ ] Fix broken `tsconfig.json`
- [ ] Create `src/types/` directory with type definitions
- [ ] Migrate `src/constants/config.js` → `config.ts`
- [ ] Migrate `src/constants/pricing.js` → `pricing.ts`
- [ ] Migrate utility files to TypeScript
- [ ] Update ESLint configuration for TypeScript

### Phase 2: Database Layer
- [ ] Install Prisma
- [ ] Create Prisma schema from `db/schema.sql`
- [ ] Run initial migration
- [ ] Create repository layer
- [ ] Update database connection

### Phase 3: Backend Migration
- [ ] Install Hono
- [ ] Create Hono app structure
- [ ] Migrate authentication routes
- [ ] Migrate API routes
- [ ] Implement three-layer architecture

### Phase 4: Frontend Data Layer
- [ ] Install TanStack Query
- [ ] Create API client
- [ ] Create custom hooks
- [ ] Migrate components to use hooks

### Phase 5: Frontend TypeScript
- [ ] Migrate context providers
- [ ] Migrate hooks
- [ ] Migrate components
- [ ] Consolidate state management

### Phase 6: Testing & Polish
- [ ] Update test configuration
- [ ] Migrate tests
- [ ] Update CI/CD pipeline
- [ ] Performance optimization

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Type Coverage | > 90% |
| Build Time | < 30 seconds |
| Initial JS Bundle | < 200KB |
| Test Coverage | > 80% |
| Lighthouse Score | > 90 all metrics |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking changes | Incremental migration with feature flags |
| Data loss | Prisma migrations with backup strategy |
| Performance regression | Benchmark before/after each phase |
| Learning curve | Documentation and pair programming |

## Overview

This document provides a detailed, actionable implementation plan for modernizing the LUXE Detailing application. The modernization transforms the codebase from JavaScript to a fully type-safe, modern architecture.

## Current State Summary

### Critical Issues to Fix Immediately
1. **Broken `tsconfig.json`** - Malformed JSON with duplicate `compilerOptions` blocks
2. **No TypeScript Migration** - All files are `.jsx`/`.js` despite TypeScript being installed
3. **Raw SQL Queries** - Using tagged template literals without ORM protection
4. **Mixed State Management** - Both Zustand and Context API used inconsistently
5. **No Data Fetching Layer** - Manual fetch calls without caching

### Technology Stack Changes

| Layer | Current | Target |
|-------|---------|--------|
| Language | JavaScript | TypeScript |
| Backend Framework | Express.js 5.x | Hono.js |
| Database Access | Raw SQL + Neon serverless | Prisma ORM |
| Data Fetching | Manual fetch | TanStack Query |
| State Management | Zustand + Context API | Zustand only |

---

## Phase 1: TypeScript Foundation

### 1.1 Fix tsconfig.json

The current `tsconfig.json` is malformed with duplicate `compilerOptions` blocks. Replace with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "allowJs": true,
    "checkJs": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@utils/*": ["./src/utils/*"],
      "@context/*": ["./src/context/*"],
      "@constants/*": ["./src/constants/*"],
      "@types/*": ["./src/types/*"]
    },
    "types": ["vite/client", "node"]
  },
  "include": [
    "src/**/*",
    "api/**/*",
    "auth/**/*",
    "db/**/*",
    "routes/**/*",
    "vite.config.js",
    "server.js"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "playwright-report"
  ]
}
```

### 1.2 Create Type Definitions Structure

Create the following files in `src/types/`:

```
src/types/
├── api.ts          # API request/response types
├── models.ts       # Database model types
├── components.ts   # Component prop types
└── hooks.ts        # Hook type definitions
```

### 1.3 Files to Migrate in Phase 1

**Constants (easiest, no dependencies):**
- `src/constants/config.js` → `config.ts`
- `src/constants/pricing.js` → `pricing.ts`

**Utilities:**
- `src/utils/soundManager.js` → `soundManager.ts`
- Other utility files in `src/utils/`

---

## Phase 2: Database Layer with Prisma

### 2.1 Install Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

### 2.2 Prisma Schema

Create `prisma/schema.prisma` based on existing `db/schema.sql`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  firstName     String?
  lastName      String?
  phone         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  lastLogin     DateTime?
  isActive      Boolean   @default(true)
  role          Role      @default(CUSTOMER)
  vehicles      Vehicle[]
  bookings      Booking[]
  sessions      Session[]
  statusHistory BookingStatusHistory[]

  @@map("users")
}

enum Role {
  ADMIN
  STAFF
  CUSTOMER
}

model Vehicle {
  id           String    @id @default(uuid())
  userId       String
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  make         String
  model        String
  year         Int
  color        String?
  licensePlate String?
  vin          String?
  notes        String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  bookings     Booking[]

  @@map("vehicles")
}

model ServicePackage {
  id           String          @id @default(uuid())
  name         String
  description  String?
  basePrice    Decimal         @db.Decimal(10, 2)
  durationHours Int?
  category     String
  isActive     Boolean         @default(true)
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
  modules      PackageModule[]
  bookings     Booking[]

  @@map("service_packages")
}

model ServiceModule {
  id            String          @id @default(uuid())
  name          String
  description   String?
  price         Decimal         @db.Decimal(10, 2)
  durationHours Int?
  category      String
  isActive      Boolean         @default(true)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  packages      PackageModule[]

  @@map("service_modules")
}

model PackageModule {
  packageId String
  moduleId  String
  package   ServicePackage @relation(fields: [packageId], references: [id], onDelete: Cascade)
  module    ServiceModule  @relation(fields: [moduleId], references: [id], onDelete: Cascade)

  @@id([packageId, moduleId])
  @@map("package_modules")
}

model Booking {
  id               String                 @id @default(uuid())
  userId           String?
  vehicleId        String?
  date             DateTime               @db.Date
  time             DateTime               @db.Time
  carModel         String
  packageId        String?
  selectedModules  String[]
  totalPrice       Decimal                @db.Decimal(10, 2)
  status           BookingStatus          @default(PENDING)
  notes            String?
  createdAt        DateTime               @default(now())
  updatedAt        DateTime               @updatedAt
  completedAt      DateTime?
  user             User?                  @relation(fields: [userId], references: [id], onDelete: SetNull)
  vehicle          Vehicle?               @relation(fields: [vehicleId], references: [id], onDelete: SetNull)
  package          ServicePackage?        @relation(fields: [packageId], references: [id], onDelete: SetNull)
  payments         Payment[]
  statusHistory    BookingStatusHistory[]

  @@index([date])
  @@index([status])
  @@index([userId])
  @@map("bookings")
}

enum BookingStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model BookingStatusHistory {
  id        String       @id @default(uuid())
  bookingId String
  status    String
  notes     String?
  createdAt DateTime     @default(now())
  updatedBy String?
  booking   Booking      @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@map("booking_status_history")
}

model Payment {
  id             String        @id @default(uuid())
  bookingId      String
  amount         Decimal       @db.Decimal(10, 2)
  paymentMethod  PaymentMethod
  transactionId  String?
  status         PaymentStatus @default(PENDING)
  notes          String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  booking        Booking       @relation(fields: [bookingId], references: [id], onDelete: Cascade)

  @@map("payments")
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  CASH
  PAYPAL
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token        String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  lastAccessed DateTime @default(now())

  @@index([token])
  @@index([expiresAt])
  @@map("sessions")
}
```

### 2.3 Repository Layer Structure

```
src/
├── repositories/
│   ├── base.repository.ts
│   ├── user.repository.ts
│   ├── booking.repository.ts
│   ├── vehicle.repository.ts
│   └── index.ts
```

---

## Phase 3: Backend Migration to Hono

### 3.1 Install Hono

```bash
npm install hono @hono/node-server
npm install -D @types/hono
```

### 3.2 Project Structure

```
src/
├── server/
│   ├── index.ts              # Entry point
│   ├── app.ts                # Hono app configuration
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── booking.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── booking.service.ts
│   │   └── user.service.ts
│   └── repositories/
│       ├── user.repository.ts
│       ├── booking.repository.ts
│       └── index.ts
```

### 3.3 Three-Layer Architecture Example

**Repository Layer** (Database operations):
```typescript
// src/server/repositories/booking.repository.ts
import { prisma } from '@/lib/prisma';
import type { Booking, BookingStatus } from '@prisma/client';

export class BookingRepository {
  async findById(id: string): Promise<Booking | null> {
    return prisma.booking.findUnique({ where: { id } });
  }

  async findByUserId(userId: string, options?: { status?: BookingStatus }) {
    return prisma.booking.findMany({
      where: { userId, ...(options?.status && { status: options.status }) },
      include: { vehicle: true, package: true },
    });
  }

  async create(data: CreateBookingInput): Promise<Booking> {
    return prisma.booking.create({ data });
  }
}

export const bookingRepository = new BookingRepository();
```

**Service Layer** (Business logic):
```typescript
// src/server/services/booking.service.ts
import { bookingRepository } from '@/server/repositories';
import type { CreateBookingInput } from '@/types';

export class BookingService {
  async createBooking(input: CreateBookingInput) {
    // Validate business rules
    const existingBooking = await bookingRepository.findByDateAndTime(
      input.date,
      input.time
    );
    if (existingBooking) {
      throw new ConflictError('Time slot already booked');
    }

    // Calculate pricing
    const totalPrice = await this.calculatePrice(input);

    return bookingRepository.create({ ...input, totalPrice });
  }

  private async calculatePrice(input: CreateBookingInput): Promise<number> {
    // Price calculation logic
  }
}

export const bookingService = new BookingService();
```

**Route Layer** (HTTP handling):
```typescript
// src/server/routes/booking.routes.ts
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { bookingService } from '@/server/services';
import { createBookingSchema } from '@/schemas';

const app = new Hono();

app.post('/', zValidator('json', createBookingSchema), async (c) => {
  const data = c.req.valid('json');
  const booking = await bookingService.createBooking(data);
  return c.json({ booking }, 201);
});

export default app;
```

---

## Phase 4: Frontend Data Layer

### 4.1 Install TanStack Query

```bash
npm install @tanstack/react-query
```

### 4.2 API Client Setup

```typescript
// src/lib/api-client.ts
import { z } from 'zod';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || '/api';
  }

  async get<T extends z.ZodType>(
    path: string,
    schema: T
  ): Promise<z.infer<T>> {
    const response = await fetch(`${this.baseUrl}${path}`);
    if (!response.ok) throw new ApiError(response);
    const data = await response.json();
    return schema.parse(data);
  }

  async post<T extends z.ZodType>(
    path: string,
    body: unknown,
    schema: T
  ): Promise<z.infer<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new ApiError(response);
    const data = await response.json();
    return schema.parse(data);
  }
}

export const apiClient = new ApiClient();
```

### 4.3 Custom Hooks

```typescript
// src/hooks/useBookings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { bookingSchema } from '@/schemas';

export function useBookings(userId: string) {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => apiClient.get(`/bookings?userId=${userId}`, z.array(bookingSchema)),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingInput) =>
      apiClient.post('/bookings', data, bookingSchema),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
```

---

## Phase 5: Frontend TypeScript Migration

### 5.1 Migration Order

1. **Context Providers** (ThemeContext, ToastContext)
2. **Custom Hooks** (useScrollAnimation, useOptimizedAnimation)
3. **UI Components** (Components.jsx, Toast.jsx)
4. **Feature Components** (Layout, ErrorBoundary, etc.)
5. **Pages** (Home, Gallery, Calculator, Booking, Dashboard)

### 5.2 Component Migration Example

**Before (JSX):**
```jsx
// src/components/ui/Components.jsx
export function Button({ children, variant = 'primary', onClick, className }) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

**After (TSX):**
```typescript
// src/components/ui/Components.tsx
import { type ReactNode, type MouseEventHandler } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### 5.3 State Management Consolidation

Replace Context API with Zustand stores:

```typescript
// src/stores/ui.store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: false,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    { name: 'ui-storage' }
  )
);
```

---

## Phase 6: Testing and Polish

### 6.1 Update Test Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 6.2 Test Migration Example

```typescript
// src/components/ui/Components.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Components';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Implementation Checklist

### Phase 1: TypeScript Foundation
- [ ] Fix broken `tsconfig.json`
- [ ] Create `src/types/` directory with type definitions
- [ ] Migrate `src/constants/config.js` → `config.ts`
- [ ] Migrate `src/constants/pricing.js` → `pricing.ts`
- [ ] Migrate utility files to TypeScript
- [ ] Update ESLint configuration for TypeScript

### Phase 2: Database Layer
- [ ] Install Prisma
- [ ] Create Prisma schema from `db/schema.sql`
- [ ] Run initial migration
- [ ] Create repository layer
- [ ] Update database connection

### Phase 3: Backend Migration
- [ ] Install Hono
- [ ] Create Hono app structure
- [ ] Migrate authentication routes
- [ ] Migrate API routes
- [ ] Implement three-layer architecture

### Phase 4: Frontend Data Layer
- [ ] Install TanStack Query
- [ ] Create API client
- [ ] Create custom hooks
- [ ] Migrate components to use hooks

### Phase 5: Frontend TypeScript
- [ ] Migrate context providers
- [ ] Migrate hooks
- [ ] Migrate components
- [ ] Consolidate state management

### Phase 6: Testing & Polish
- [ ] Update test configuration
- [ ] Migrate tests
- [ ] Update CI/CD pipeline
- [ ] Performance optimization

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Type Coverage | > 90% |
| Build Time | < 30 seconds |
| Initial JS Bundle | < 200KB |
| Test Coverage | > 80% |
| Lighthouse Score | > 90 all metrics |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking changes | Incremental migration with feature flags |
| Data loss | Prisma migrations with backup strategy |
| Performance regression | Benchmark before/after each phase |
| Learning curve | Documentation and pair programming |

