import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function insertProduct() {
  const productPayload = {
    title: 'Should you register your startup? Know now!',
    slug: 'should-you-register-your-startup-know-now',
    subtitle: 'Complete Guide to Business Structures in India — Proprietorship vs LLP vs Private Limited Company',
    description: `A complete, practical decision-making manual for Indian entrepreneurs, startup founders, and freelancers navigating business registration.

Part 1: Sole Proprietorship — Zero-cost setup, individual tax slabs (ITR-3/4), full control, and unlimited personal liability risks.
Part 2: Limited Liability Partnership (LLP) — Combining operational flexibility with personal asset protection, MCA incorporation, and flat 30% tax implications.
Part 3: Private Limited Company (Pvt Ltd) — Equity issuance, ESOPs, angel/VC readiness, 22% startup corporate tax rate (Sec 115BAA), and mandatory compliance calendars.

Includes a side-by-side comparison matrix, setup vs annual maintenance cost breakdown, essential founder legal glossary (DIN, DSC, CIN, MOA/AOA, SHA, Vesting), and 8 costly legal mistakes to avoid before spending money on incorporation.`,
    category: 'Legal & Grants',
    product_type: 'pdf',
    format_badge: 'PDF Guide',
    regular_price: 49.00,
    sale_price: null,
    bmf_discount_percent: 50,
    is_free_public: false,
    is_free_for_bmf: false,
    is_exclusive: false,
    show_in_public_store: true,
    show_in_bmf_club: true,
    thumbnail_url: 'https://static.wixstatic.com/media/6abdd9_367dd42b701d4d0fbdec9991fdf5c293~mv2.webp',
    asset_url: 'https://drive.google.com/file/d/1eeFhClkhOAPL4lyVbaBMwY9kb_tRj6t3/view?usp=drive_link',
    preview_url: null,
    author_name: 'Build With Melwin',
    is_published: true,
    display_order: 4,
    highlights: [
      'Proprietorship vs LLP vs Private Limited side-by-side comparison',
      'Incorporation steps, DSC/DPIN/DIN & required documents checklist',
      'Taxation breakdown: IT slabs vs 30% flat LLP vs 22% Section 115BAA',
      'Compliance calendar & statutory filings (INC-20A, AOC-4, MGT-7, DIR-3 KYC)',
      'Cost-to-start vs maintenance breakdown & 8 critical founder legal pitfalls'
    ],
    metadata: {
      edition: 'October 2026',
      target_audience: 'Founders, early-stage entrepreneurs, solo creators, agency owners',
      format: 'PDF Guide'
    },
    updated_at: new Date().toISOString()
  }

  // Check if product with slug already exists
  const { data: existing } = await supabase
    .from('store_products')
    .select('id, slug')
    .eq('slug', productPayload.slug)
    .maybeSingle()

  if (existing) {
    console.log('Product already exists with ID:', existing.id, 'Updating...')
    const { data: updated, error: updateErr } = await supabase
      .from('store_products')
      .update(productPayload)
      .eq('id', existing.id)
      .select()
      .single()

    if (updateErr) {
      console.error('Update error:', updateErr)
      process.exit(1)
    }
    console.log('Successfully updated product:', updated.id, updated.title)
  } else {
    console.log('Inserting new product into store_products...')
    const { data: inserted, error: insertErr } = await supabase
      .from('store_products')
      .insert(productPayload)
      .select()
      .single()

    if (insertErr) {
      console.error('Insert error in store_products:', insertErr)
      process.exit(1)
    }
    console.log('Successfully inserted product into store_products:', inserted.id, inserted.title)
  }
}

insertProduct()
