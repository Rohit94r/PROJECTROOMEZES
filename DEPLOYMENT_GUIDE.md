# 🚀 Roomezes Deployment Guide

This guide explains how to deploy your Roomezes application with Supabase backend.

## 📋 Prerequisites

- **Frontend**: Node.js (v16 or higher), npm
- **Backend**: Supabase account
- **Deployment**: Vercel account (for frontend)

## 🏗️ Architecture Overview

- **Frontend**: Next.js application hosted on Vercel
- **Backend**: Supabase (PostgreSQL database, Auth, Storage, Functions)
- **Authentication**: Supabase Auth (email/OTP)
- **Security**: Row Level Security (RLS) policies

## 🚀 Step-by-Step Deployment

### **Step 1: Prepare Your Supabase Project**

1. **Create Supabase Account** (if you don't have one):
   - Go to [supabase.com](https://supabase.com)
   - Sign up for free

2. **Create New Project**:
   - Click "New Project"
   - Choose a name (e.g., "roomezes")
   - Select your preferred region
   - Set a secure password for the database

3. **Configure Database Schema**:
   - Go to your Supabase Dashboard → SQL Editor
   - Copy and paste the contents of `backend/supabase/schema.sql`
   - Click "RUN" to execute the schema creation

4. **Configure Authentication Settings**:
   - Go to Authentication → Settings
   - Disable "Enable email confirmations" for development (optional)
   - Configure email templates if needed

### **Step 2: Get Your Supabase Credentials**

1. Go to your Supabase Dashboard
2. Navigate to Project Settings → API
3. Note down:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anonymous Key** (starts with `eyJhbGciOi...`)

### **Step 3: Configure Environment Variables**

Update your frontend `.env.local` file with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Step 4: Deploy Frontend to Vercel**

#### **Option A: Using Vercel CLI (Recommended)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the frontend directory**:
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Set Environment Variables in Vercel Dashboard**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`: your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: your Supabase anon key

#### **Option B: Git Integration**

1. **Push your code to GitHub/GitLab/Bitbucket**
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Add environment variables during deployment
   - Click "Deploy"

### **Step 5: Configure Production Settings**

#### **Supabase Configuration for Production**:

1. **Update Authentication Settings**:
   - Go to Authentication → Settings
   - Add your production domain to "Redirect URLs"
   - Add your domain to "Site URL"

2. **Configure Row Level Security** (if not done in schema):
   - All RLS policies are already configured in the schema.sql file
   - Verify that they're active in your database settings

3. **Set up Email Provider** (optional but recommended):
   - Go to Authentication → Settings
   - Configure email provider (SendGrid, Mailgun, etc.)

### **Step 6: Production Environment Variables**

For production, ensure these environment variables are set:

**In Vercel (or your hosting platform):**
```
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

### **Step 7: Post-Deployment Checklist**

- [ ] Verify all pages load correctly
- [ ] Test authentication (sign up, login, logout)
- [ ] Verify database operations work (create/read items)
- [ ] Test mobile responsiveness
- [ ] Check error handling
- [ ] Verify security policies are working

## 🔄 Environment Variables Reference

### **Required Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### **Optional Variables:**
- `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`: For server-side operations (keep secret!)

## 🔒 Security Best Practices

1. **Never expose sensitive keys** in client-side code
2. **Use Row Level Security** for all tables
3. **Validate all inputs** on the client and server
4. **Keep dependencies updated**
5. **Use HTTPS** in production

## 🐛 Troubleshooting

### **Common Issues:**

1. **"Invalid API key" Error**:
   - Verify your Supabase credentials are correct
   - Check for typos in the environment variables

2. **"Email not confirmed" Error**:
   - Enable email confirmations in Supabase auth settings
   - Or disable them if not required for your use case

3. **Database Access Issues**:
   - Verify RLS policies are properly configured
   - Check that your database schema is correctly applied

## 📊 Monitoring & Maintenance

### **Supabase Dashboard**:
- Monitor database performance
- Check authentication metrics
- View API usage
- Manage user accounts

### **Vercel Dashboard**:
- Monitor frontend performance
- Check error logs
- View analytics
- Manage deployments

## 🚢 Scaling Considerations

- **Database**: Supabase automatically scales PostgreSQL
- **Authentication**: Built-in scaling with Supabase Auth
- **File Storage**: Supabase Storage scales automatically
- **Edge Functions**: Auto-scaling with V8 isolates

## 🔄 Updates & Maintenance

1. **Frontend Updates**:
   - Push changes to your Git repository
   - Vercel will automatically deploy
   - Or use `vercel --prod` for manual deployment

2. **Database Schema Updates**:
   - Use Supabase's migration system
   - Or run SQL commands in the SQL Editor
   - Always backup before making changes

3. **Environment Updates**:
   - Update environment variables in Vercel dashboard
   - Redeploy if necessary

## 🎯 Success Metrics

Your deployment is successful when:
- ✅ Users can register and login
- ✅ All features work as expected
- ✅ Database operations are functional
- ✅ Mobile responsiveness is maintained
- ✅ Security policies are enforced
- ✅ Application loads quickly
- ✅ Error handling works properly

---

Your Roomezes application is now ready for production use! The Supabase backend provides a scalable, secure foundation that can grow with your user base.