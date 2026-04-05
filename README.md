# Finance Dashboard Backend

A well-structured REST API backend for a finance dashboard system with role-based access control, built with Node.js, Express, and MongoDB.

## Overview

This backend system manages financial records, users, and roles with comprehensive access control. It demonstrates proper API design, data validation, error handling, and business logic separation.

## Features

### Core Features
- ✅ User and Role Management (VIEWER, ANALYST, ADMIN)
- ✅ Financial Records CRUD Operations
- ✅ Role-Based Access Control (RBAC)
- ✅ Dashboard Summary APIs with Analytics
- ✅ Comprehensive Input Validation
- ✅ Error Handling with Proper Status Codes
- ✅ Audit Logging
- ✅ Soft Delete Functionality
- ✅ Pagination Support
- ✅ Advanced Filtering

### User Roles

1. **VIEWER**
   - Can only view their own financial records
   - Can access dashboard summaries
   - Cannot create, update, or delete records

2. **ANALYST**
   - Can view and filter financial records
   - Can create financial records
   - Can update their own records
   - Cannot delete records
   - Full dashboard access

3. **ADMIN**
   - Full access to all records (own and others')
   - Can create, update, and delete financial records
   - Can manage users and their roles
   - Can manage user status (activate/deactivate)
   - Full audit trail access

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Environment**: dotenv

## Project Structure

```
finance-dashboard-backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── userController.js
│   │   ├── financialRecordController.js
│   │   └── dashboardController.js
│   ├── services/              # Business logic
│   │   ├── userService.js
│   │   ├── financialRecordService.js
│   │   └── dashboardService.js
│   ├── middleware/            # Express middleware
│   │   ├── authenticate.js    # JWT verification
│   │   └── authorize.js       # Role-based access control
│   ├── routes/                # API routes
│   │   ├── userRoutes.js
│   │   ├── financialRecordRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/                 # Utility functions
│   │   ├── database.js        # Prisma client
│   │   ├── database.js        # MongoDB client
│   │   ├── jwt.js             # JWT utilities
│   │   ├── validation.js      # Joi schemas
│   │   └── appError.js        # Error class
│   ├── scripts/               # Setup and seed scripts
│   │   ├── setup.js
│   │   └── seed.js
│   └── server.js              # Express app setupiables template
├── package.json
└── README.md
```

## Setup Instructions

### 1. Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### 2. Installation

```bash
cd finance-dashboard-backend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection details:

```
DATABASE_URL="postgresql://username:password@localhost:5432/finance_dashboard?schema=public"
PORT=3000
NODE_ENV=development
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRY="24h"
```

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 5. Seed Database (Optional)

Populate the database with sample data:

```bash
npm run seed
```

This creates:
- Admin user (admin@example.com / admin123)
- Analyst user (analyst@example.com / analyst123)
- Viewer user (viewer@example.com / viewer123)
- Sample financial records

### 6. Start the Server

```bash
npm run dev
```

Server runs on http://localhost:3000

## API Documentation

### Authentication

Use token in headers: `token: <your-jwt-token>`

### User Endpoints

#### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response: 201 Created
{
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "VIEWER"
  }
}
```

#### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "VIEWER"
  }
}
```

#### Get Current User
```
GET /api/users/me
Authorization: Bearer <token>

Response: 200 OK
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "VIEWER",
    "status": "ACTIVE"
  }
}
```

#### Get All Users (Admin Only)
```
GET /api/users/all?page=1&limit=10
Authorization: Bearer <admin-token>

Response: 200 OK
{
  "users": [...],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "pages": 2
  }
}
```

#### Update User Role (Admin Only)
```
PUT /api/users/:id/role
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "ANALYST"
}

Response: 200 OK
{
  "message": "User role updated successfully.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ANALYST"
  }
}
```

#### Update User Status (Admin Only)
```
PUT /api/users/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "INACTIVE"
}

Response: 200 OK
{
  "message": "User status updated successfully.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "status": "INACTIVE"
  }
}
```

### Financial Record Endpoints

#### Create Record (ANALYST/ADMIN Only)
```
POST /api/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "EXPENSE",
  "category": "GROCERY",
  "amount": 150.50,
  "date": "2024-01-15T10:30:00Z",
  "notes": "Weekly groceries"
}

Response: 201 Created
{
  "message": "Financial record created successfully.",
  "record": {
    "id": 1,
    "userId": 1,
    "type": "EXPENSE",
    "category": "GROCERY",
    "amount": 150.50,
    "date": "2024-01-15T10:30:00Z",
    "notes": "Weekly groceries",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

#### Get User's Records
```
GET /api/records?page=1&limit=10&type=INCOME&category=SALARY&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>

Response: 200 OK
{
  "records": [...],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Records per page (default: 10)
- `type`: INCOME or EXPENSE
- `category`: SALARY, BONUS, FREELANCE, INVESTMENT, GROCERY, UTILITIES, ENTERTAINMENT, TRAVEL, HEALTHCARE, OTHER
- `startDate`: ISO date string
- `endDate`: ISO date string
- `minAmount`: Minimum amount
- `maxAmount`: Maximum amount

#### Get Specific Record
```
GET /api/records/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "record": {
    "id": 1,
    "userId": 1,
    "type": "EXPENSE",
    "category": "GROCERY",
    "amount": 150.50,
    "date": "2024-01-15T10:30:00Z",
    "notes": "Weekly groceries",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

#### Update Record (ANALYST/ADMIN Only)
```
PUT /api/records/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 200,
  "notes": "Updated amount"
}

Response: 200 OK
{
  "message": "Financial record updated successfully.",
  "record": {
    "id": 1,
    "userId": 1,
    "type": "EXPENSE",
    "category": "GROCERY",
    "amount": 200,
    "date": "2024-01-15T10:30:00Z",
    "notes": "Updated amount",
    "createdAt": "2024-01-15T12:00:00Z",
    "updatedAt": "2024-01-16T09:00:00Z"
  }
}
```

#### Delete Record (ADMIN Only)
```
DELETE /api/records/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Financial record deleted successfully."
}
```

### Dashboard Endpoints

#### Get Summary
```
GET /api/dashboard/summary
Authorization: Bearer <token>

Response: 200 OK
{
  "summary": {
    "totalIncome": 6500,
    "totalExpenses": 700,
    "netBalance": 5800,
    "recordCount": 6
  }
}
```

#### Get Category Breakdown
```
GET /api/dashboard/category-breakdown
Authorization: Bearer <token>

Response: 200 OK
{
  "breakdown": {
    "SALARY": {
      "income": 5000,
      "expense": 0,
      "total": 5000
    },
    "FREELANCE": {
      "income": 1500,
      "expense": 0,
      "total": 1500
    },
    "GROCERY": {
      "income": 0,
      "expense": 200,
      "total": -200
    },
    ...
  }
}
```

#### Get Monthly Trend
```
GET /api/dashboard/monthly-trend?months=12
Authorization: Bearer <token>

Response: 200 OK
{
  "trends": {
    "2023-01": {
      "income": 6500,
      "expense": 700
    },
    "2023-02": {
      "income": 5000,
      "expense": 950
    },
    ...
  }
}
```

#### Get Recent Activity
```
GET /api/dashboard/recent-activity?days=30&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "activity": [
    {
      "id": 6,
      "userId": 1,
      "type": "EXPENSE",
      "category": "TRAVEL",
      "amount": 300,
      "date": "2024-01-15T15:00:00Z",
      "notes": "Gas and car maintenance",
      "createdAt": "2024-01-15T16:00:00Z",
      "updatedAt": "2024-01-15T16:00:00Z"
    },
    ...
  ]
}
```

#### Get Expenses by Category
```
GET /api/dashboard/expenses-by-category
Authorization: Bearer <token>

Response: 200 OK
{
  "expenses": {
    "GROCERY": 200,
    "UTILITIES": 150,
    "ENTERTAINMENT": 50,
    "TRAVEL": 300
  }
}
```

#### Get Income by Category
```
GET /api/dashboard/income-by-category
Authorization: Bearer <token>

Response: 200 OK
{
  "income": {
    "SALARY": 5000,
    "FREELANCE": 1500,
    "BONUS": 0,
    "INVESTMENT": 0
  }
}
```

## Data Model

### User
```
id (Int) - Primary key
email (String) - Unique
password (String) - Stored password (not hashed in demo)
name (String)
role (Enum: VIEWER, ANALYST, ADMIN)
status (Enum: ACTIVE, INACTIVE)
createdAt (DateTime)
updatedAt (DateTime)
```

### FinancialRecord
```
id (Int) - Primary key
userId (Int) - Foreign key to User
type (Enum: INCOME, EXPENSE)
category (Enum: SALARY, BONUS, FREELANCE, INVESTMENT, GROCERY, UTILITIES, ENTERTAINMENT, TRAVEL, HEALTHCARE, OTHER)
amount (Float)
date (DateTime)
notes (String)
deletedAt (DateTime) - For soft delete
createdAt (DateTime)
updatedAt (DateTime)
```

### AuditLog
```
id (Int) - Primary key
userId (Int) - Foreign key to User
action (String: CREATE, UPDATE, DELETE, LOGIN)
resource (String: User, FinancialRecord, etc.)
resourceId (Int)
changes (String) - JSON stringified
createdAt (DateTime)
```

## Access Control Matrix

| Action | VIEWER | ANALYST | ADMIN |
|--------|--------|---------|-------|
| View Own Records | ✓ | ✓ | ✓ |
| View Others' Records | ✗ | ✗ | ✓ |
| Create Records | ✗ | ✓ | ✓ |
| Update Own Records | ✗ | ✓ | ✓ |
| Update Others' Records | ✗ | ✗ | ✓ |
| Delete Records | ✗ | ✗ | ✓ |
| View Dashboard | ✓ | ✓ | ✓ |
| Manage Users | ✗ | ✗ | ✓ |
| Manage Roles | ✗ | ✗ | ✓ |

## Error Handling

The API uses standard HTTP status codes:

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (authentication required or failed)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate email, etc.)
- **500**: Internal Server Error

Error Response Format:
```json
{
  "error": "Error message describing what went wrong"
}
```

## Validation

All inputs are validated using Joi schemas:

- Email format validation
- Password minimum length (6 characters)
- Positive amount validation
- Valid enum values for type, category, role, status
- ISO date format for dates
- Pagination bounds (page >= 1, limit >= 1)

## Key Design Decisions

### 1. Soft Deletes
Financial records use soft deletes (`deletedAt` field) rather than hard deletes to maintain data integrity and audit trails.

### 2. Separation of Concerns
- Controllers handle request/response
- Services contain business logic
- Middleware handles authentication/authorization
- Utilities provide helpers and validation

### 3. Password Storage (Demo)
In the demo, passwords are stored as plain text for simplicity. In production, use bcrypt for hashing.

### 4. JWT Authentication
Stateless JWT tokens allow scalable authentication without server-side session storage.

### 5. Pagination
Large result sets are paginated (10 per page by default) to improve performance.

### 6. Audit Logging
All record modifications are logged for compliance and debugging.

## Limitations & Future Improvements

### Current Limitations
- Passwords not hashed (plain text in demo)
- No rate limiting
- No request logging middleware
- No real-time notifications
- No bulk operations

### Potential Enhancements
1. **Security**
   - Implement bcrypt for password hashing
   - Add request rate limiting
   - Implement CORS properly
   - Add input sanitization

2. **Features**
   - Add recurring transactions
   - Implement budget alerts
   - Add transaction search
   - Export to CSV/PDF
   - Mobile API versioning

3. **Performance**
   - Add database query caching
   - Implement request logging
   - Add database indexes optimization
   - Implement API documentation with Swagger

4. **Testing**
   - Add unit tests
   - Add integration tests
   - Add end-to-end tests

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@localhost:5432/db |
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |
| JWT_SECRET | Secret key for JWT signing | your-secret-key |
| JWT_EXPIRY | Token expiration time | 24h |

## Testing the API

### Using curl

```bash
# Register
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "User Name"
  }'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get Summary (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/dashboard/summary \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Create a new collection "Finance Dashboard"
2. Set base URL variable: `{{base_url}}` = `http://localhost:3000`
3. Set auth token variable: `{{token}}`
4. Import the endpoints from documentation above
5. Use Tests tab to automatically set `{{token}}` after login

## Files Overview

### Controllers
- **userController.js**: Register, login, user management
- **financialRecordController.js**: CRUD operations for records
- **dashboardController.js**: Analytics and summary endpoints

### Services
- **userService.js**: User authentication and management logic
- **financialRecordService.js**: Record CRUD and filtering logic
- **dashboardService.js**: Analytics calculations

### Middleware
- **authenticate.js**: JWT verification and user loading
- **authorize.js**: Role-based access control

### Utils
- **database.js**: Prisma client singleton
- **jwt.js**: Token generation and verification
- **validation.js**: Joi schemas for input validation
- **appError.js**: Custom error class

## Troubleshooting

### Database Connection Error
```
Check DATABASE_URL in .env
Ensure PostgreSQL is running
Run: npx prisma db push
```

### Token Expired
```
Generate new token by logging in again
Update JWT_EXPIRY in .env if needed
```

### Port Already in Use
```
Change PORT in .env file
Or kill process: lsof -ti:3000 | xargs kill -9
```

## License

MIT
