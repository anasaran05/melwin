-- ==============================================================================
-- Migration: 20260915_bmf_store_and_digital_products.sql
-- Description: Dynamic schema for BMF Store digital products (e-books, masterclasses,
--              templates, PDFs), purchase tracking, and product order fulfillment.
-- ==============================================================================

-- 1. Create bmf_products table in bmf_club schema
CREATE TABLE IF NOT EXISTS bmf_club.bmf_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Fundraising', 'Growth', 'Legal', 'Masterclass', 'Operations'
    product_type TEXT NOT NULL DEFAULT 'playbook', -- 'ebook', 'masterclass', 'template', 'pdf', 'playbook', 'bundle'
    format_badge TEXT NOT NULL, -- 'PDF Guide', '1080p Video', 'Google Sheets', 'Figma + Keynote'
    regular_price NUMERIC(10, 2) NOT NULL, -- e.g. 1999.00
    premium_discount_percent INTEGER NOT NULL DEFAULT 50, -- 50% discount for Premium members
    is_exclusive BOOLEAN DEFAULT false,
    is_free_for_premium BOOLEAN DEFAULT false,
    highlights JSONB DEFAULT '[]'::jsonb,
    asset_url TEXT, -- Google Drive / CDN download link
    preview_url TEXT,
    thumbnail_url TEXT,
    author_name TEXT DEFAULT 'Build With Melwin',
    sales_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bmf_products_category ON bmf_club.bmf_products(category);
CREATE INDEX IF NOT EXISTS idx_bmf_products_is_published ON bmf_club.bmf_products(is_published);
CREATE INDEX IF NOT EXISTS idx_bmf_products_display_order ON bmf_club.bmf_products(display_order);

-- 2. Create bmf_product_purchases table for access control
CREATE TABLE IF NOT EXISTS bmf_club.bmf_product_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES bmf_club.bmf_products(id) ON DELETE CASCADE,
    order_id TEXT REFERENCES bmf_club.bmf_orders(order_id) ON DELETE SET NULL,
    amount_paid NUMERIC(10, 2) NOT NULL,
    discount_applied_percent INTEGER DEFAULT 0,
    access_status TEXT NOT NULL DEFAULT 'active' CHECK (access_status IN ('active', 'revoked')),
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bmf_product_purchases_user ON bmf_club.bmf_product_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_bmf_product_purchases_email ON bmf_club.bmf_product_purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_bmf_product_purchases_product ON bmf_club.bmf_product_purchases(product_id);

-- 3. Enhance bmf_club.bmf_orders table with order_type and product_id
ALTER TABLE bmf_club.bmf_orders 
    ADD COLUMN IF NOT EXISTS order_type TEXT DEFAULT 'membership' CHECK (order_type IN ('membership', 'product')),
    ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES bmf_club.bmf_products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bmf_orders_product_id ON bmf_club.bmf_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_bmf_orders_order_type ON bmf_club.bmf_orders(order_type);

-- 4. Expose public views with security invoker for PostgREST / Supabase Client
CREATE OR REPLACE VIEW public.bmf_products WITH (security_invoker = true) AS
    SELECT * FROM bmf_club.bmf_products WHERE is_published = true;

CREATE OR REPLACE VIEW public.bmf_product_purchases WITH (security_invoker = true) AS
    SELECT * FROM bmf_club.bmf_product_purchases;

-- Grant access
GRANT SELECT ON public.bmf_products TO anon, authenticated, service_role;
GRANT SELECT ON public.bmf_product_purchases TO authenticated, service_role;
GRANT ALL ON bmf_club.bmf_products TO service_role;
GRANT ALL ON bmf_club.bmf_product_purchases TO service_role;

-- 5. Enable RLS
ALTER TABLE bmf_club.bmf_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmf_club.bmf_product_purchases ENABLE ROW LEVEL SECURITY;

-- Product policies: Anyone can view published products
DROP POLICY IF EXISTS "Public can view published products" ON bmf_club.bmf_products;
CREATE POLICY "Public can view published products" ON bmf_club.bmf_products
    FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Service role full access products" ON bmf_club.bmf_products;
CREATE POLICY "Service role full access products" ON bmf_club.bmf_products
    FOR ALL USING (true);

-- Product Purchases policies: Users can view their own purchases
DROP POLICY IF EXISTS "Users can view their own purchases" ON bmf_club.bmf_product_purchases;
CREATE POLICY "Users can view their own purchases" ON bmf_club.bmf_product_purchases
    FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = customer_email);

DROP POLICY IF EXISTS "Service role full access purchases" ON bmf_club.bmf_product_purchases;
CREATE POLICY "Service role full access purchases" ON bmf_club.bmf_product_purchases
    FOR ALL USING (true);

-- 6. Seed Initial 8 Core Digital Products
INSERT INTO bmf_club.bmf_products (
    slug, title, subtitle, description, category, product_type, format_badge, regular_price, premium_discount_percent, is_exclusive, highlights, display_order, asset_url
) VALUES
(
    'tn-angel-pitch-deck',
    'Tamil Nadu Angel Syndicate Pitch Deck Framework',
    'Figma + Keynote + Pitch Script',
    'The exact 12-slide narrative arc used by BMF portfolio founders to raise early-stage rounds from Chennai & Bangalore angel syndicates.',
    'Fundraising',
    'template',
    'Figma + Keynote + Pitch Script',
    1999.00,
    50,
    true,
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
    'spreadsheet',
    'Google Sheets (Formulas)',
    2499.00,
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
    'playbook',
    'Notion Workspace + Video',
    2999.00,
    50,
    true,
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
    'ebook',
    'E-Book + 18 Templates',
    1499.00,
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
    'Legal',
    'pdf',
    'PDF Guide + Checklists',
    1299.00,
    50,
    false,
    '["DPIIT recognition step-by-step checklist", "SISFS (Seed Fund Scheme) application answers", "TN Startup & Innovation Mission (TANSIM) roadmap"]'::jsonb,
    5,
    'https://buildwithmelwin.com/assets/vault/startup-india-grants-guide.pdf'
),
(
    'founder-esop-agreements',
    'Co-Founder Shareholder & ESOP Legal Suite',
    'Editable Docx + Legal Explanations',
    'Lawyer-vetted agreements covering founder vesting cliffs, IP assignment, dispute arbitration, and key employee incentive pools.',
    'Legal',
    'template',
    'Editable Legal Documents',
    2499.00,
    50,
    false,
    '["Founder Shareholders Agreement (SHA) template", "Intellectual Property (IP) assignment deed", "ESOP policy documentation & grant letters"]'::jsonb,
    6,
    'https://buildwithmelwin.com/assets/vault/founder-esop-legal-suite.zip'
),
(
    'masterclass-scaling-10cr',
    'Masterclass: Scaling from ₹0 to ₹10 Cr ARR',
    '1080p HD Video + Tactical Slide Deck',
    'Exclusive 2-hour breakdown with proven operators on pricing power, hiring leadership, and operational cash-flow management.',
    'Masterclass',
    'masterclass',
    '1080p HD Video + Slides',
    1999.00,
    50,
    true,
    '["GTM bottlenecks and how to escape them", "Setting executive comp & sales commissions", "Uncut Q&A on navigating early stall points"]'::jsonb,
    7,
    'https://buildwithmelwin.com/assets/vault/masterclass-scaling-10cr-stream'
),
(
    'masterclass-due-diligence',
    'Masterclass: Cracking Tier-1 Venture Due Diligence',
    '1080p HD Video + Data Room Checklist',
    'Deep dive with active fund managers on what venture capitalists investigate during technical, financial, and legal audits.',
    'Masterclass',
    'masterclass',
    '1080p HD Video + Checklist',
    2499.00,
    50,
    true,
    '["Standard investor data room folder structure", "Red flags that kill deals during term sheet phase", "Reference check protocols and backchannel management"]'::jsonb,
    8,
    'https://buildwithmelwin.com/assets/vault/masterclass-due-diligence-stream'
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    product_type = EXCLUDED.product_type,
    format_badge = EXCLUDED.format_badge,
    regular_price = EXCLUDED.regular_price,
    premium_discount_percent = EXCLUDED.premium_discount_percent,
    highlights = EXCLUDED.highlights,
    asset_url = EXCLUDED.asset_url,
    updated_at = now();
