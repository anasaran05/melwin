-- ==============================================================================
-- BMF CLUB: ADD CARD_THEME TO BMF_MEMBERS & REFRESH PUBLIC VIEW
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- 1. Add card_theme column to base table bmf_club.bmf_members
ALTER TABLE bmf_club.bmf_members
  ADD COLUMN IF NOT EXISTS card_theme TEXT DEFAULT 'obsidian';

-- 2. Add validation constraint for available luxury card themes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'bmf_members_card_theme_check'
    ) THEN
        ALTER TABLE bmf_club.bmf_members 
        ADD CONSTRAINT bmf_members_card_theme_check 
        CHECK (card_theme IN (
            'obsidian', 
            'gold_prestige', 
            'midnight_sapphire', 
            'royal_amethyst', 
            'emerald_matrix', 
            'sunset_rose', 
            'titanium_carbon'
        ));
    END IF;
END $$;

-- 3. Set Melwin / President as Featured, Verified, and Gold Prestige Theme
UPDATE bmf_club.bmf_members
SET 
    is_featured = true,
    is_verified = true,
    card_theme = 'gold_prestige',
    priority_order = 1
WHERE full_name ILIKE '%melwin%' OR role ILIKE '%president%';

-- 4. Re-create public view to expose card_theme to PostgREST API
CREATE OR REPLACE VIEW public.bmf_members AS 
  SELECT * FROM bmf_club.bmf_members;

-- 5. Re-grant permissions
GRANT ALL ON public.bmf_members TO anon, authenticated, service_role;

-- 6. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
