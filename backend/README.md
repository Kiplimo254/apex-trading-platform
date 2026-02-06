# Apex Backend - Crypto & Forex Investment Platform API

A comprehensive Node.js/Express backend API for the Apex crypto and forex investment platform, built with TypeScript, PostgreSQL, and Prisma ORM.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Profile management, statistics, and account settings
- **Investment System**: Multiple investment plans with automated profit tracking
- **Transaction Management**: Deposit and withdrawal handling with status tracking
- **Referral System**: Track referrals and commissions
- **Dashboard APIs**: Aggregated statistics and recent activity
- **Type Safety**: Full TypeScript implementation
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Request validation using Zod schemas

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your settings:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://username:password@localhost:5432/apex_db?schema=public"
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Set up the database**:
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run database migrations
   npm run prisma:migrate
   
   # Seed the database with sample data
   npm run prisma:seed
   ```

## 🏃 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### View Database (Prisma Studio)
```bash
npm run prisma:studio
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users (Protected)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Investments (Protected)
- `GET /api/investments/plans` - Get all investment plans
- `GET /api/investments` - Get user investments
- `GET /api/investments/:id` - Get investment by ID
- `POST /api/investments` - Create new investment

### Transactions (Protected)
- `POST /api/transactions/deposit` - Create deposit request
- `POST /api/transactions/withdraw` - Create withdrawal request
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions/:id` - Get transaction by ID
- `PUT /api/transactions/:id/status` - Update transaction status (Admin only)

### Dashboard (Protected)
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/recent-transactions` - Get recent transactions
- `GET /api/dashboard/active-investments` - Get active investments

### Referrals (Protected)
- `GET /api/referrals` - Get user referrals
- `GET /api/referrals/stats` - Get referral statistics

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Example Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Create Investment
```bash
curl -X POST http://localhost:5000/api/investments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "planId": "starter-plan",
    "amount": 500
  }'
```

## 🗄️ Database Schema

### Models
- **User**: User accounts with authentication and balance tracking
- **InvestmentPlan**: Available investment plans with rates and durations
- **Investment**: User investments with profit tracking
- **Transaction**: Deposits, withdrawals, and profit transactions
- **Referral**: Referral tracking and commission management

## 🧪 Test Credentials

After running the seed script, you can use these credentials:

**Admin Account**:
- Email: `admin@apex.com`
- Password: `Admin@123`

**Test User Account**:
- Email: `john@example.com`
- Password: `Test@123`

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── config/
│   │   └── database.ts    # Prisma client
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth, validation, error handling
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utilities and schemas
│   └── server.ts          # App entry point
├── .env.example           # Environment template
├── package.json
└── tsconfig.json
```

## 🔧 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **CORS**: cors

## 🚦 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT | Required |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

## 🔄 Integration with Frontend

To connect the frontend to this backend:

1. Update the frontend API base URL to `http://localhost:5000/api`
2. Store the JWT token received from login in localStorage or a state management solution
3. Include the token in the Authorization header for all protected requests

## 📄 License

ISC

## 👥 Support

For issues or questions, please contact the development team.
