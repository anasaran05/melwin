-- Migration: 20260827_add_thumbnail_url_to_bmf_events.sql
-- Description: Adds thumbnail_url to bmf_club.bmf_events table and refreshes public.bmf_events view

-- 1. Add thumbnail_url to base table in bmf_club schema
ALTER TABLE bmf_club.bmf_events 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- 2. Populate existing records if thumbnail_url is null
UPDATE bmf_club.bmf_events 
SET thumbnail_url = cover_image 
WHERE thumbnail_url IS NULL AND cover_image IS NOT NULL;

-- 3. Recreate the backward-compatible view in public schema
CREATE OR REPLACE VIEW public.bmf_events AS 
SELECT * FROM bmf_club.bmf_events;

-- 4. Grant permissions
GRANT ALL ON public.bmf_events TO anon, authenticated, service_role;
