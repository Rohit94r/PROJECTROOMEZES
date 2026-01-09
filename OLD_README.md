# 🚀 Roomezes - Student-Centric Digital Platform (Supabase Edition)

Welcome to Roomezes - A Student-Centric Digital Platform for Campus Living & Daily Services powered by Supabase.

## 🎯 Problem Statement

College students face several challenges:
- Difficulty finding safe rooms / PGs
- Long canteen queues
- Scattered daily services
- No verified college-only community

## 💡 Solution

Roomezes aims to solve these problems by providing:
- Canteen food ordering
- Rooms & PG listings
- Daily student services
- Verified college community
- Events & opportunities

## 🏗️ Tech Stack

**Backend:** Supabase (PostgreSQL + Auth + Storage + Functions)

**Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS

**Key Libraries:** 
- `@supabase/supabase-js` for database and auth
- Row Level Security (RLS) for access control
- Edge Functions for complex operations

## 📁 Project Structure

```
roomezes/
├── backend/
│   ├── supabase/
│   │   ├── schema.sql          # Database schema
│   │   ├── config.toml         # Supabase config
│   │   └── functions/          # Edge functions
│   └── BACKEND_MIGRATION_GUIDE.md
├── frontend/
│   ├── src/
│   │   ├── app/               # Next.js pages
│   │   ├── components/        # UI components
│   │   └── lib/
│   │       ├── supabaseClient.ts
│   │       └── supabaseAPI.ts
│   ├── .env.local            # Supabase environment vars
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Supabase account
- npm

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd roomezes
   ```

2. Install frontend dependencies
   ```bash
   cd frontend
   npm install
   ```

3. Set up Supabase environment variables in `frontend/.env.local`
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

## 🧩 Features

### Authentication
- User registration and login with email/OTP
- Role-based access (student, owner, admin)
- Automatic profile creation on signup

### Canteen System
- View Atharva Canteen menu
- Place orders online with status tracking
- Owner dashboard for menu management

### Rooms & PG
- PG and flat listings
- Rent, distance, amenities information
- Contact details
- Roommate finder for budget-conscious students

### Services
- Laundry services
- Printing services
- Other daily services

### Community
- Verified student community (only verified students)
- Discussions
- Lost & found
- Buy & sell

### Events
- College events listing
- Event details

## 🔐 Security Implementation

- **Row Level Security (RLS)** on all database tables
- **Role-based access control**
- **Verified student access** to community features
- **Owner-specific access** to their items/orders
- **JWT authentication** managed by Supabase

## 🛠️ API Endpoints

All API calls now use Supabase Database queries instead of custom backend:

### Authentication
- `auth.register()` - Register user
- `auth.login()` - Login user
- `auth.getProfile()` - Get user profile

### Canteen
- `canteenAPI.getItems()` - Get canteen items
- `canteenAPI.createItem()` - Create canteen item
- `canteenAPI.updateItem()` - Update canteen item
- `canteenAPI.deleteItem()` - Delete canteen item
- `canteenAPI.createOrder()` - Create order
- `canteenAPI.getStudentOrders()` - Get student orders
- `canteenAPI.getOwnerOrders()` - Get owner orders

### Rooms
- `roomsAPI.getRooms()` - Get rooms
- `roomsAPI.createRoom()` - Create room
- `roomsAPI.updateRoom()` - Update room
- `roomsAPI.deleteRoom()` - Delete room
- `roomsAPI.createRoommatePost()` - Create roommate post

### Community
- `communityAPI.getPosts()` - Get community posts
- `communityAPI.createPost()` - Create community post

### Events
- `eventsAPI.getEvents()` - Get events
- `eventsAPI.createEvent()` - Create event

### Services
- `servicesAPI.getServicesByType()` - Get services by type
- `servicesAPI.createService()` - Create service

## 🚢 Deployment

### Backend
- Deploy to Supabase Cloud (managed PostgreSQL + Auth + Storage)
- Configure RLS policies
- Set up edge functions if needed

### Frontend
- Deploy to Vercel with Supabase environment variables

## 🧪 Testing Checklist

- [x] Signup/Login works with Supabase Auth
- [x] Orders save and update properly
- [x] Owner dashboard functions correctly
- [x] Community access restricted to verified students
- [x] Mobile UI works on all pages
- [x] No console errors in browser
- [x] All API calls use Supabase instead of custom backend
- [x] RLS policies enforce proper access control

## 👨‍💻 Author

Rohit

## 🚀 Deployment

For deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 📞 Support

For support, email rohit@example.com