-- ==============================================================================
-- BMF CLUB: SECURE ALL PUBLIC VIEWS & ENFORCE ROW LEVEL SECURITY (RLS)
-- Run this in your Supabase SQL Editor to remove "UNRESTRICTED" warning & secure private data
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Enable RLS on all underlying bmf_club base tables
-- ------------------------------------------------------------------------------
ALTER TABLE bmf_club.bmf_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmf_club.bmf_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmf_club.bmf_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmf_club.bmf_event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmf_club.bmf_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmf_club.bmf_intro_requests ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. Base Table RLS Policies
-- ------------------------------------------------------------------------------

-- bmf_club.bmf_members policies
DROP POLICY IF EXISTS "Public can view approved members" ON bmf_club.bmf_members;
CREATE POLICY "Public can view approved members" 
  ON bmf_club.bmf_members FOR SELECT 
  USING (is_approved = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own member profile" ON bmf_club.bmf_members;
CREATE POLICY "Users can manage own member profile" 
  ON bmf_club.bmf_members FOR ALL 
  TO authenticated 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- bmf_club.bmf_intro_requests policies (Confidential warm intros)
DROP POLICY IF EXISTS "Users view own intro requests" ON bmf_club.bmf_intro_requests;
CREATE POLICY "Users view own intro requests" 
  ON bmf_club.bmf_intro_requests FOR SELECT 
  TO authenticated 
  USING (auth.uid() = requester_user_id OR target_member_id IN (
    SELECT id FROM bmf_club.bmf_members WHERE user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Authenticated users create intro requests" ON bmf_club.bmf_intro_requests;
CREATE POLICY "Authenticated users create intro requests" 
  ON bmf_club.bmf_intro_requests FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = requester_user_id);

-- ------------------------------------------------------------------------------
-- 3. Recreate Public Views with `security_invoker = true`
-- (This enforces RLS and removes the red "UNRESTRICTED" warning in Supabase UI)
-- ------------------------------------------------------------------------------

-- (A) Secure public.bmf_members view (Excludes private phone numbers & telegram from public API)
CREATE OR REPLACE VIEW public.bmf_members 
WITH (security_invoker = true) AS 
  SELECT 
    id,
    user_id,
    full_name,
    email,
    role,
    company_name,
    company_logo,
    avatar_url,
    category,
    tagline,
    description,
    stage,
    metrics,
    location,
    team_size,
    linkedin_url,
    twitter_url,
    website_url,
    is_verified,
    is_approved,
    is_featured,
    is_onboarding_completed,
    priority_order,
    badge_title,
    card_theme,
    review_status,
    created_at,
    updated_at
  FROM bmf_club.bmf_members;

-- (B) Secure public.bmf_cards view
CREATE OR REPLACE VIEW public.bmf_cards 
WITH (security_invoker = true) AS 
  SELECT * FROM bmf_club.bmf_cards;

-- (C) Secure public.bmf_events view
CREATE OR REPLACE VIEW public.bmf_events 
WITH (security_invoker = true) AS 
  SELECT * FROM bmf_club.bmf_events;

-- (D) Secure public.bmf_event_registrations view
CREATE OR REPLACE VIEW public.bmf_event_registrations 
WITH (security_invoker = true) AS 
  SELECT * FROM bmf_club.bmf_event_registrations;

-- (E) Secure public.bmf_jobs view
CREATE OR REPLACE VIEW public.bmf_jobs 
WITH (security_invoker = true) AS 
  SELECT * FROM bmf_club.bmf_jobs;

-- (F) Secure public.bmf_intro_requests view
CREATE OR REPLACE VIEW public.bmf_intro_requests 
WITH (security_invoker = true) AS 
  SELECT * FROM bmf_club.bmf_intro_requests;

-- ------------------------------------------------------------------------------
-- 4. Grant Permissions on Views
-- ------------------------------------------------------------------------------
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bmf_members TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bmf_cards TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bmf_events TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bmf_event_registrations TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bmf_jobs TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bmf_intro_requests TO anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 5. Reload PostgREST Schema Cache
-- ------------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
