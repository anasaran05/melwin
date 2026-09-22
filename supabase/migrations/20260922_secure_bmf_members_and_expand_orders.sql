-- ==============================================================================
-- Migration: 20260922_secure_bmf_members_and_expand_orders.sql
-- Description:
-- 1. Expands bmf_club.bmf_orders check constraint to accommodate all payment forms
--    ('membership', 'product', 'webinar', 'event', 'consultation', 'custom').
-- 2. Adds event_id and form_code columns to bmf_orders for relational tracking.
-- 3. Implements PostgreSQL trigger security on bmf_club.bmf_members to prevent
--    unauthorized client-side privilege escalation of is_verified, is_featured,
--    is_approved, membership_tier, etc.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Expand bmf_club.bmf_orders order_type constraint
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    -- Drop existing order_type check constraint if present
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'bmf_orders_order_type_check'
    ) THEN
        ALTER TABLE bmf_club.bmf_orders DROP CONSTRAINT bmf_orders_order_type_check;
    END IF;

    -- Add updated order_type check constraint
    ALTER TABLE bmf_club.bmf_orders 
        ADD CONSTRAINT bmf_orders_order_type_check 
        CHECK (order_type IN ('membership', 'product', 'webinar', 'event', 'consultation', 'custom'));

    -- Add event_id and form_code columns if they do not exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'bmf_club' AND table_name = 'bmf_orders' AND column_name = 'event_id'
    ) THEN
        ALTER TABLE bmf_club.bmf_orders ADD COLUMN event_id UUID REFERENCES bmf_club.bmf_events(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'bmf_club' AND table_name = 'bmf_orders' AND column_name = 'form_code'
    ) THEN
        ALTER TABLE bmf_club.bmf_orders ADD COLUMN form_code TEXT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bmf_orders_event_id ON bmf_club.bmf_orders(event_id);
CREATE INDEX IF NOT EXISTS idx_bmf_orders_form_code ON bmf_club.bmf_orders(form_code);

-- ------------------------------------------------------------------------------
-- 2. PostgreSQL Trigger Function: Protect Privileged Columns on bmf_members
-- Prevents authenticated non-service-role clients from setting is_verified,
-- is_approved, is_featured, membership_tier, etc. via client Supabase session.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION bmf_club.protect_bmf_member_privileged_columns()
RETURNS TRIGGER AS $$
DECLARE
    current_role TEXT := current_user;
    auth_role TEXT := auth.role();
BEGIN
    -- If executed by service_role (backend admin client with service_role key) or superuser (postgres), allow full modifications
    IF auth_role = 'service_role' OR current_role = 'postgres' THEN
        RETURN NEW;
    END IF;

    -- If executed by an authenticated or anonymous client, lock down privileged columns
    IF TG_OP = 'UPDATE' THEN
        -- Preserve previous values for sensitive attributes
        NEW.is_verified := OLD.is_verified;
        NEW.is_approved := OLD.is_approved;
        NEW.is_featured := OLD.is_featured;
        NEW.membership_tier := OLD.membership_tier;
        NEW.membership_valid_until := OLD.membership_valid_until;
        NEW.badge_title := OLD.badge_title;
        NEW.priority_order := OLD.priority_order;
        NEW.bmf_id := OLD.bmf_id;
        NEW.bmf_number := OLD.bmf_number;
        NEW.review_status := OLD.review_status;
        NEW.role := OLD.role;
    ELSIF TG_OP = 'INSERT' THEN
        -- Default sensitive attributes for new client-inserted profiles
        NEW.is_verified := false;
        NEW.is_approved := false;
        NEW.is_featured := false;
        NEW.membership_tier := 'free';
        NEW.membership_valid_until := NULL;
        NEW.badge_title := 'Founder';
        NEW.priority_order := 100;
        NEW.review_status := 'pending';
        NEW.role := 'member';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to bmf_club.bmf_members
DROP TRIGGER IF EXISTS trigger_protect_bmf_member_privileged_columns ON bmf_club.bmf_members;
CREATE TRIGGER trigger_protect_bmf_member_privileged_columns
    BEFORE INSERT OR UPDATE ON bmf_club.bmf_members
    FOR EACH ROW
    EXECUTE FUNCTION bmf_club.protect_bmf_member_privileged_columns();

-- ------------------------------------------------------------------------------
-- 3. Refresh Public Views
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.bmf_orders 
WITH (security_invoker = true) AS 
    SELECT * FROM bmf_club.bmf_orders;

GRANT ALL ON public.bmf_orders TO anon, authenticated, service_role;
