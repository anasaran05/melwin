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
    title: 'HS Codes for First-Time Exporters',
    slug: 'hs-codes-for-first-time-exporters',
    subtitle: "A Practical Beginner's Guide | India Edition",
    description: "The complete step-by-step framework to understand HS codes, research the exact classification for your product, check DGFT export policies, avoid customs penalties, and prepare pre-shipment compliance before your first export shipment.",
    category: 'Export & Trade',
    product_type: 'pdf',
    format_badge: 'PDF Guide',
    regular_price: 149.00,
    sale_price: null,
    bmf_discount_percent: 50,
    is_free_public: false,
    is_free_for_bmf: false,
    is_exclusive: false,
    show_in_public_store: true,
    show_in_bmf_club: true,
    thumbnail_url: '/images/hs-codes-cover.jpg',
    asset_url: 'https://drive.google.com/file/d/1L3GXFPr3k53YoaokU_oVEo8aM1ZezbTT/view?usp=drive_link',
    preview_url: null,
    author_name: 'Build With Melwin',
    is_published: true,
    display_order: 1, // Featured at the top of the store
    highlights: [
      '2-, 4-, 6- & 8-digit ITC(HS) classification breakdown',
      '7-Step repeatable research method to avoid customs queries & delays',
      'The 6 General Rules of Interpretation (GRI) demystified with real examples',
      'Product classification worksheet & complete pre-shipment checklist',
      'Buyer & CHA email templates + scam warning red flags'
    ],
    metadata: {
      edition: 'October 2026',
      pages: 24,
      target_audience: 'First-time exporters, D2C brand owners, manufacturers, traders'
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
      // Check bmf_products fallback if store_products doesn't exist
      const { data: bmfData, error: bmfErr } = await supabase
        .from('bmf_products')
        .insert({
          ...productPayload,
          premium_discount_percent: productPayload.bmf_discount_percent
        })
        .select()
        .single()

      if (bmfErr) {
        console.error('Insert error in bmf_products:', bmfErr)
        process.exit(1)
      }
      console.log('Successfully inserted into bmf_products fallback:', bmfData.id)
    } else {
      console.log('Successfully inserted product into store_products:', inserted.id, inserted.title)
    }
  }
}

insertProduct()
