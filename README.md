# 🚀 Roomezes - Student-Centric Digital Platform (Supabase Edition)

<div align="center">

[![Roomezes Logo](https://placehold.co/150x150/E53935/FFFFFF?text=R)](https://roomezes.vercel.app)

**Roomezes - A Student-Centric Digital Platform for Campus Living & Daily Services powered by Supabase**

[![Next.js](https://img.shields.io/badge/Next.js-14.0.0-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/) [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-DDDDDD?style=for-the-badge&logo=supabase&logoColor=3FCF8E)](https://supabase.com/) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

## 🎯 Problem Statement

College students face several challenges:
- Difficulty finding safe rooms / PGs
- Long canteen queues
- Scattered daily services
- No verified college-only community

## 💡 Solution

Roomezes aims to solve these problems by providing:
- 🍽️ **Canteen food ordering** - Order food online, skip the queue
- 🏠 **Rooms & PG listings** - Find safe accommodations
- 🧺 **Daily student services** - Laundry, printing, etc.
- 👥 **Verified college community** - Connect with fellow students
- 📅 **Events & opportunities** - Stay updated with campus events

## ✨ Key Features

### 🛡️ **College Verification System**
- Students must verify their college identity
- Only verified students can access community features
- Secure access control using Supabase Row Level Security

### 🏗️ **Tech Stack**

**Backend:** Supabase (PostgreSQL + Auth + Storage + Functions)

**Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS

**Key Libraries:** 
- `@supabase/supabase-js` for database and auth
- Row Level Security (RLS) for access control
- Edge Functions for complex operations

### 📁 Project Structure

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

## 🧩 Core Features

### 🛡️ **Authentication**
- User registration and login with email/OTP
- Role-based access (student, owner, admin)
- Automatic profile creation on signup
- College verification system

### 🍽️ **Canteen System**
- View Atharva Canteen menu
- Place orders online with status tracking
- Owner dashboard for menu management

### 🏠 **Rooms & PG**
- PG and flat listings
- Rent, distance, amenities information
- Contact details
- Roommate finder for budget-conscious students

### 🧺 **Services**
- Laundry services
- Printing services
- Other daily services

### 👥 **Community**
- Verified student community (only verified students)
- Discussions
- Lost & found
- Buy & sell

### 📅 **Events**
- College events listing
- Event details

## 🔐 Security Implementation

- **Row Level Security (RLS)** on all database tables
- **Role-based access control**
- **Verified student access** to community features
- **Owner-specific access** to their items/orders
- **JWT authentication** managed by Supabase

## 🚀 Deployment

### Backend
- Deploy to Supabase Cloud (managed PostgreSQL + Auth + Storage)
- Configure RLS policies
- Set up edge functions if needed

### Frontend
- Deploy to Vercel with Supabase environment variables

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

For support, email rohit@example.com

<div align="center">

**Made with ❤️ for college students**

[![Roomezes](https://placehold.co/800x200/E53935/FFFFFF?text=Roomezes+-+Student+Life+Made+Easy)](https://roomezes.vercel.app)

</div>