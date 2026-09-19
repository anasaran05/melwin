-- ==============================================================================
-- Migration: 20260915_bmf_orders_and_subscriptions.sql
-- Description: Creates bmf_orders, bmf_payments, bmf_subscriptions in bmf_club schema
--              and enhances bmf_members with membership_tier & validity tracking.
-- ==============================================================================

-- 1. Create dedicated bmf_club schema if not exists
CREATE SCHEMA IF NOT EXISTS bmf_club;

-- Grant schema permissions to standard roles
GRANT USAGE ON SCHEMA bmf_club TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA bmf_club GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA bmf_club GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- 2. Enhance bmf_club.bmf_members with membership_tier
ALTER TABLE bmf_club.bmf_members 
    ADD COLUMN IF NOT EXISTS membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'premium')),
    ADD COLUMN IF NOT EXISTS membership_valid_until TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS premium_perks JSONB DEFAULT '[]'::jsonb;

-- Create index on membership_tier for high-performance filtering
CREATE INDEX IF NOT EXISTS idx_bmf_members_membership_tier ON bmf_club.bmf_members(membership_tier);

-- 3. Create bmf_club.bmf_orders table
CREATE TABLE IF NOT EXISTS bmf_club.bmf_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT UNIQUE NOT NULL, -- e.g. bmf_prem_1726388400_abc123
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    member_id UUID REFERENCES bmf_club.bmf_members(id) ON DELETE SET NULL,
    plan_tier TEXT NOT NULL DEFAULT 'premium' CHECK (plan_tier IN ('free', 'premium')),
    billing_cycle TEXT NOT NULL DEFAULT 'annual' CHECK (billing_cycle IN ('annual', 'monthly', 'lifetime')),
    amount NUMERIC(10, 2) NOT NULL DEFAULT 799.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_gateway TEXT NOT NULL DEFAULT 'cashfree',
    payment_session_id TEXT,
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'paid', 'failed', 'cancelled', 'refunded')),
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bmf_orders_user_id ON bmf_club.bmf_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_bmf_orders_order_id ON bmf_club.bmf_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_bmf_orders_status ON bmf_club.bmf_orders(status);

-- 4. Create bmf_club.bmf_payments table
CREATE TABLE IF NOT EXISTS bmf_club.bmf_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES bmf_club.bmf_orders(order_id) ON DELETE CASCADE,
    cf_payment_id TEXT UNIQUE NOT NULL,
    payment_method TEXT, -- upi, card, netbanking, app, etc.
    payment_amount NUMERIC(10, 2) NOT NULL,
    payment_currency TEXT DEFAULT 'INR',
    payment_status TEXT NOT NULL CHECK (payment_status IN ('SUCCESS', 'FAILED', 'PENDING', 'CANCELLED', 'USER_DROPPED')),
    payment_time TIMESTAMPTZ DEFAULT now(),
    bank_reference TEXT,
    failure_reason TEXT,
    raw_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bmf_payments_order_id ON bmf_club.bmf_payments(order_id);
CREATE INDEX IF NOT EXISTS idx_bmf_payments_cf_payment_id ON bmf_club.bmf_payments(cf_payment_id);

-- 5. Create bmf_club.bmf_subscriptions table
CREATE TABLE IF NOT EXISTS bmf_club.bmf_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    member_id UUID REFERENCES bmf_club.bmf_members(id) ON DELETE SET NULL,
    plan_tier TEXT NOT NULL DEFAULT 'premium' CHECK (plan_tier IN ('free', 'premium')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'expired')),
    billing_cycle TEXT NOT NULL DEFAULT 'annual' CHECK (billing_cycle IN ('annual', 'monthly', 'lifetime')),
    current_period_start TIMESTAMPTZ DEFAULT now(),
    current_period_end TIMESTAMPTZ DEFAULT (now() + INTERVAL '1 year'),
    last_order_id TEXT REFERENCES bmf_club.bmf_orders(order_id),
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bmf_subscriptions_user_id ON bmf_club.bmf_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_bmf_subscriptions_status ON bmf_club.bmf_subscriptions(status);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE bmf_club.bmf_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmf_club.bmf_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmf_club.bmf_subscriptions ENABLE ROW LEVEL SECURITY;

-- Orders policies: Users can view their own orders
DROP POLICY IF EXISTS "Users can view own bmf orders" ON bmf_club.bmf_orders;
CREATE POLICY "Users can view own bmf orders"
    ON bmf_club.bmf_orders FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Subscriptions policies: Users can view their own subscription
DROP POLICY IF EXISTS "Users can view own bmf subscription" ON bmf_club.bmf_subscriptions;
CREATE POLICY "Users can view own bmf subscription"
    ON bmf_club.bmf_subscriptions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Service role bypasses all RLS for webhooks & backend order creation
DROP POLICY IF EXISTS "Service role has full access to bmf_orders" ON bmf_club.bmf_orders;
CREATE POLICY "Service role has full access to bmf_orders"
    ON bmf_club.bmf_orders FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full access to bmf_payments" ON bmf_club.bmf_payments;
CREATE POLICY "Service role has full access to bmf_payments"
    ON bmf_club.bmf_payments FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service role has full access to bmf_subscriptions" ON bmf_club.bmf_subscriptions;
CREATE POLICY "Service role has full access to bmf_subscriptions"
    ON bmf_club.bmf_subscriptions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 7. Create backward-compatible views in public schema enforcing security_invoker
CREATE OR REPLACE VIEW public.bmf_orders WITH (security_invoker = true) AS
SELECT * FROM bmf_club.bmf_orders;

CREATE OR REPLACE VIEW public.bmf_payments WITH (security_invoker = true) AS
SELECT * FROM bmf_club.bmf_payments;

CREATE OR REPLACE VIEW public.bmf_subscriptions WITH (security_invoker = true) AS
SELECT * FROM bmf_club.bmf_subscriptions;

-- Ensure security_invoker = true is explicitly set
ALTER VIEW public.bmf_orders SET (security_invoker = true);
ALTER VIEW public.bmf_payments SET (security_invoker = true);
ALTER VIEW public.bmf_subscriptions SET (security_invoker = true);

GRANT SELECT ON public.bmf_orders TO anon, authenticated, service_role;
GRANT SELECT ON public.bmf_payments TO anon, authenticated, service_role;
GRANT SELECT ON public.bmf_subscriptions TO anon, authenticated, service_role;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
