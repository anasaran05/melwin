-- ==============================================================================
-- Migration: 20260822_bmf_club_schema_and_cards.sql
-- Description: Creates dedicated `bmf_club` schema, `cards` table with approval gate,
--              RLS policies, and backward-compatible views in `public`.
-- ==============================================================================

-- 1. Create dedicated schema
CREATE SCHEMA IF NOT EXISTS bmf_club;

-- Grant usage on bmf_club schema to standard Supabase roles
GRANT USAGE ON SCHEMA bmf_club TO anon, authenticated, service_role;

-- 2. Create bmf_club.cards table with approval gate
CREATE TABLE IF NOT EXISTS bmf_club.cards (
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

-- Ensure public.bmf_cards table exists with approval gate
CREATE TABLE IF NOT EXISTS public.bmf_cards (
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

-- 3. Row Level Security for cards
ALTER TABLE bmf_club.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bmf_cards ENABLE ROW LEVEL SECURITY;

-- Public/Authenticated read policies
DROP POLICY IF EXISTS "Users can read own bmf card" ON public.bmf_cards;
CREATE POLICY "Users can read own bmf card"
    ON public.bmf_cards
    FOR SELECT
    USING (auth.uid() = user_id OR auth.role() = 'anon' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can update own bmf card" ON public.bmf_cards;
CREATE POLICY "Users can update own bmf card"
    ON public.bmf_cards
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bmf card" ON public.bmf_cards;
CREATE POLICY "Users can insert own bmf card"
    ON public.bmf_cards
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- bmf_club schema RLS policies
DROP POLICY IF EXISTS "Users can read own bmf_club card" ON bmf_club.cards;
CREATE POLICY "Users can read own bmf_club card"
    ON bmf_club.cards
    FOR ALL
    TO authenticated, anon
    USING (true);

-- 4. Grant table access to API roles
GRANT ALL ON TABLE bmf_club.cards TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.bmf_cards TO anon, authenticated, service_role;

-- 5. Helper function to auto-generate a card number
CREATE OR REPLACE FUNCTION bmf_club.generate_card_number(tier TEXT)
RETURNS TEXT AS $$
DECLARE
    prefix TEXT;
    random_part TEXT;
BEGIN
    IF tier = 'obsidian' THEN prefix := '4592';
    ELSIF tier = 'titanium' THEN prefix := '4820';
    ELSIF tier = 'gold' THEN prefix := '4718';
    ELSIF tier = 'diamond' THEN prefix := '4990';
    ELSE prefix := '4100';
    END IF;
    
    random_part := lpad(floor(random() * 9000 + 1000)::text, 4, '0') || ' ' ||
                   lpad(floor(random() * 9000 + 1000)::text, 4, '0') || ' ' ||
                   lpad(floor(random() * 9000 + 1000)::text, 4, '0');
                   
    RETURN prefix || ' ' || random_part;
END;
$$ LANGUAGE plpgsql;
