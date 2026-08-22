-- ==============================================================================
-- Migration: 20260822_shift_all_bmf_tables_to_bmf_club_schema.sql
-- Description: Shifts all BMF Club tables from `public` schema into the dedicated
--              `bmf_club` schema and creates backward-compatible views in `public`.
-- ==============================================================================

-- 1. Create dedicated `bmf_club` schema if not exists
CREATE SCHEMA IF NOT EXISTS bmf_club;

-- Grant schema usage to API roles
GRANT USAGE ON SCHEMA bmf_club TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA bmf_club GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA bmf_club GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA bmf_club GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 2. Safely move existing tables from `public` to `bmf_club` schema
DO $$
BEGIN
    -- Move bmf_members
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bmf_members' AND table_type = 'BASE TABLE') THEN
        ALTER TABLE public.bmf_members SET SCHEMA bmf_club;
    END IF;

    -- Move bmf_cards
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bmf_cards' AND table_type = 'BASE TABLE') THEN
        ALTER TABLE public.bmf_cards SET SCHEMA bmf_club;
    END IF;

    -- Move bmf_events
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bmf_events' AND table_type = 'BASE TABLE') THEN
        ALTER TABLE public.bmf_events SET SCHEMA bmf_club;
    END IF;

    -- Move bmf_event_registrations
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bmf_event_registrations' AND table_type = 'BASE TABLE') THEN
        ALTER TABLE public.bmf_event_registrations SET SCHEMA bmf_club;
    END IF;

    -- Move bmf_jobs
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bmf_jobs' AND table_type = 'BASE TABLE') THEN
        ALTER TABLE public.bmf_jobs SET SCHEMA bmf_club;
    END IF;
END $$;

-- 3. Ensure tables exist in bmf_club with all required columns

-- (A) bmf_club.bmf_members
CREATE TABLE IF NOT EXISTS bmf_club.bmf_members (
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

-- (B) bmf_club.bmf_cards (Executive Pass Cards - No CVV)
CREATE TABLE IF NOT EXISTS bmf_club.bmf_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    card_number TEXT NOT NULL,
    card_tier TEXT NOT NULL DEFAULT 'obsidian' CHECK (card_tier IN ('obsidian', 'titanium', 'gold', 'diamond', 'quantum')),
    card_holder_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    valid_thru TEXT DEFAULT '12/28',
    member_since TEXT DEFAULT '2026',
    nfc_uid TEXT,
    is_active BOOLEAN DEFAULT false,
    approval_status TEXT NOT NULL DEFAULT 'not_applied' CHECK (approval_status IN ('not_applied', 'pending', 'approved', 'rejected')),
    application_data JSONB DEFAULT '{}'::jsonb,
    admin_feedback TEXT,
    tier_perks JSONB DEFAULT '[]'::jsonb,
    card_customization JSONB DEFAULT '{}'::jsonb,
    applied_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- (C) bmf_club.bmf_events
CREATE TABLE IF NOT EXISTS bmf_club.bmf_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    event_date TEXT NOT NULL,
    event_time TEXT DEFAULT '6:30 PM - 9:30 PM IST',
    location_type TEXT DEFAULT 'in_person' CHECK (location_type IN ('in_person', 'virtual', 'hybrid')),
    location_venue TEXT,
    location_city TEXT DEFAULT 'Bangalore',
    category TEXT DEFAULT 'Closed-Door Dinner',
    cover_image TEXT,
    total_capacity INTEGER DEFAULT 18,
    registered_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
    cta_type TEXT DEFAULT 'internal_form' CHECK (cta_type IN ('internal_form', 'external_link', 'contact_concierge')),
    external_cta_url TEXT,
    external_cta_text TEXT DEFAULT 'Request Invitation',
    pricing_type TEXT DEFAULT 'members_only' CHECK (pricing_type IN ('free', 'paid', 'members_only')),
    price_inr NUMERIC DEFAULT 0,
    requirements TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- (D) bmf_club.bmf_event_registrations
CREATE TABLE IF NOT EXISTS bmf_club.bmf_event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES bmf_club.bmf_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    member_id UUID,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    role TEXT,
    linkedin_url TEXT,
    guest_notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'waitlisted', 'rejected', 'attended')),
    ticket_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- (E) bmf_club.bmf_jobs
CREATE TABLE IF NOT EXISTS bmf_club.bmf_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID,
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

-- 4. Enable Row Level Security on all bmf_club tables
ALTER TABLE bmf_club.bmf_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmf_club.bmf_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmf_club.bmf_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmf_club.bmf_event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmf_club.bmf_jobs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies on bmf_club schema
DROP POLICY IF EXISTS "Public read bmf_members" ON bmf_club.bmf_members;
CREATE POLICY "Public read bmf_members" ON bmf_club.bmf_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated manage bmf_members" ON bmf_club.bmf_members;
CREATE POLICY "Authenticated manage bmf_members" ON bmf_club.bmf_members FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read bmf_cards" ON bmf_club.bmf_cards;
CREATE POLICY "Public read bmf_cards" ON bmf_club.bmf_cards FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated manage bmf_cards" ON bmf_club.bmf_cards;
CREATE POLICY "Authenticated manage bmf_cards" ON bmf_club.bmf_cards FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read bmf_events" ON bmf_club.bmf_events;
CREATE POLICY "Public read bmf_events" ON bmf_club.bmf_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated manage bmf_events" ON bmf_club.bmf_events;
CREATE POLICY "Authenticated manage bmf_events" ON bmf_club.bmf_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read bmf_event_registrations" ON bmf_club.bmf_event_registrations;
CREATE POLICY "Public read bmf_event_registrations" ON bmf_club.bmf_event_registrations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated manage bmf_event_registrations" ON bmf_club.bmf_event_registrations;
CREATE POLICY "Authenticated manage bmf_event_registrations" ON bmf_club.bmf_event_registrations FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read bmf_jobs" ON bmf_club.bmf_jobs;
CREATE POLICY "Public read bmf_jobs" ON bmf_club.bmf_jobs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated manage bmf_jobs" ON bmf_club.bmf_jobs;
CREATE POLICY "Authenticated manage bmf_jobs" ON bmf_club.bmf_jobs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Grant full permissions on all bmf_club tables
GRANT ALL ON TABLE bmf_club.bmf_members TO anon, authenticated, service_role;
GRANT ALL ON TABLE bmf_club.bmf_cards TO anon, authenticated, service_role;
GRANT ALL ON TABLE bmf_club.bmf_events TO anon, authenticated, service_role;
GRANT ALL ON TABLE bmf_club.bmf_event_registrations TO anon, authenticated, service_role;
GRANT ALL ON TABLE bmf_club.bmf_jobs TO anon, authenticated, service_role;

-- 7. Create Updatable Views in `public` Schema for Seamless Backward Compatibility
CREATE OR REPLACE VIEW public.bmf_members AS SELECT * FROM bmf_club.bmf_members;
CREATE OR REPLACE VIEW public.bmf_cards AS SELECT * FROM bmf_club.bmf_cards;
CREATE OR REPLACE VIEW public.bmf_events AS SELECT * FROM bmf_club.bmf_events;
CREATE OR REPLACE VIEW public.bmf_event_registrations AS SELECT * FROM bmf_club.bmf_event_registrations;
CREATE OR REPLACE VIEW public.bmf_jobs AS SELECT * FROM bmf_club.bmf_jobs;

GRANT ALL ON public.bmf_members TO anon, authenticated, service_role;
GRANT ALL ON public.bmf_cards TO anon, authenticated, service_role;
GRANT ALL ON public.bmf_events TO anon, authenticated, service_role;
GRANT ALL ON public.bmf_event_registrations TO anon, authenticated, service_role;
GRANT ALL ON public.bmf_jobs TO anon, authenticated, service_role;
