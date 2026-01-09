-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. profiles table (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT CHECK (role IN ('student', 'owner', 'admin')) DEFAULT 'student',
    college TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. canteen_items table
CREATE TABLE public.canteen_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    is_veg BOOLEAN DEFAULT TRUE,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID REFERENCES public.profiles(id) NOT NULL
);

-- 3. orders table
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    items JSONB NOT NULL, -- stores array of order items
    total_price INTEGER NOT NULL,
    status TEXT CHECK (status IN ('pending', 'preparing', 'ready')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. rooms table
CREATE TABLE public.rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    rent INTEGER NOT NULL,
    distance_km DOUBLE PRECISION,
    amenities TEXT[],
    contact TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID REFERENCES public.profiles(id) NOT NULL
);

-- 5. roommate_posts table
CREATE TABLE public.roommate_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    budget INTEGER,
    location TEXT,
    preferences TEXT,
    contact TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. community_posts table
CREATE TABLE public.community_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    type TEXT CHECK (type IN ('discussion', 'lost', 'sell')) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. events table
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. services table (for printing, laundry, etc.)
CREATE TABLE public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER,
    category TEXT, -- printing, laundry, stationery, electronics, etc.
    service_type TEXT CHECK (service_type IN ('printing', 'laundry', 'stationery', 'electronics', 'tution', 'mess', 'canteen')) DEFAULT 'canteen',
    available BOOLEAN DEFAULT TRUE,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_id UUID REFERENCES public.profiles(id) NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canteen_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roommate_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Profiles table policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
    
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Canteen items policies
CREATE POLICY "Anyone can view canteen items" ON public.canteen_items
    FOR SELECT USING (TRUE);
    
CREATE POLICY "Owners can manage own canteen items" ON public.canteen_items
    FOR ALL USING (auth.uid() = owner_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);
    
CREATE POLICY "Users can create own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
CREATE POLICY "Owners can view orders for their items" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.canteen_items ci 
            WHERE ci.owner_id = auth.uid() 
            AND ci.id = ANY(
                SELECT (items->>'item')::uuid 
                FROM jsonb_array_elements(orders.items)
            )
        )
    );
    
CREATE POLICY "Owners can update order status" ON public.orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.canteen_items ci 
            WHERE ci.owner_id = auth.uid() 
            AND ci.id = ANY(
                SELECT (items->>'item')::uuid 
                FROM jsonb_array_elements(orders.items)
            )
        )
    );

-- Rooms policies
CREATE POLICY "Anyone can view rooms" ON public.rooms
    FOR SELECT USING (TRUE);
    
CREATE POLICY "Owners can manage own rooms" ON public.rooms
    FOR ALL USING (auth.uid() = owner_id);

-- Roommate posts policies
CREATE POLICY "Anyone can view roommate posts" ON public.roommate_posts
    FOR SELECT USING (TRUE);
    
CREATE POLICY "Users can manage own roommate posts" ON public.roommate_posts
    FOR ALL USING (auth.uid() = user_id);

-- Community posts policies
CREATE POLICY "Verified students can view community posts" ON public.community_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = community_posts.user_id 
            AND p.is_verified = TRUE
        )
    );
    
CREATE POLICY "Verified students can create community posts" ON public.community_posts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.is_verified = TRUE
        )
    );
    
CREATE POLICY "Verified students can manage own community posts" ON public.community_posts
    FOR ALL USING (
        auth.uid() = user_id 
        AND EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.is_verified = TRUE
        )
    );

-- Events policies
CREATE POLICY "Anyone can view events" ON public.events
    FOR SELECT USING (TRUE);

-- Services policies
CREATE POLICY "Anyone can view services" ON public.services
    FOR SELECT USING (TRUE);
    
CREATE POLICY "Owners can manage own services" ON public.services
    FOR ALL USING (auth.uid() = owner_id);

-- RLS for profiles table (public insert for signup)
CREATE POLICY "Allow public signups" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, college, is_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'college', ''),
    FALSE
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_canteen_items_owner ON public.canteen_items(owner_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_rooms_owner ON public.rooms(owner_id);
CREATE INDEX idx_roommate_posts_user ON public.roommate_posts(user_id);
CREATE INDEX idx_community_posts_user ON public.community_posts(user_id);
CREATE INDEX idx_community_posts_type ON public.community_posts(type);
CREATE INDEX idx_services_owner ON public.services(owner_id);