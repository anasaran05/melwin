-- Migration: 20260822_bmf_events_system.sql
-- Description: Sets up bmf_events and bmf_event_registrations tables with capacity tracking, CTA routing, and RLS policies

-- 1. Create bmf_events table
CREATE TABLE IF NOT EXISTS public.bmf_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    tagline TEXT,
    description TEXT,
    cover_image TEXT,
    event_date TEXT NOT NULL,
    event_time TEXT,
    location_type TEXT DEFAULT 'in_person' CHECK (location_type IN ('in_person', 'virtual', 'hybrid')),
    location_venue TEXT,
    location_city TEXT DEFAULT 'Bangalore',
    category TEXT DEFAULT 'Mastermind',
    total_capacity INT DEFAULT 30,
    registered_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'past', 'closed', 'sold_out')),
    cta_type TEXT DEFAULT 'internal_form' CHECK (cta_type IN ('internal_form', 'external_link')),
    external_cta_url TEXT,
    external_cta_text TEXT DEFAULT 'Request Invitation',
    pricing_type TEXT DEFAULT 'members_only' CHECK (pricing_type IN ('free', 'paid', 'members_only', 'invite_only')),
    price_inr NUMERIC DEFAULT 0,
    requirements TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create bmf_event_registrations table
CREATE TABLE IF NOT EXISTS public.bmf_event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.bmf_events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    role TEXT,
    linkedin_url TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'waitlisted', 'attended')),
    admin_feedback TEXT,
    ticket_code TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Row Level Security for bmf_events
ALTER TABLE public.bmf_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published bmf_events" ON public.bmf_events;
CREATE POLICY "Public read published bmf_events"
    ON public.bmf_events
    FOR SELECT
    USING (is_published = true);

DROP POLICY IF EXISTS "Admins manage bmf_events" ON public.bmf_events;
CREATE POLICY "Admins manage bmf_events"
    ON public.bmf_events
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. Row Level Security for bmf_event_registrations
ALTER TABLE public.bmf_event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert own registration" ON public.bmf_event_registrations;
CREATE POLICY "Public can insert own registration"
    ON public.bmf_event_registrations
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can read own registrations" ON public.bmf_event_registrations;
CREATE POLICY "Users can read own registrations"
    ON public.bmf_event_registrations
    FOR SELECT
    USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins manage event registrations" ON public.bmf_event_registrations;
CREATE POLICY "Admins manage event registrations"
    ON public.bmf_event_registrations
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
