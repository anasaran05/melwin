-- ==============================================================================
-- BMF CLUB: EXPOSE BMF_CLUB TABLES TO POSTGREST VIA PUBLIC VIEWS
-- Run this in your Supabase SQL Editor to fix "Could not find table in schema cache"
-- ==============================================================================

-- 1. Grant USAGE on the bmf_club schema to all API roles
GRANT USAGE ON SCHEMA bmf_club TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA bmf_club TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA bmf_club TO anon, authenticated, service_role;

-- 2. Create auto-updatable views in the public schema pointing to bmf_club
CREATE OR REPLACE VIEW public.bmf_members AS 
  SELECT * FROM bmf_club.bmf_members;

CREATE OR REPLACE VIEW public.bmf_cards AS 
  SELECT * FROM bmf_club.bmf_cards;

CREATE OR REPLACE VIEW public.bmf_events AS 
  SELECT * FROM bmf_club.bmf_events;

CREATE OR REPLACE VIEW public.bmf_event_registrations AS 
  SELECT * FROM bmf_club.bmf_event_registrations;

CREATE OR REPLACE VIEW public.bmf_jobs AS 
  SELECT * FROM bmf_club.bmf_jobs;

-- 3. Grant full permissions on the public views
GRANT ALL ON public.bmf_members TO anon, authenticated, service_role;
GRANT ALL ON public.bmf_cards TO anon, authenticated, service_role;
GRANT ALL ON public.bmf_events TO anon, authenticated, service_role;
GRANT ALL ON public.bmf_event_registrations TO anon, authenticated, service_role;
GRANT ALL ON public.bmf_jobs TO anon, authenticated, service_role;

-- 4. Reload PostgREST schema cache immediately
NOTIFY pgrst, 'reload schema';
