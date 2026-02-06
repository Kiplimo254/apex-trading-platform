# Backend and Frontend Integration Test

## Test Script for All API Endpoints

This document provides test commands to verify all backend APIs are working correctly.

### Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173` (or your Vite port)
- Admin credentials: `admin@apex.com` / `Admin@123`
- User credentials: `john@example.com` / `Test@123`

## 1. Authentication Tests

### Login (Admin)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@apex.com\",\"password\":\"Admin@123\"}"
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "...",
      "email": "admin@apex.com",
      "role": "ADMIN"
    }
  }
}
```

### Login (Regular User)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"Test@123\"}"
```

## 2. Admin API Tests

**Note:** Replace `YOUR_ADMIN_TOKEN` with the token from the admin login response.

### Get Platform Statistics
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Expected Response:**
```json
{
  "data": {
    "users": { "total": 2, "active": 2 },
    "transactions": {
      "totalDeposits": 0,
      "totalWithdrawals": 0,
      "pending": 0
    },
    "investments": { "total": 0, "active": 0 },
    "platformRevenue": 0
  }
}
```

### Get All Users
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Search Users
```bash
curl -X GET "http://localhost:5000/api/admin/users?search=john" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Update User Balance
```bash
curl -X PUT http://localhost:5000/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"balance\":1000}"
```

### Get All Transactions
```bash
curl -X GET "http://localhost:5000/api/admin/transactions?status=PENDING" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Approve Transaction
```bash
curl -X PUT http://localhost:5000/api/admin/transactions/TRANSACTION_ID/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"COMPLETED\"}"
```

### Get All Investments
```bash
curl -X GET "http://localhost:5000/api/admin/investments?status=ACTIVE" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get All Referrals
```bash
curl -X GET http://localhost:5000/api/admin/referrals \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 3. User API Tests

**Note:** Replace `YOUR_USER_TOKEN` with the token from a user login response.

### Get User Profile
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### Get Investment Plans
```bash
curl -X GET http://localhost:5000/api/investments/plans \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### Create Investment
```bash
curl -X POST http://localhost:5000/api/investments \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"planId\":\"PLAN_ID\",\"amount\":500}"
```

### Create Deposit
```bash
curl -X POST http://localhost:5000/api/transactions/deposit \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"amount\":100,\"method\":\"Bitcoin\",\"walletAddress\":\"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\"}"
```

### Create Withdrawal
```bash
curl -X POST http://localhost:5000/api/transactions/withdraw \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"amount\":50,\"method\":\"Bitcoin\",\"walletAddress\":\"1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\"}"
```

### Get User Transactions
```bash
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### Get User Referrals
```bash
curl -X GET http://localhost:5000/api/referrals \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

## 4. Frontend Integration Tests

### Test Admin Panel Access

1. **Navigate to login page:**
   - URL: `http://localhost:5173/login`
   - Enter: `admin@apex.com` / `Admin@123`
   - Click Login

2. **Access Admin Dashboard:**
   - Navigate to: `http://localhost:5173/admin`
   - Should see platform statistics

3. **Test User Management:**
   - Navigate to: `http://localhost:5173/admin/users`
   - Search for users
   - Edit a user's balance
   - Verify changes persist

4. **Test Transaction Management:**
   - Navigate to: `http://localhost:5173/admin/transactions`
   - Filter by status: "Pending"
   - Approve/reject a transaction
   - Verify user balance updates

5. **Test Investment Management:**
   - Navigate to: `http://localhost:5173/admin/investments`
   - View all investments
   - Filter by status

## 5. Expected Results

### ✅ All API Endpoints Should:
- Return proper JSON responses
- Require authentication (except login/register)
- Validate admin role for admin endpoints
- Return appropriate error messages
- Update database correctly

### ✅ Frontend Should:
- Display data from backend
- Handle loading states
- Show error messages
- Update UI after actions
- Persist authentication

## 6. Common Issues and Solutions

### Issue: CORS Error
**Solution:** Backend `.env` has `CORS_ORIGIN=http://localhost:5173`

### Issue: 401 Unauthorized
**Solution:** Token expired or invalid - login again

### Issue: 403 Forbidden
**Solution:** User doesn't have admin role

### Issue: Connection Refused
**Solution:** Backend server not running - run `npm run dev` in backend folder

## 7. Quick Verification Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running (check terminal for port)
- [ ] Can login as admin
- [ ] Can access `/admin` route
- [ ] Dashboard shows statistics
- [ ] User management page loads
- [ ] Transaction management page loads
- [ ] Can approve/reject transactions
- [ ] Can edit user balances
- [ ] All API calls return data

## Success Criteria

✅ **Backend:** All 25+ endpoints responding correctly
✅ **Frontend:** All admin pages loading and displaying data
✅ **Integration:** Frontend successfully calling backend APIs
✅ **Authentication:** JWT tokens working properly
✅ **Admin Panel:** Full CRUD operations functional
