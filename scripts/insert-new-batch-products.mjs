import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const productsToUpsert = [
  {
    id: '1521e09b-699f-4802-afd7-e554f5903166',
    title: 'The STAR Resume Hack',
    slug: 'the-star-resume-hack',
    subtitle: 'Executive narrative framework for high-stakes pitches & hiring',
    description: `Unlock the STAR (Situation, Task, Action, Result) storytelling framework adapted for founders, executive hires, and high-stakes investor intros.

Includes the psychological blueprint behind recruiter & investor screening, before-and-after narrative transformations that double callbacks, and plug-and-play bullet templates with quantifiable impact metrics.`,
    category: 'Career',
    product_type: 'pdf',
    format_badge: 'PDF Guide (74 KB)',
    regular_price: 99.00,
    sale_price: null,
    bmf_discount_percent: 50,
    is_free_public: false,
    is_free_for_bmf: false,
    is_exclusive: false,
    show_in_public_store: true,
    show_in_bmf_club: true,
    thumbnail_url: 'https://static.wixstatic.com/media/6abdd9_b8fc90900bc34e22bbd1125f7656eed2~mv2.webp',
    asset_url: 'https://drive.google.com/file/d/1AVKbz-OCOOtrbqB8ByIFwU9y1Rl65kLB/view?usp=drive_link',
    preview_url: null,
    author_name: 'Build With Melwin',
    is_published: true,
    display_order: 7,
    highlights: [
      'The psychological blueprint behind recruiter & investor screening',
      'Before-and-after narrative transformations that double callbacks',
      'Plug-and-play bullet templates with quantifiable impact metrics',
      'Executive storytelling framework adapted for founders & leaders'
    ],
    metadata: {
      edition: '2026 Edition',
      target_audience: 'Founders, executive hires, senior candidates, pitch teams',
      format: 'PDF Guide (74 KB)'
    },
    updated_at: new Date().toISOString()
  },
  {
    title: 'Google Card Ranking — Local SEO & Maps Playbook',
    slug: 'google-card-ranking',
    subtitle: 'The 8-Section Client Optimization & Agency Acquisition Blueprint',
    description: `The complete, battle-tested local SEO playbook to rank businesses on Google Maps and build a ₹50,000+/month agency offering Google Business Profile optimizations.

• Section 1: The Client Optimization Playbook — Phase 0 baseline audit, primary category alignment, 300-char service formula, visual asset deployment, and Ask Maps (Gemini AI) readiness.
• Section 2: Zero-Cost Dominance — Ranking your own agency profile, Service Area setup, and compliant proof of work.
• Section 3: The Compliant Review Engine — High-contrast QR stand setup, velocity targets, and review replies without policy violations or review gating.
• Section 4: The Client Acquisition Framework — The Audit Drop Method 2.0, exact walk-in script, objection handling, and 7-day follow-up cadence.
• Section 5: The Offer Ladder — ₹5,000 Profile Fix door-opener, ₹9K–₹12K Presence setup, and ₹3K–₹6K/month recurring monthly growth retainers.
• Section 6: Operational Delivery Checklist — 14-point execution checklist from manager access to UTM analytics tracking.
• Section 7: Suspension & Risk Guardrails — Critical rules to avoid video re-verification triggers, profile flags, and suspensions.
• Section 8: 30-Day Launch Plan — Step-by-step weekly roadmap from pilot clients to closing paying ₹5K accounts.`,
    category: 'Growth',
    product_type: 'playbook',
    format_badge: 'Playbook',
    regular_price: 499.00,
    sale_price: null,
    bmf_discount_percent: 50,
    is_free_public: false,
    is_free_for_bmf: false,
    is_exclusive: false,
    show_in_public_store: true,
    show_in_bmf_club: true,
    thumbnail_url: 'https://static.wixstatic.com/media/6abdd9_140ee4bf584243cbb5f20361a18738c3~mv2.webp',
    asset_url: 'https://drive.google.com/file/d/placeholder/view?usp=drive_link',
    preview_url: null,
    author_name: 'Build With Melwin',
    is_published: true,
    display_order: 9,
    highlights: [
      'Phase 0-6 Client Optimization: NAP consistency, 300-char service formula & visual asset deployment',
      'Ask Maps & Gemini AI readiness: Structuring profile & website data for Google\'s new AI answers',
      'The Compliant Review Engine: Steady review velocity without gating, policy violations, or penalties',
      'The Audit Drop Method 2.0: Exact walk-in script & 48-hour delivery framework to close ₹5,000 fixes',
      'The Offer Ladder: Structuring ₹5K one-time audit fixes into ₹3K-₹6K/month recurring retainers',
      'Operational Checklist, Suspension Guardrails & 30-Day Agency Launch Roadmap'
    ],
    metadata: {
      edition: 'October 2026',
      target_audience: 'Local agency owners, freelancers, consultants, local business owners',
      format: 'Playbook'
    },
    updated_at: new Date().toISOString()
  }
]

async function upsertProducts() {
  for (const item of productsToUpsert) {
    console.log(`Processing product: ${item.title} (${item.slug})...`)
    const { data: existing } = await supabase
      .from('store_products')
      .select('id, slug')
      .or(`slug.eq.${item.slug}${item.id ? `,id.eq.${item.id}` : ''}`)
      .maybeSingle()

    if (existing) {
      console.log(`Product found with ID ${existing.id}, updating...`)
      const { data: updated, error: updateErr } = await supabase
        .from('store_products')
        .update(item)
        .eq('id', existing.id)
        .select()
        .single()

      if (updateErr) {
        console.error(`Update error for ${item.slug}:`, updateErr)
      } else {
        console.log(`Successfully updated: ${updated.id} | ${updated.title}`)
      }
    } else {
      console.log(`Inserting new product: ${item.slug}...`)
      const { data: inserted, error: insertErr } = await supabase
        .from('store_products')
        .insert(item)
        .select()
        .single()

      if (insertErr) {
        console.error(`Insert error for ${item.slug}:`, insertErr)
      } else {
        console.log(`Successfully inserted: ${inserted.id} | ${inserted.title}`)
      }
    }
  }
}

upsertProducts()
