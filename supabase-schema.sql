-- MeroProfile Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id),
    description TEXT,
    banner_url TEXT,
    logo_url TEXT,
    price_range TEXT,
    address TEXT,
    city TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    email TEXT,
    website TEXT,
    facebook TEXT,
    instagram TEXT,
    whatsapp TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Professionals table
CREATE TABLE IF NOT EXISTS public.professionals (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id),
    specialization TEXT,
    description TEXT,
    photo_url TEXT,
    qualification TEXT,
    experience_years INTEGER,
    clinic_name TEXT,
    clinic_address TEXT,
    city TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    email TEXT,
    consultation_fee TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table (for galleries)
CREATE TABLE IF NOT EXISTS public.images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Tags (many-to-many)
CREATE TABLE IF NOT EXISTS public.business_tags (
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (business_id, tag_id)
);

-- Professional Tags (many-to-many)
CREATE TABLE IF NOT EXISTS public.professional_tags (
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (professional_id, tag_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL CHECK (char_length(text) <= 200),
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured Profiles table
CREATE TABLE IF NOT EXISTS public.featured_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT,
    payment_reference TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'search', 'share')),
    user_id UUID REFERENCES public.users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table (for businesses and professionals)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price TEXT,
    duration TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category_id ON public.businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON public.businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_is_featured ON public.businesses(is_featured);
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON public.professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_category_id ON public.professionals(category_id);
CREATE INDEX IF NOT EXISTS idx_professionals_city ON public.professionals(city);
CREATE INDEX IF NOT EXISTS idx_professionals_slug ON public.professionals(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON public.reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_professional_id ON public.reviews(professional_id);
CREATE INDEX IF NOT EXISTS idx_analytics_business_id ON public.analytics(business_id);
CREATE INDEX IF NOT EXISTS idx_analytics_professional_id ON public.analytics(professional_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.featured_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Anyone can view published businesses" ON public.businesses
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can create their own businesses" ON public.businesses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own businesses" ON public.businesses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own businesses" ON public.businesses
    FOR DELETE USING (auth.uid() = user_id);

-- Professionals policies
CREATE POLICY "Anyone can view published professionals" ON public.professionals
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can create their own professional profiles" ON public.professionals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own professional profiles" ON public.professionals
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own professional profiles" ON public.professionals
    FOR DELETE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Images policies
CREATE POLICY "Anyone can view images" ON public.images
    FOR SELECT USING (true);

CREATE POLICY "Business owners can manage their images" ON public.images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = images.business_id 
            AND businesses.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.professionals 
            WHERE professionals.id = images.professional_id 
            AND professionals.user_id = auth.uid()
        )
    );

-- Services policies
CREATE POLICY "Anyone can view services" ON public.services
    FOR SELECT USING (true);

CREATE POLICY "Business owners can manage their services" ON public.services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.businesses 
            WHERE businesses.id = services.business_id 
            AND businesses.user_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.professionals 
            WHERE professionals.id = services.professional_id 
            AND professionals.user_id = auth.uid()
        )
    );

-- Featured profiles policies
CREATE POLICY "Users can view their own featured requests" ON public.featured_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create featured requests" ON public.featured_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON public.professionals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_featured_profiles_updated_at BEFORE UPDATE ON public.featured_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update featured status
CREATE OR REPLACE FUNCTION update_featured_status()
RETURNS void AS $$
BEGIN
    -- Update businesses
    UPDATE public.businesses
    SET is_featured = false
    WHERE is_featured = true
    AND featured_until < NOW();

    -- Update professionals
    UPDATE public.professionals
    SET is_featured = false
    WHERE is_featured = true
    AND featured_until < NOW();

    -- Update featured_profiles status
    UPDATE public.featured_profiles
    SET status = 'expired'
    WHERE status = 'approved'
    AND end_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
    ('Restaurant', 'restaurant', 'Restaurants and eateries'),
    ('Cafe', 'cafe', 'Cafes and coffee shops'),
    ('Doctor', 'doctor', 'Medical doctors and physicians'),
    ('Clinic', 'clinic', 'Medical clinics and health centers'),
    ('Hospital', 'hospital', 'Hospitals and medical facilities'),
    ('Salon', 'salon', 'Beauty salons and parlors'),
    ('Spa', 'spa', 'Spas and wellness centers'),
    ('Gym', 'gym', 'Gyms and fitness centers'),
    ('Hotel', 'hotel', 'Hotels and accommodations'),
    ('Shop', 'shop', 'Retail shops and stores'),
    ('Service', 'service', 'Various services'),
    ('Education', 'education', 'Educational institutions'),
    ('Real Estate', 'real-estate', 'Real estate services'),
    ('Automotive', 'automotive', 'Automotive services'),
    ('Technology', 'technology', 'Technology services'),
    ('Other', 'other', 'Other categories')
ON CONFLICT (slug) DO NOTHING;