# Detailing Service API Documentation

## Overview
This is a comprehensive REST API for a vehicle detailing service management system. The API provides endpoints for user authentication, booking management, service packages, and vehicle information.

## Base URL
- Development: `http://localhost:3000/api/v1`
- Production: `https://yourdomain.com/api/v1`

## Authentication
Most endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Rate Limiting
- Global limit: 1000 requests per 15 minutes per IP
- Auth endpoints: 5 requests per 15 minutes per IP
- Booking endpoints: 10 requests per hour per IP

## Error Responses
All error responses follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## API Endpoints

### Authentication

#### Register User
**POST** `/auth/register`
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Login
**POST** `/auth/login`
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Refresh Token
**POST** `/auth/refresh`
```json
{
  "refreshToken": "refresh_token_here"
}
```

#### Logout
**POST** `/auth/logout`
```json
{
  "refreshToken": "refresh_token_here"
}
```

#### Password Reset Request
**POST** `/auth/password-reset/request`
```json
{
  "email": "user@example.com"
}
```

#### Password Reset
**POST** `/auth/password-reset/reset`
```json
{
  "token": "reset_token_here",
  "newPassword": "newsecurepassword123"
}
```

### Bookings

#### Get All Bookings
**GET** `/bookings`
Query Parameters:
- `limit` (optional): Number of results (default: 10)
- `offset` (optional): Offset for pagination (default: 0)
- `status` (optional): Filter by status
- `sortBy` (optional): Field to sort by (default: created_at)
- `sortOrder` (optional): ASC or DESC (default: DESC)

#### Get Booking by ID
**GET** `/bookings/:id`

#### Create Booking
**POST** `/bookings`
```json
{
  "date": "2024-01-15",
  "time": "14:30",
  "carModel": "Tesla Model 3",
  "packageId": "uuid-here",
  "selectedModules": ["module-uuid-1", "module-uuid-2"],
  "totalPrice": 899.99,
  "notes": "Please pay extra attention to the front bumper"
}
```

#### Update Booking
**PUT** `/bookings/:id`
(Same structure as create, but only include fields to update)

#### Delete Booking
**DELETE** `/bookings/:id`
(Only pending bookings can be deleted)

### Vehicles

#### Get User Vehicles
**GET** `/vehicles`

#### Add Vehicle
**POST** `/vehicles`
```json
{
  "make": "Tesla",
  "model": "Model 3",
  "year": 2023,
  "color": "Red",
  "licensePlate": "ABC123",
  "vin": "VIN1234567890",
  "notes": "Electric vehicle"
}
```

### Services

#### Get Service Packages
**GET** `/services/packages`

#### Get Service Modules
**GET** `/services/modules`

## Response Formats

### Successful Booking Creation
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "uuid-here",
    "createdAt": "2024-01-10T10:30:00Z"
  }
}
```

### Booking List
```json
{
  "data": [
    {
      "id": "uuid-here",
      "date": "2024-01-15",
      "time": "14:30:00",
      "car_model": "Tesla Model 3",
      "total_price": 899.99,
      "status": "confirmed",
      "created_at": "2024-01-10T10:30:00Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Too Many Requests
- `500`: Internal Server Error

## Security Features
- JWT-based authentication
- Rate limiting
- Input validation
- SQL injection protection
- CORS configuration
- Helmet security headers
- Password hashing with bcrypt

## Validation Rules
- Email: Valid email format
- Password: Minimum 8 characters
- Date: YYYY-MM-DD format
- Time: HH:MM format (24-hour)
- Price: Positive decimal number
- UUID: Valid UUID format

## Caching
- Service packages: 30 minutes
- Service modules: 30 minutes
- User vehicles: 10 minutes
- Bookings: 5 minutes

## Monitoring
The API includes comprehensive logging for:
- All HTTP requests
- Database queries with timing
- Error tracking
- Performance metrics
- Security events

## Testing
Run tests with:
```bash
npm test
npm run test:watch
```

## Deployment
For production deployment:
1. Set `NODE_ENV=production`
2. Configure proper database connection
3. Set strong JWT secret
4. Configure CORS origins
5. Enable HTTPS
6. Set up monitoring and alerting

## Environment Variables
```
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
NODE_ENV=development|production
LOG_LEVEL=INFO|DEBUG|WARN|ERROR
PORT=3000
```