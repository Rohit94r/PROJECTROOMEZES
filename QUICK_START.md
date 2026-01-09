# 🚀 QUICK START GUIDE

## Start Backend in 3 Steps

### 1. Seed Data
```bash
cd backend
npm run seed
```

### 2. Start Server
```bash
npm start
```

### 3. Test Login
```bash
# Using PowerShell
$body = @{email="rohit@student.com"; password="password123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body $body

# Using curl (Git Bash / WSL)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rohit@student.com","password":"password123"}'
```

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | rohit@student.com | password123 |
| Owner | amit@owner.com | password123 |
| Admin | admin@roomezes.com | adminpass123 |

---

## API Endpoints

### Login
```
POST /api/auth/login
{
  "email": "rohit@student.com",
  "password": "password123"
}
```

Response includes JWT token - save this!

### Use Token for Protected Routes
```
GET /api/auth/profile
Authorization: Bearer <TOKEN_FROM_LOGIN>
```

### Browse Features
```
GET /api/rooms           # All rooms
GET /api/canteen         # Food items
GET /api/events          # Events
GET /api/community       # Community posts
```

---

## Environment Setup

File: `backend/.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=roomezes_jwt_secret_key_2023
```

---

## What's Ready

✅ Database: MongoDB with Mongoose  
✅ Auth: Login with JWT tokens  
✅ Test Data: 6 users, 4 rooms, 6 canteen items, 4 events, 5 posts  
✅ Routes: All endpoints configured  
✅ Documentation: Complete setup guide  

**Everything is ready to test! 🎉**
