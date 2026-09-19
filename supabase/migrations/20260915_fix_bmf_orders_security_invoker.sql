-- ==============================================================================
-- Migration: 20260915_fix_bmf_orders_security_invoker.sql
-- Description: Sets security_invoker = true on public.bmf_orders, public.bmf_payments,
--              and public.bmf_subscriptions to enforce querying user's RLS and resolve
--              Supabase Security Advisor error (0010_security_definer_view).
-- ==============================================================================

-- 1. Enable security_invoker on the views
ALTER VIEW IF EXISTS public.bmf_orders SET (security_invoker = true);
ALTER VIEW IF EXISTS public.bmf_payments SET (security_invoker = true);
ALTER VIEW IF EXISTS public.bmf_subscriptions SET (security_invoker = true);

-- 2. Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
