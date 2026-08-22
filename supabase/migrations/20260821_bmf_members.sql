-- Create bmf_members table for BMF Club member directory
CREATE TABLE IF NOT EXISTS public.bmf_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    role TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_logo TEXT,
    avatar_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Tech',
    tagline TEXT NOT NULL,
    description TEXT,
    stage TEXT DEFAULT 'Early Traction',
    metrics TEXT,
    location TEXT,
    team_size TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    is_verified BOOLEAN DEFAULT true,
    is_approved BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bmf_members ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved members
CREATE POLICY "Public read approved bmf_members"
    ON public.bmf_members
    FOR SELECT
    USING (is_approved = true);

-- Allow authenticated users to update their own profile
CREATE POLICY "Members update own profile"
    ON public.bmf_members
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Members insert own profile"
    ON public.bmf_members
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
