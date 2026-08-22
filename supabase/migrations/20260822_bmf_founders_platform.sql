-- Migration: 20260822_bmf_founders_platform.sql
-- Description: Sets up bmf_members (with review workflow) and bmf_jobs tables with RLS policies

-- 1. Create or Update bmf_members table
CREATE TABLE IF NOT EXISTS public.bmf_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
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
    is_verified BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
    admin_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure newly added columns exist if table was previously created
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bmf_members' AND column_name='review_status') THEN
        ALTER TABLE public.bmf_members ADD COLUMN review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='bmf_members' AND column_name='admin_feedback') THEN
        ALTER TABLE public.bmf_members ADD COLUMN admin_feedback TEXT;
    END IF;
END $$;

-- 2. Create bmf_jobs table for founder job postings
CREATE TABLE IF NOT EXISTS public.bmf_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.bmf_members(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL,
    company_logo TEXT,
    title TEXT NOT NULL,
    job_type TEXT NOT NULL DEFAULT 'Full-time',
    location TEXT NOT NULL,
    salary TEXT,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    apply_url_or_email TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Row Level Security for bmf_members
ALTER TABLE public.bmf_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved bmf_members" ON public.bmf_members;
CREATE POLICY "Public read approved bmf_members"
    ON public.bmf_members
    FOR SELECT
    USING (is_approved = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Members update own profile" ON public.bmf_members;
CREATE POLICY "Members update own profile"
    ON public.bmf_members
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members insert own profile" ON public.bmf_members;
CREATE POLICY "Members insert own profile"
    ON public.bmf_members
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 4. Row Level Security for bmf_jobs
ALTER TABLE public.bmf_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read approved bmf_jobs" ON public.bmf_jobs;
CREATE POLICY "Public read approved bmf_jobs"
    ON public.bmf_jobs
    FOR SELECT
    USING (is_approved = true AND status = 'active');

DROP POLICY IF EXISTS "Members manage own jobs" ON public.bmf_jobs;
CREATE POLICY "Members manage own jobs"
    ON public.bmf_jobs
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
