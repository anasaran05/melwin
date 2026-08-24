-- ==============================================================================
-- BMF CLUB: ADD PRIVATE CONTACT DETAILS TO BMF_MEMBERS & REFRESH PUBLIC VIEW
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- 1. Add private contact columns to bmf_club.bmf_members if they don't exist
ALTER TABLE bmf_club.bmf_members
  ADD COLUMN IF NOT EXISTS phone_number text NULL,
  ADD COLUMN IF NOT EXISTS whatsapp_number text NULL,
  ADD COLUMN IF NOT EXISTS telegram_handle text NULL,
  ADD COLUMN IF NOT EXISTS preferred_contact_method text NULL DEFAULT 'whatsapp',
  ADD COLUMN IF NOT EXISTS contact_privacy_accepted boolean NULL DEFAULT true;

-- 2. Ensure comment documentation on privacy expectations
COMMENT ON COLUMN bmf_club.bmf_members.phone_number IS 'Private contact phone number for internal concierge and emergency RSVP only. Never displayed on public cards.';
COMMENT ON COLUMN bmf_club.bmf_members.whatsapp_number IS 'Private WhatsApp number for instant mastermind & dinner notifications.';
COMMENT ON COLUMN bmf_club.bmf_members.telegram_handle IS 'Optional private Telegram handle for direct founder communication.';

-- 3. Re-create public view to expose the updated columns to PostgREST
CREATE OR REPLACE VIEW public.bmf_members AS 
  SELECT * FROM bmf_club.bmf_members;

-- 4. Re-grant permissions
GRANT ALL ON public.bmf_members TO anon, authenticated, service_role;

-- 5. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
