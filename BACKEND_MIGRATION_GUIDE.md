# 🚀 Roomezes - Migration to Supabase Backend

This guide explains how the Roomezes backend was migrated from Express.js/MongoDB to Supabase (PostgreSQL + Auth).

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [Supabase Setup](#supabase-setup)
4. [Frontend Integration](#frontend-integration)
5. [Security Implementation](#security-implementation)
6. [Migration Steps](#migration-steps)

## Architecture Overview

### Previous Architecture
- **Backend**: Express.js + MongoDB
- **Authentication**: Custom JWT implementation
- **Database**: MongoDB with Mongoose ODM

### New Architecture
- **Backend**: Supabase (PostgreSQL + Auth + Functions)
- **Authentication**: Supabase Auth (Email/OTP)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **File Storage**: Supabase Storage
- **Backend Logic**: Supabase Edge Functions

## Database Schema

The following tables were created in PostgreSQL with the exact structure required:

### 1. profiles (linked to auth.users)
```sql
- id (UUID, PK, FK → auth.users.id)
- name (TEXT)
- role (TEXT: 'student' | 'owner' | 'admin')
- college (TEXT)
- is_verified (BOOLEAN, default: false)
- created_at (TIMESTAMP)
```

### 2. canteen_items
```sql
- id (UUID, PK)
- name (TEXT)
- price (INTEGER)
- is_veg (BOOLEAN, default: true)
- available (BOOLEAN, default: true)
- created_at (TIMESTAMP)
- owner_id (UUID → profiles.id)
```

### 3. orders
```sql
- id (UUID, PK)
- user_id (UUID → profiles.id)
- items (JSONB)
- total_price (INTEGER)
- status (TEXT: 'pending' | 'preparing' | 'ready')
- created_at (TIMESTAMP)
```

### 4. rooms
```sql
- id (UUID, PK)
- title (TEXT)
- rent (INTEGER)
- distance_km (DOUBLE PRECISION)
- amenities (TEXT[])
- contact (TEXT)
- created_at (TIMESTAMP)
- owner_id (UUID → profiles.id)
```

### 5. roommate_posts
```sql
- id (UUID, PK)
- user_id (UUID → profiles.id)
- budget (INTEGER)
- location (TEXT)
- preferences (TEXT)
- contact (TEXT)
- created_at (TIMESTAMP)
```

### 6. community_posts
```sql
- id (UUID, PK)
- user_id (UUID → profiles.id)
- type (TEXT: 'discussion' | 'lost' | 'sell')
- content (TEXT)
- created_at (TIMESTAMP)
```

### 7. events
```sql
- id (UUID, PK)
- title (TEXT)
- description (TEXT)
- date (DATE)
- location (TEXT)
- created_at (TIMESTAMP)
```

### 8. services (added for completeness)
```sql
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- price (INTEGER)
- category (TEXT)
- service_type (TEXT: various service types)
- available (BOOLEAN, default: true)
- image (TEXT)
- created_at (TIMESTAMP)
- owner_id (UUID → profiles.id)
```

## Supabase Setup

### Authentication System
- **Email/OTP Authentication** configured
- **Database trigger** automatically creates profile on user signup
- **Role-based access** (student, owner, admin)

### Row Level Security (RLS) Policies
- **Profiles**: Users can only view/update their own profile
- **Canteen Items**: Anyone can view; owners can manage their items
- **Orders**: Users can view own orders; owners can view/update orders for their items
- **Rooms**: Anyone can view; owners can manage their rooms
- **Roommate Posts**: Anyone can view; users can manage their own posts
- **Community Posts**: Only verified students can view/create
- **Events**: Anyone can view

## Frontend Integration

### API Service Migration
The original `api.ts` file was completely refactored to use Supabase client instead of Axios:

1. **Created `supabaseClient.ts`** for Supabase initialization
2. **Created `supabaseAPI.ts`** with all API functions using Supabase queries
3. **Updated `api.ts`** to export functions from `supabaseAPI.ts`

### Key Changes
- Replaced all HTTP API calls with Supabase Database queries
- Maintained same response structure for frontend compatibility
- Preserved all functionality: auth, canteen, rooms, community, events, admin

## Security Implementation

### Row Level Security (RLS)
Enabled on all tables with granular policies:
- **Public Access**: Canteen items, rooms, events (read-only)
- **Authenticated Access**: Place orders, post roommate requests
- **Verified Students Only**: Community access, create posts
- **Owner Access**: Manage own items, view related orders

### Authentication Flow
1. User signs up → Profile automatically created via database trigger
2. Admin verifies student → Sets `is_verified = true`
3. Verified students gain access to community features

## Migration Steps

### 1. Backend Replacement
- ❌ Removed Express.js server
- ❌ Removed MongoDB/Mongoose models
- ❌ Removed custom authentication
- ✅ Added Supabase PostgreSQL schema
- ✅ Added RLS policies
- ✅ Added database triggers for automatic profile creation

### 2. Frontend Integration
- ✅ Installed `@supabase/supabase-js`
- ✅ Created Supabase client configuration
- ✅ Refactored all API calls to use Supabase queries
- ✅ Maintained same response format for compatibility

### 3. Security Implementation
- ✅ Enabled RLS on all tables
- ✅ Created comprehensive access policies
- ✅ Implemented role-based access control

### 4. Deployment Preparation
- ✅ Updated environment variables
- ✅ Configured Supabase project settings
- ✅ Set up edge functions for complex operations

## Features Verification

All original features are preserved and enhanced:

### ✅ Canteen System
- View Atharva Canteen menu
- Place orders with status tracking
- Owner dashboard for item management

### ✅ Rooms & PG Listings
- Owner listings with rent/distance/amenities
- Student roommate finder

### ✅ Services (Laundry & Printing)
- Service type filtering
- Owner management

### ✅ Community Platform
- Verified student access only
- Discussion, lost & found, buy & sell sections

### ✅ Events Management
- View college events
- Event creation by authorized users

### ✅ Authentication
- Secure email/OTP login
- Role-based access control
- Profile management

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Testing Checklist

- [x] Signup/Login works with Supabase Auth
- [x] Orders save and update properly
- [x] Owner dashboard functions correctly
- [x] Community access restricted to verified students
- [x] Mobile UI works on all pages
- [x] No console errors in browser
- [x] All API calls use Supabase instead of custom backend
- [x] RLS policies enforce proper access control

## Production Deployment

### Frontend
Deploy to Vercel with Supabase environment variables

### Backend
Managed entirely by Supabase cloud service:
- Authentication
- Database with RLS
- File storage
- Edge functions
- Real-time subscriptions

## Benefits of Migration

1. **Reduced Infrastructure**: No need to manage Express.js servers
2. **Enhanced Security**: Built-in RLS and authentication
3. **Better Scalability**: PostgreSQL with Supabase's scaling
4. **Cost Efficiency**: Pay-per-use model
5. **Real-time Capabilities**: Built-in real-time subscriptions
6. **File Storage**: Integrated storage solution
7. **Automatic Updates**: Supabase handles database maintenance

The migration successfully transforms Roomezes from a traditional Express.js/MongoDB stack to a modern, scalable Supabase backend while preserving all functionality and enhancing security.