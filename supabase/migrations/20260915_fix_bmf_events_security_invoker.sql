-- Migration: 20260915_fix_bmf_events_security_invoker.sql
-- Description: Sets security_invoker = true on public.bmf_events to enforce querying user's RLS policies and resolve Supabase linter 0010_security_definer_view

-- 1. Set security_invoker on public.bmf_events
ALTER VIEW public.bmf_events SET (security_invoker = true);

-- 2. Ensure all other public BMF views enforce security_invoker
ALTER VIEW IF EXISTS public.bmf_members SET (security_invoker = true);
ALTER VIEW IF EXISTS public.bmf_cards SET (security_invoker = true);
ALTER VIEW IF EXISTS public.bmf_event_registrations SET (security_invoker = true);
ALTER VIEW IF EXISTS public.bmf_jobs SET (security_invoker = true);
ALTER VIEW IF EXISTS public.bmf_intro_requests SET (security_invoker = true);

-- 3. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
