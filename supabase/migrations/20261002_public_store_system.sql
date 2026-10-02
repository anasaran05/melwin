-- ==============================================================================
-- Migration: 20261002_public_store_system.sql
-- Description: Independent Public Digital Store system in public schema,
--              ensuring complete decoupling from bmf_club members and cards,
--              with backward-compatible views for BMF Club.
-- ==============================================================================

-- 1. Create public.store_products table
CREATE TABLE IF NOT EXISTS public.store_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Fundraising', 'Growth', 'Legal & Grants', 'Operations', 'AI & Systems', 'Templates', 'E-Books'
    product_type TEXT NOT NULL DEFAULT 'playbook', -- 'pdf', 'notion', 'sheets', 'video', 'bundle', 'template'
    format_badge TEXT NOT NULL DEFAULT 'PDF Guide', -- 'PDF Guide', 'Google Sheets', 'Notion OS', 'Figma + Keynote'
    
    -- Pricing Structure
    regular_price NUMERIC(10, 2) NOT NULL DEFAULT 999.00,
    sale_price NUMERIC(10, 2),
    bmf_discount_percent INTEGER NOT NULL DEFAULT 50, -- 50% discount for active BMF Club members
    is_free_public BOOLEAN DEFAULT false,
    is_free_for_bmf BOOLEAN DEFAULT false,
    is_exclusive BOOLEAN DEFAULT false,
    
    -- Multi-Channel Visibility
    show_in_public_store BOOLEAN DEFAULT true, -- Appears on /store
    show_in_bmf_club BOOLEAN DEFAULT true,    -- Appears on /bmf-club/store
    
    -- Assets & Media
    asset_url TEXT,
    preview_url TEXT,
    thumbnail_url TEXT,
    highlights JSONB DEFAULT '[]'::jsonb,
    
    -- Metrics & SEO
    author_name TEXT DEFAULT 'Build With Melwin',
    sales_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_store_products_slug ON public.store_products(slug);
CREATE INDEX IF NOT EXISTS idx_store_products_pub ON public.store_products(is_published, show_in_public_store);
CREATE INDEX IF NOT EXISTS idx_store_products_cat ON public.store_products(category);
CREATE INDEX IF NOT EXISTS idx_store_products_order ON public.store_products(display_order);

-- 2. Create public.store_orders table (isolated from BMF Club memberships)
CREATE TABLE IF NOT EXISTS public.store_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT UNIQUE NOT NULL, -- e.g. 'store_ord_1727878800_abcde'
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    order_amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    payment_gateway TEXT DEFAULT 'cashfree',
    payment_session_id TEXT,
    cf_payment_id TEXT,
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'pending', 'paid', 'failed', 'cancelled', 'refunded')),
    items JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ product_id, title, price, discount_applied }]
    channel TEXT NOT NULL DEFAULT 'public_store', -- 'public_store' | 'bmf_club'
    is_bmf_member BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_store_orders_email ON public.store_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_store_orders_user ON public.store_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_store_orders_order_id ON public.store_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_store_orders_status ON public.store_orders(status);

-- 3. Create public.store_purchases table (customer asset downloads & licensing)
CREATE TABLE IF NOT EXISTS public.store_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES public.store_products(id) ON DELETE CASCADE,
    order_id TEXT REFERENCES public.store_orders(order_id) ON DELETE SET NULL,
    amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0,
    access_status TEXT NOT NULL DEFAULT 'active' CHECK (access_status IN ('active', 'revoked')),
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMPTZ,
    channel TEXT NOT NULL DEFAULT 'public_store',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_store_purchases_user ON public.store_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_store_purchases_email ON public.store_purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_store_purchases_prod ON public.store_purchases(product_id);

-- 4. Create public.store_favorites table (Wishlist)
CREATE TABLE IF NOT EXISTS public.store_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_email TEXT,
    product_id UUID NOT NULL REFERENCES public.store_products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_store_favorites_user ON public.store_favorites(user_id);

-- 5. Enable RLS
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_favorites ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read published public store products
DROP POLICY IF EXISTS "Public can view published store products" ON public.store_products;
CREATE POLICY "Public can view published store products" ON public.store_products
    FOR SELECT USING (is_published = true AND show_in_public_store = true);

DROP POLICY IF EXISTS "Service role full access store_products" ON public.store_products;
CREATE POLICY "Service role full access store_products" ON public.store_products
    FOR ALL USING (true);

-- Orders: Users can view their own orders
DROP POLICY IF EXISTS "Users can view own store orders" ON public.store_orders;
CREATE POLICY "Users can view own store orders" ON public.store_orders
    FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = customer_email);

DROP POLICY IF EXISTS "Service role full access store_orders" ON public.store_orders;
CREATE POLICY "Service role full access store_orders" ON public.store_orders
    FOR ALL USING (true);

-- Purchases: Users can view their own purchases
DROP POLICY IF EXISTS "Users can view own store purchases" ON public.store_purchases;
CREATE POLICY "Users can view own store purchases" ON public.store_purchases
    FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = customer_email);

DROP POLICY IF EXISTS "Service role full access store_purchases" ON public.store_purchases;
CREATE POLICY "Service role full access store_purchases" ON public.store_purchases
    FOR ALL USING (true);

-- Favorites: Users can manage their own favorites
DROP POLICY IF EXISTS "Users manage own store favorites" ON public.store_favorites;
CREATE POLICY "Users manage own store favorites" ON public.store_favorites
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access store_favorites" ON public.store_favorites;
CREATE POLICY "Service role full access store_favorites" ON public.store_favorites
    FOR ALL USING (true);

-- Grants
GRANT SELECT ON public.store_products TO anon, authenticated, service_role;
GRANT SELECT ON public.store_orders TO authenticated, service_role;
GRANT SELECT ON public.store_purchases TO authenticated, service_role;
GRANT ALL ON public.store_favorites TO authenticated, service_role;
GRANT ALL ON public.store_products TO service_role;
GRANT ALL ON public.store_orders TO service_role;
GRANT ALL ON public.store_purchases TO service_role;

-- 6. Migrate existing bmf_products into public.store_products if not already present
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'bmf_club' AND table_name = 'bmf_products' AND table_type = 'BASE TABLE') THEN
        INSERT INTO public.store_products (
            id, slug, title, subtitle, description, category, product_type, format_badge, 
            regular_price, bmf_discount_percent, is_exclusive, is_free_for_bmf, highlights, 
            asset_url, preview_url, thumbnail_url, author_name, sales_count, is_published, 
            display_order, show_in_public_store, show_in_bmf_club, metadata, created_at, updated_at
        )
        SELECT 
            id, slug, title, subtitle, description, category, product_type, format_badge, 
            regular_price, premium_discount_percent, is_exclusive, is_free_for_premium, highlights, 
            asset_url, preview_url, thumbnail_url, author_name, sales_count, is_published, 
            display_order, true, true, metadata, created_at, updated_at
        FROM bmf_club.bmf_products
        ON CONFLICT (slug) DO UPDATE SET
            regular_price = EXCLUDED.regular_price,
            asset_url = COALESCE(EXCLUDED.asset_url, public.store_products.asset_url),
            updated_at = now();
    END IF;
END $$;

-- 7. Seed initial core products if table is empty
INSERT INTO public.store_products (
    slug, title, subtitle, description, category, product_type, format_badge, 
    regular_price, sale_price, bmf_discount_percent, is_exclusive, highlights, display_order, asset_url
) VALUES
(
    'tn-angel-pitch-deck',
    'Tamil Nadu Angel Syndicate Pitch Deck Framework',
    'Figma + Keynote + Pitch Script',
    'The exact 12-slide narrative arc used by portfolio founders to raise early-stage rounds from Chennai & Bangalore angel syndicates.',
    'Fundraising',
    'template',
    'Figma + Keynote',
    1999.00,
    999.00,
    50,
    false,
    '["Slide-by-slide commentary with real winning metrics", "Defensible moat & unit economics templates", "2-minute founder verbal pitch transcript"]'::jsonb,
    1,
    'https://buildwithmelwin.com/assets/vault/tn-angel-pitch-deck.zip'
),
(
    'cap-table-simulator',
    'Institutional Cap Table Simulator & Dilution Model',
    'Google Sheets (Pre-calculated Formulas)',
    'Model Seed, Pre-Series A, and Series A rounds with ESOP pool refreshes, SAFE notes, and convertible debentures without getting diluted.',
    'Fundraising',
    'sheets',
    'Google Sheets',
    2499.00,
    1299.00,
    50,
    false,
    '["Multi-round dilution projections", "Founder vesting cliff simulator", "Liquidation preference cascade model"]'::jsonb,
    2,
    'https://docs.google.com/spreadsheets/d/sample-bmf-cap-table'
),
(
    'founder-branding-os',
    'Founder Personal Branding Operating System',
    'Notion Workspace + Video Walkthrough',
    'The exact framework Melwin uses to build high-authority founder profiles that attract inbound deals, investors, and premier talent.',
    'Growth',
    'notion',
    'Notion Workspace',
    2999.00,
    1499.00,
    50,
    false,
    '["30-day content calendar with hook templates", "Storytelling formulas for LinkedIn & Twitter/X", "Inbound founder lead capture system"]'::jsonb,
    3,
    'https://notion.so/sample-bmf-founder-branding-os'
),
(
    'zero-cac-b2b-playbook',
    'Zero-CAC B2B Cold Outreach Architecture',
    'E-Book + 18 Email Templates',
    'Tactical cold email, WhatsApp, and LinkedIn outreach sequences for early-stage B2B founders to sign their first 50 enterprise clients.',
    'Growth',
    'pdf',
    'E-Book + 18 Templates',
    1499.00,
    799.00,
    50,
    false,
    '["High-response cold messaging sequences", "Deliverability & domain warm-up checklist", "Objection handling scripts for enterprise buyers"]'::jsonb,
    4,
    'https://buildwithmelwin.com/assets/vault/zero-cac-b2b-playbook.pdf'
),
(
    'startup-india-grants',
    'Startup India DPIIT & Seed Fund Grant Master Vault',
    'PDF Guide + Application Checklists',
    'Comprehensive navigation through government grants, tax exemptions (Section 80-IAC), and state incubators in Tamil Nadu.',
    'Legal & Grants',
    'pdf',
    'PDF Guide + Checklists',
    1299.00,
    599.00,
    50,
    false,
    '["DPIIT recognition step-by-step checklist", "SISFS (Seed Fund Scheme) application answers", "TN Startup & Innovation Mission roadmap"]'::jsonb,
    5,
    'https://buildwithmelwin.com/assets/vault/startup-india-grants-guide.pdf'
),
(
    'founder-esop-agreements',
    'Co-Founder Shareholder & ESOP Legal Suite',
    'Editable Docx + Legal Explanations',
    'Lawyer-vetted agreements covering founder vesting cliffs, IP assignment, dispute arbitration, and key employee incentive pools.',
    'Legal & Grants',
    'template',
    'Editable Legal Documents',
    2499.00,
    1299.00,
    50,
    false,
    '["Founder Shareholders Agreement (SHA) template", "Intellectual Property (IP) assignment deed", "ESOP policy documentation & grant letters"]'::jsonb,
    6,
    'https://buildwithmelwin.com/assets/vault/founder-esop-legal-suite.zip'
)
ON CONFLICT (slug) DO NOTHING;

-- 8. Backward Compatibility Views (Ensuring existing BMF Club dashboard never breaks)
CREATE OR REPLACE VIEW public.bmf_products WITH (security_invoker = true) AS
    SELECT 
        id, slug, title, subtitle, description, category, product_type, format_badge, 
        regular_price, bmf_discount_percent AS premium_discount_percent, is_exclusive, 
        is_free_for_bmf AS is_free_for_premium, highlights, asset_url, preview_url, 
        thumbnail_url, author_name, sales_count, is_published, display_order, metadata, 
        created_at, updated_at
    FROM public.store_products 
    WHERE is_published = true AND show_in_bmf_club = true;

CREATE OR REPLACE VIEW public.bmf_product_purchases WITH (security_invoker = true) AS
    SELECT 
        id, user_id, customer_email, product_id, order_id, amount_paid, 
        0 AS discount_applied_percent, access_status, download_count, created_at
    FROM public.store_purchases;

GRANT SELECT ON public.bmf_products TO anon, authenticated, service_role;
GRANT SELECT ON public.bmf_product_purchases TO authenticated, service_role;

-- 9. Cleanup unconfirmed/duplicate timestamped products if present
DELETE FROM public.store_products 
WHERE slug ~ '-\d{8,}$' 
   OR slug IN ('bmf-community-pass-free', 'export-trade-directory-free');

