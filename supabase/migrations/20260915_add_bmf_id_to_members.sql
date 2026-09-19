-- ==============================================================================
-- BMF CLUB: SEQUENTIAL BMF FOUNDER ID ASSIGNMENT & SCALE-PROOF TRIGGER
-- Run this migration in your Supabase SQL Editor
-- ==============================================================================

-- 1. Add bmf_number (BIGINT) and bmf_id (TEXT) to base table bmf_club.bmf_members
ALTER TABLE bmf_club.bmf_members 
    ADD COLUMN IF NOT EXISTS bmf_number BIGINT,
    ADD COLUMN IF NOT EXISTS bmf_id TEXT;

-- 2. Backfill sequential IDs for existing verified / approved founders
-- Sequence #1 is strictly reserved for Dr. Melwin (Founder & President)
-- Members #2+ are numbered sequentially in chronological order of registration (created_at ASC)
DO $$
DECLARE
    melwin_id UUID;
    rec RECORD;
    current_seq BIGINT := 1;
BEGIN
    -- Reset any existing sequence values for a clean backfill
    UPDATE bmf_club.bmf_members 
    SET bmf_number = NULL, bmf_id = NULL;

    -- Exactly locate the primary President profile (1 single row)
    SELECT id INTO melwin_id 
    FROM bmf_club.bmf_members 
    WHERE priority_order = 1 
       OR email = 'buildwithmelwin@gmail.com' 
       OR (role ILIKE '%president%' AND full_name ILIKE '%melwin%')
    ORDER BY priority_order ASC, created_at ASC
    LIMIT 1;

    -- Assign BMF-0001 strictly to the single primary President profile
    IF melwin_id IS NOT NULL THEN
        UPDATE bmf_club.bmf_members
        SET 
            bmf_number = 1,
            bmf_id = 'BMF-0001'
        WHERE id = melwin_id;
    END IF;

    -- Iterate through remaining approved/verified founders in chronological order
    FOR rec IN (
        SELECT id 
        FROM bmf_club.bmf_members
        WHERE is_approved = true
          AND (melwin_id IS NULL OR id != melwin_id)
        ORDER BY created_at ASC
    ) LOOP
        current_seq := current_seq + 1;
        UPDATE bmf_club.bmf_members
        SET 
            bmf_number = current_seq,
            bmf_id = 'BMF-' || LPAD(current_seq::text, GREATEST(4, LENGTH(current_seq::text)), '0')
        WHERE id = rec.id;
    END LOOP;
END $$;

-- 3. Add UNIQUE constraints and B-Tree indexes now that data is cleanly backfilled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'bmf_members_bmf_number_key'
    ) THEN
        ALTER TABLE bmf_club.bmf_members 
        ADD CONSTRAINT bmf_members_bmf_number_key UNIQUE (bmf_number);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'bmf_members_bmf_id_key'
    ) THEN
        ALTER TABLE bmf_club.bmf_members 
        ADD CONSTRAINT bmf_members_bmf_id_key UNIQUE (bmf_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bmf_members_bmf_number ON bmf_club.bmf_members(bmf_number);
CREATE INDEX IF NOT EXISTS idx_bmf_members_bmf_id ON bmf_club.bmf_members(bmf_id);

-- 4. Create or synchronize the 64-bit PostgreSQL Sequence
-- Starts right after the highest existing member number so there are zero conflicts
CREATE SEQUENCE IF NOT EXISTS bmf_club.bmf_member_seq AS BIGINT;

DO $$
DECLARE
    max_num BIGINT;
BEGIN
    SELECT COALESCE(MAX(bmf_number), 1) INTO max_num FROM bmf_club.bmf_members;
    PERFORM setval('bmf_club.bmf_member_seq', max_num);
END $$;

-- Grant sequence usage to API roles
GRANT USAGE, SELECT ON SEQUENCE bmf_club.bmf_member_seq TO postgres, anon, authenticated, service_role;

-- 5. Create automated Trigger Function for future founder cards
-- Whenever a founder card is verified/approved, automatically assign the next BMF ID
CREATE OR REPLACE FUNCTION bmf_club.assign_bmf_id()
RETURNS TRIGGER AS $$
DECLARE
    next_val BIGINT;
BEGIN
    -- Auto-assign only if bmf_number is not yet set AND card is approved/verified
    IF NEW.bmf_number IS NULL AND (NEW.is_approved = true OR NEW.is_verified = true) THEN
        next_val := nextval('bmf_club.bmf_member_seq');
        NEW.bmf_number := next_val;
        -- Dynamic expansion: pads to 4 digits minimum (BMF-0001 to BMF-9999), 
        -- smoothly scales to 5 digits (BMF-10000), 6 digits (BMF-100000), etc.
        NEW.bmf_id := 'BMF-' || LPAD(next_val::text, GREATEST(4, LENGTH(next_val::text)), '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to bmf_club.bmf_members
DROP TRIGGER IF EXISTS trigger_assign_bmf_id ON bmf_club.bmf_members;
CREATE TRIGGER trigger_assign_bmf_id
    BEFORE INSERT OR UPDATE ON bmf_club.bmf_members
    FOR EACH ROW
    EXECUTE FUNCTION bmf_club.assign_bmf_id();

-- 6. Re-create public view to expose bmf_number and bmf_id to PostgREST API
CREATE OR REPLACE VIEW public.bmf_members AS 
    SELECT * FROM bmf_club.bmf_members;

-- 7. Grant permissions
GRANT ALL ON public.bmf_members TO postgres, anon, authenticated, service_role;

-- 8. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
