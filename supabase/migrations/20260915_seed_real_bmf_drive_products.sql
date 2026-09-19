-- ==============================================================================
-- Migration: 20260915_seed_real_bmf_drive_products.sql
-- Description: Replace demo items with Melwin's 17 real Google Drive digital products.
--              7 Paid products @ ₹99 (50% off for BMF Club Pass members = ₹49)
--              10 Free products @ ₹0 (Free for everyone to unlock & download)
-- ==============================================================================

-- 1. Clean out existing placeholder items
DELETE FROM bmf_club.bmf_products;

-- 2. Insert the 17 real digital products
INSERT INTO bmf_club.bmf_products (
    slug,
    title,
    subtitle,
    description,
    category,
    product_type,
    format_badge,
    regular_price,
    premium_discount_percent,
    is_exclusive,
    is_free_for_premium,
    highlights,
    asset_url,
    display_order,
    is_published
) VALUES
-- ============================================================================
-- 7 PAID PRODUCTS (₹99 regular, 50% off for Premium Pass = ₹49)
-- ============================================================================

-- 1. Find a buyer for your export business
(
    'find-a-buyer-export-business',
    'Find a Buyer for Your Export Business',
    'Tactical customer acquisition playbook for international trade',
    'Proven framework and verified channels to discover, qualify, and secure verified international B2B buyers for your export commodities.',
    'Export & Trade',
    'pdf',
    'PDF Playbook (29 KB)',
    99.00,
    50,
    false,
    false,
    '["Global trade directories and verified buyer discovery", "Direct outreach scripts for international purchasing heads", "Handling advance payment terms & letter of credit compliance"]'::jsonb,
    'https://drive.google.com/file/d/1umBw7J66Fe2epl8r62jl__h7fIXQwyyF/view?usp=drive_link',
    1,
    true
),

-- 2. How to brand like a pro?
(
    'how-to-brand-like-a-pro',
    'How to Brand Like a Pro?',
    'Executive positioning and high-authority brand playbook',
    'The exact founder positioning architecture Melwin uses to build high-authority personal and corporate brands that attract inbound opportunities.',
    'Growth',
    'pdf',
    'PDF Guide (61 KB)',
    99.00,
    50,
    false,
    false,
    '["Core positioning architecture & unique value proposition", "Visual identity and content hooks that build instant trust", "Distribution tactics across LinkedIn, Twitter/X and media"]'::jsonb,
    'https://drive.google.com/file/d/1G-9bKvp4_WqZwYvTQ7Zg9bOXWK2FS9b_/view?usp=drive_link',
    2,
    true
),

-- 3. Export these!
(
    'export-these-high-margin-products',
    'Export These! (High-Margin Directory)',
    'Curated catalogue of high-demand Indian export products',
    'Strategic breakdown of high-margin export commodities and manufacturing goods from India with proven global demand and favorable tariff terms.',
    'Export & Trade',
    'pdf',
    'PDF Guide (273 KB)',
    99.00,
    50,
    false,
    false,
    '["Highest margin export sectors for 2026", "Target country demand heatmaps and port logistics", "Quality certification requirements & initial capital needed"]'::jsonb,
    'https://drive.google.com/file/d/1JTmdztPWWAruTPhZk45BbJ7DCczeqTFI/view?usp=drive_link',
    3,
    true
),

-- 4. The STAR resume hack
(
    'the-star-resume-hack',
    'The STAR Resume Hack',
    'Executive narrative framework for high-stakes pitches & hiring',
    'Unlock the STAR (Situation, Task, Action, Result) storytelling framework adapted for founders, executive hires, and high-stakes investor intros.',
    'Career',
    'pdf',
    'PDF Guide (74 KB)',
    99.00,
    50,
    false,
    false,
    '["The psychological blueprint behind recruiter & investor screening", "Before-and-after narrative transformations that double callbacks", "Plug-and-play bullet templates with quantifiable impact metrics"]'::jsonb,
    'https://drive.google.com/file/d/1AVKbz-OCOOtrbqB8ByIFwU9y1Rl65kLB/view?usp=drive_link',
    4,
    true
),

-- 5. 1 lakh rule book
(
    '1-lakh-rule-book',
    '1 Lakh Rule Book',
    'First 100 days revenue blueprint and cash flow disciplines',
    'A tactical operational manual for early-stage entrepreneurs to systematically cross their first ₹1,00,000 in monthly revenue without burning capital.',
    'Growth',
    'pdf',
    'PDF Guide (107 KB)',
    99.00,
    50,
    false,
    false,
    '["The non-negotiable cash flow disciplines for founders", "Pricing your service or product to hit ₹1L in 30 days", "Customer retention mechanics that eliminate early churn"]'::jsonb,
    'https://drive.google.com/file/d/1wa9hYZN5eM10KEXye3IxLQmDmjb70Ka8/view?usp=drive_link',
    5,
    true
),

-- 6. 5 things required to get 10Cr+ funding without a demo
(
    '5-things-required-10cr-funding-without-demo',
    '5 Things Required to Get 10Cr+ Funding Without a Demo',
    'Venture capital conviction blueprint for early-stage founders',
    'What top angel syndicates and Tier-1 VCs really evaluate when backing pre-product founders with large seed cheques.',
    'Fundraising',
    'pdf',
    'PDF Guide (24 KB)',
    99.00,
    50,
    false,
    false,
    '["Founder defensibility and proprietary insight signaling", "Market sizing metrics that convince institutional partners", "Structuring narrative momentum before building the product"]'::jsonb,
    'https://drive.google.com/file/d/1PZdMYyBECZcFbS-jcaQRIIFLaivqwzjo/view?usp=drive_link',
    6,
    true
),

-- 7. Complete guide to business structures in India for registrations
(
    'complete-guide-business-structures-india',
    'Complete Guide to Business Structures in India',
    'Legal incorporation roadmap: Pvt Ltd, LLP, OPC & Sole Proprietorship',
    'Comprehensive legal breakdown of Indian business entities, tax benefits, liability protections, compliance burdens, and ideal setups for fundraising.',
    'Legal & Grants',
    'pdf',
    'PDF Guide (194 KB)',
    99.00,
    50,
    false,
    false,
    '["Side-by-side comparison of Pvt Ltd vs LLP vs Sole Proprietorship", "Tax exemptions under Startup India Section 80-IAC", "Statutory audit, ROC compliance, and founder liability checklists"]'::jsonb,
    'https://drive.google.com/file/d/1eeFhClkhOAPL4lyVbaBMwY9kb_tRj6t3/view?usp=drive_link',
    7,
    true
),

-- ============================================================================
-- 10 FREE PRODUCTS (₹0 — Free for everyone to claim & download)
-- ============================================================================

-- 8. EDII TN grants
(
    'edii-tn-grants',
    'EDII Tamil Nadu Startup Grants Blueprint',
    'Official government subsidy and grant navigation in Tamil Nadu',
    'Step-by-step navigation through Entrepreneurship Development and Innovation Institute (EDII) state funding schemes and innovation vouchers.',
    'Legal & Grants',
    'pdf',
    'PDF Guide (30 KB)',
    0.00,
    0,
    false,
    true,
    '["EDII grant categories & qualifying criteria", "Application dossier and financial projection checklist", "Inspection process and fund disbursement guidelines"]'::jsonb,
    'https://drive.google.com/file/d/1B6ltPgZz6oTbSR1Mmwea89cHJF8lyLTm/view?usp=drive_link',
    8,
    true
),

-- 9. Brief guide on Grants applications
(
    'brief-guide-grants-applications',
    'Brief Guide on Grants Applications',
    'How to write winning government and institutional grant proposals',
    'A tactical checklist and narrative framework for crafting high-approval grant applications across Indian state and central schemes.',
    'Legal & Grants',
    'pdf',
    'PDF Guide (95 KB)',
    0.00,
    0,
    false,
    true,
    '["How reviewers evaluate project feasibility", "Budget allocation and fund utilization format", "Common rejection mistakes and how to prevent them"]'::jsonb,
    'https://drive.google.com/file/d/1YGE2DEeBsOC5ve-u_8QC0uZ8cmZSLF1g/view?usp=drive_link',
    9,
    true
),

-- 10. Checklist for getting grants
(
    'checklist-for-getting-grants',
    'Checklist for Getting Grants',
    'Pre-submission compliance and documentation readiness matrix',
    'Never miss a mandatory attachment or verification document when applying for Startup India, TANSIM, or MSME grant programs.',
    'Legal & Grants',
    'pdf',
    'PDF Checklist (67 KB)',
    0.00,
    0,
    false,
    true,
    '["KYC, entity registration, and DPIIT verification checklist", "Audited balance sheet and CA certificate prerequisites", "Pitch deck format preferred by grant evaluation committees"]'::jsonb,
    'https://drive.google.com/file/d/1UcCe5RXZwkd1szEmd1KYnS69KTypwJB3/view?usp=drive_link',
    10,
    true
),

-- 11. Step by step guide to claim professional fee
(
    'step-by-step-claim-professional-fee',
    'Step-by-Step Guide to Claim Professional Fee',
    'Consulting fee structure, invoicing, and TDS recovery',
    'Everything you need to know about billing clients as an independent consultant, 194J TDS deductions, and invoice formatting.',
    'Operations',
    'pdf',
    'PDF Guide (23 KB)',
    0.00,
    0,
    false,
    true,
    '["Professional fee invoice structure with GST & TDS fields", "Section 194J compliance and Form 26AS reconciliation", "Payment follow-up protocols for enterprise clients"]'::jsonb,
    'https://drive.google.com/file/d/1r9WDV2Ydfl-1StcH2MsUsip-g7X_Xw0E/view?usp=drive_link',
    11,
    true
),

-- 12. Step 3, exports
(
    'step-3-exports-roadmap',
    'Step 3, Exports Execution Roadmap',
    'Customs clearance, shipping logistics, and port handling',
    'Clear breakdown of the execution phase in export operations: bill of lading, inspection certificates, and freight forwarder coordination.',
    'Export & Trade',
    'pdf',
    'PDF Guide (65 KB)',
    0.00,
    0,
    false,
    true,
    '["Shipping documentation & Bill of Lading (BL) checklist", "Customs house agent (CHA) coordination workflows", "Minimizing demurrage and container detention penalties"]'::jsonb,
    'https://drive.google.com/file/d/1ZYN5QPoqYL3a-slYr-ADDenrwpWaKEhl/view?usp=drive_link',
    12,
    true
),

-- 13. PROMPT (Find a buyer)
(
    'prompt-find-a-buyer',
    'AI Prompt Vault: Find an International Buyer',
    'Battle-tested AI prompts for B2B export buyer research',
    'A curated collection of ChatGPT and Claude prompts designed to scrape, enrich, and generate targeted cold outreach for export importers worldwide.',
    'Export & Trade',
    'pdf',
    'PDF Prompts (31 KB)',
    0.00,
    0,
    false,
    true,
    '["Market intelligence scraping prompts for specific HS codes", "Email personalization formulas based on importer trade data", "Objection handling response generators for price negotiation"]'::jsonb,
    'https://drive.google.com/file/d/1DUXa55Bz46HyMesycWqS5lHOvfFrL6Tm/view?usp=drive_link',
    13,
    true
),

-- 14. Google card optimization formula for making 1L in 30 days
(
    'google-card-optimization-1l-30-days',
    'Google Card Optimization Formula (₹1L in 30 Days)',
    'Local SEO and Google Business Profile client acquisition system',
    'How to optimize Google Business Profiles for local service businesses to generate high-intent inbound calls and close ₹1 Lakh in clients.',
    'Growth',
    'pdf',
    'PDF Blueprint (106 KB)',
    0.00,
    0,
    false,
    true,
    '["Category selection & local keyword placement formula", "Automated 5-star review collection engine", "Converting map search impressions into paying walk-ins & calls"]'::jsonb,
    'https://drive.google.com/file/d/1ksFBCnsN92rdWdVMla6aSv9BmWSXi0XR/view?usp=drive_link',
    14,
    true
),

-- 15. Email template
(
    'email-template-cold-outreach',
    'High-Converting Founder Cold Outreach Email Templates',
    'Tested email templates for sales, partnerships, and investor intros',
    'High-response cold email copy templates designed to get replies from busy founders, corporate buyers, and angel investors.',
    'Growth',
    'pdf',
    'PDF Templates (104 KB)',
    0.00,
    0,
    false,
    true,
    '["3-sentence cold intro formula with 40%+ open rate", "Soft follow-up sequences that revive dead conversations", "Investor update & introductory email frameworks"]'::jsonb,
    'https://drive.google.com/file/d/14mUO9NfWO-qrMQp1Vbwz4Del0K8k67D_/view?usp=drive_link',
    15,
    true
),

-- 16. List of 25 business ideas
(
    'list-of-25-business-ideas',
    'List of 25 Vetted Business Ideas for 2026',
    'High-margin, low-capex business opportunities for founders',
    'A curated list of 25 vetted service, agency, and product business ideas requiring under ₹50,000 initial capital to launch.',
    'Ideas & Hustles',
    'docx',
    'Editable Docx (39 KB)',
    0.00,
    0,
    false,
    true,
    '["25 business concepts across B2B, digital, and local services", "Estimated margin profiles and time-to-first-revenue", "Initial tools and tech stack recommendations for each idea"]'::jsonb,
    'https://docs.google.com/document/d/1d68WQz9Jcp857frUlKJ98FLy-b-Sqpop/edit?usp=drive_link&ouid=111231360423496004538&rtpof=true&sd=true',
    16,
    true
),

-- 17. 3 side hustles for working people & college students
(
    '3-side-hustles-working-students',
    '3 Side Hustles for Working People & College Students',
    'Scalable income streams you can start in evenings & weekends',
    'Three realistic, high-leverage side hustles that don’t conflict with full-time jobs or college classes, designed to generate consistent supplementary income.',
    'Ideas & Hustles',
    'pdf',
    'PDF Guide (51 KB)',
    0.00,
    0,
    false,
    true,
    '["High-leverage freelance consulting & micro-agencies", "Digital asset creation & content syndication models", "Time management schedules to build on weekends without burnout"]'::jsonb,
    'https://drive.google.com/file/d/1Gx2yPszjNTJDXYebH88m9lZNFRugPCXB/view?usp=drive_link',
    17,
    true
);
