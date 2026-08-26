'use client'

import React, { useState } from 'react'
import {
  Calculator,
  Copy,
  Check,
  Zap,
  Globe,
  ShoppingBag,
  Code2,
  Cpu,
  Layers,
  Clock,
  DollarSign,
  IndianRupee,
  ShieldCheck,
  Send,
  HelpCircle,
  FileText,
  Percent,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react'

interface TierConfig {
  id: string
  name: string
  category: string
  description: string
  minUSD: number
  maxUSD: number
  minINR: number
  maxINR: number
  timeline: string
  features: string[]
  icon: React.ComponentType<{ className?: string }>
  badge: string
}

const tiers: TierConfig[] = [
  {
    id: 'landing-page',
    name: 'Landing Page & High-Converting Portfolio',
    category: 'Web & Growth',
    badge: 'RAPID LAUNCH',
    description: 'Ultra-fast, high-converting single page or portfolio with bespoke micro-animations and lead capture.',
    minUSD: 199,
    maxUSD: 399,
    minINR: 14999,
    maxINR: 29999,
    timeline: '2 – 4 Days',
    features: [
      '1–3 high-converting responsive sections',
      '100/100 Core Web Vitals optimization',
      'Smooth Framer Motion micro-interactions',
      'Lead capture form & instant email dispatch',
      'SEO metadata & OpenGraph social previews',
      'Vercel / Cloudflare edge CDN setup',
    ],
    icon: Globe,
  },
  {
    id: 'corporate-site',
    name: 'Corporate & Multi-Page Platform',
    category: 'Business Platform',
    badge: 'MOST POPULAR',
    description: 'Complete multi-page company portal with CMS blog, team directory, and clean corporate aesthetics.',
    minUSD: 499,
    maxUSD: 899,
    minINR: 34999,
    maxINR: 64999,
    timeline: '5 – 8 Days',
    features: [
      '5–10 bespoke responsive pages',
      'Headless CMS or easy Markdown publishing',
      'Tailwind CSS custom design system',
      'CRM integration (HubSpot / Notion / Airtable)',
      'Advanced technical SEO architecture',
      'Cal.com / Calendly booking integration',
    ],
    icon: Layers,
  },
  {
    id: 'ecommerce-store',
    name: 'E-Commerce Storefront & Checkout',
    category: 'E-Commerce',
    badge: 'RETAIL READY',
    description: 'Modern high-conversion storefront with dynamic cart drawer, fast checkout, and localized gateways.',
    minUSD: 699,
    maxUSD: 1299,
    minINR: 49999,
    maxINR: 89999,
    timeline: '1 – 2 Weeks',
    features: [
      'Product catalog & variant selectors',
      'Sub-second slide-over cart drawer',
      'Stripe, Razorpay, UPI & Apple Pay integration',
      'Automated order confirmation emails',
      'Inventory sync & webhook notifications',
      'Conversion tracking & Google Analytics 4',
    ],
    icon: ShoppingBag,
  },
  {
    id: 'saas-mvp',
    name: 'Full-Stack SaaS MVP Scaffold',
    category: 'SaaS & App',
    badge: 'VENTURE SCALE',
    description: 'Production web app with authentication, database architecture, subscription billing, and admin telemetry.',
    minUSD: 1199,
    maxUSD: 2299,
    minINR: 89999,
    maxINR: 169000,
    timeline: '2 – 3 Weeks',
    features: [
      'Next.js 15 + TypeScript + PostgreSQL + Prisma/Drizzle',
      'OAuth & Magic link authentication (Auth.js / Supabase)',
      'Stripe / Razorpay subscriptions & tier limits',
      'Interactive dashboard & metrics views',
      'Role-based access control (RBAC)',
      'Clean REST/Server Actions API architecture',
    ],
    icon: Code2,
  },
  {
    id: 'ai-pipeline',
    name: 'Applied AI & Automation Engine',
    category: 'AI & Automations',
    badge: 'AUTOPILOT',
    description: 'Autonomous LLM agent workflows, vector retrieval (RAG), and data enrichment pipelines.',
    minUSD: 799,
    maxUSD: 1599,
    minINR: 59999,
    maxINR: 119000,
    timeline: '1 – 2 Weeks',
    features: [
      'Claude 3.5 & GPT-4o Agent workflows',
      'Vector semantic search & PDF/Doc RAG',
      'Automated scrapers & data enrichers',
      'Background workers & cron schedule jobs',
      'Token optimization & safety guardrails',
      'Custom webhook triggers & Slack/Telegram alerts',
    ],
    icon: Cpu,
  },
  {
    id: 'dedicated-squad',
    name: 'Dedicated Engineering Retainer',
    category: 'Retainer SLA',
    badge: 'MONTHLY SQUAD',
    description: 'Dedicated senior engineers delivering weekly sprints, architectural reviews, and continuous deployments.',
    minUSD: 1799,
    maxUSD: 2999,
    minINR: 139000,
    maxINR: 239000,
    timeline: 'Monthly Rolling',
    features: [
      '40–60 engineering hours per month',
      'Weekly sprint planning & progress sync',
      'Same-day priority bug triage & emergency SLA',
      'Continuous feature development & code reviews',
      'Direct Slack/WhatsApp engineering channel',
      'Zero long-term lock-in (cancel anytime)',
    ],
    icon: Zap,
  },
]

interface AddonOption {
  id: string
  name: string
  priceUSD: number
  priceINR: number
  description: string
}

const addons: AddonOption[] = [
  {
    id: 'rag-vector',
    name: 'Vector Database & Document RAG Setup',
    priceUSD: 199,
    priceINR: 14999,
    description: 'Custom embeddings pipeline with Pinecone/Qdrant for querying docs & PDFs.',
  },
  {
    id: 'auth-rbac',
    name: 'Multi-Role User Auth & Permissions',
    priceUSD: 149,
    priceINR: 9999,
    description: 'Granular permissions, invite flows, and session security.',
  },
  {
    id: 'payment-gateway',
    name: 'Stripe / Razorpay Global & UPI Payments',
    priceUSD: 149,
    priceINR: 9999,
    description: 'Webhooks, checkout sessions, invoice generation, and tax compliance.',
  },
  {
    id: 'scraping-bot',
    name: 'Automated Web Scraper & Scheduled Bot',
    priceUSD: 179,
    priceINR: 12999,
    description: 'Cloudflare-bypass capable scrapers with automated data storage.',
  },
  {
    id: 'speed-sla',
    name: '48-Hour Rush Delivery Guarantee',
    priceUSD: 199,
    priceINR: 14999,
    description: 'Dedicated continuous sprint for urgent launches within 48 to 72 hours.',
  },
]

export default function AtomSeAdminPricingPage() {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const [selectedTierId, setSelectedTierId] = useState<string>('landing-page')
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [clientName, setClientName] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)
  const [customDiscountPercent, setCustomDiscountPercent] = useState<number>(0)

  const activeTier = tiers.find((t) => t.id === selectedTierId) || tiers[0]

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Calculate pricing
  const baseMin = currency === 'INR' ? activeTier.minINR : activeTier.minUSD
  const baseMax = currency === 'INR' ? activeTier.maxINR : activeTier.maxUSD

  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const item = addons.find((a) => a.id === id)
    if (!item) return sum
    return sum + (currency === 'INR' ? item.priceINR : item.priceUSD)
  }, 0)

  const discountMultiplier = (100 - customDiscountPercent) / 100
  const totalMin = Math.round((baseMin + addonsTotal) * discountMultiplier)
  const totalMax = Math.round((baseMax + addonsTotal) * discountMultiplier)
  const totalMid = Math.round((totalMin + totalMax) / 2)

  const currencySymbol = currency === 'INR' ? '₹' : '$'
  const formatNumber = (num: number) => {
    return currency === 'INR' ? num.toLocaleString('en-IN') : num.toLocaleString('en-US')
  }

  // Copy proposal text generator
  const generateProposalText = () => {
    const clientGreeting = clientName.trim() ? `Hi ${clientName.trim()},\n\n` : 'Hi there,\n\n'
    const addonNames = selectedAddons
      .map((id) => addons.find((a) => a.id === id)?.name)
      .filter(Boolean)

    return `${clientGreeting}Here is the estimated fixed-scope quote for your project with Atom SE:

📦 **Scope / Package:** ${activeTier.name}
⏱️ **Timeline:** ${activeTier.timeline}
💰 **Estimated Investment:** ${currencySymbol}${formatNumber(totalMin)} – ${currencySymbol}${formatNumber(totalMax)} ${currency} (Suggested: ${currencySymbol}${formatNumber(totalMid)})

**Core Deliverables Included:**
${activeTier.features.map((f) => `• ${f}`).join('\n')}
${
  addonNames.length > 0
    ? `\n**Selected Add-ons:**\n${addonNames.map((a) => `• ${a}`).join('\n')}`
    : ''
}

**Payment & Milestone Structure:**
• 50% Milestone 1 (Design Approval & Architecture Setup)
• 50% Milestone 2 (Live QA, Final Approval & 100% Code Handover)

**Key Guarantees:**
• 100% Source-Code & IP Rights Handover
• 100/100 Core Web Vitals Performance
• 14 Days Post-Launch Warranty & Support

Let me know if you'd like to proceed, and I will share the milestone agreement and sprint schedule!`
  }

  const handleCopyProposal = async () => {
    try {
      await navigator.clipboard.writeText(generateProposalText())
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (err) {
      console.error('Failed to copy proposal:', err)
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-mono font-bold text-indigo-700 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ADMIN INTERNAL &bull; NOT VISIBLE TO PUBLIC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Atom SE Rate Cards &amp; Quote Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Calibrated AI-era competitive pricing matrix (INR &amp; USD) with real-time quotation generation for client proposals.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setCurrency('INR')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currency === 'INR'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span>INR (₹)</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrency('USD')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currency === 'USD'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            <span>USD ($)</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Package Selector & Addons (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-500">
              1. Select Project Tier / Scope
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tiers.map((tier) => {
                const Icon = tier.icon
                const isSelected = selectedTierId === tier.id
                const minPrice = currency === 'INR' ? tier.minINR : tier.minUSD
                const maxPrice = currency === 'INR' ? tier.maxINR : tier.maxUSD

                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {tier.badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {tier.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {tier.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-indigo-700">
                        {currencySymbol}{formatNumber(minPrice)} – {currencySymbol}{formatNumber(maxPrice)}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {tier.timeline}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Add-ons Selector */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-500">
              2. Optional Custom Add-ons &amp; Accelerators
            </h2>
            <div className="space-y-2">
              {addons.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id)
                const price = currency === 'INR' ? addon.priceINR : addon.priceUSD

                return (
                  <label
                    key={addon.id}
                    className={`flex items-start justify-between gap-4 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'border-indigo-500 bg-indigo-50/40 text-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAddon(addon.id)}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <div>
                        <div className="font-semibold text-xs sm:text-sm text-slate-900">
                          {addon.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {addon.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-700 whitespace-nowrap">
                      +{currencySymbol}{formatNumber(price)}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Discount Slider */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-amber-500" />
                <span>Negotiation Discount / Strategic Buffer:</span>
              </span>
              <span className="font-mono text-indigo-600 font-bold">{customDiscountPercent}% OFF</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="5"
              value={customDiscountPercent}
              onChange={(e) => setCustomDiscountPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Standard)</span>
              <span>10% (Founder Special)</span>
              <span>20% (Partner)</span>
              <span>30% (Max Floor)</span>
            </div>
          </div>
        </div>

        {/* Right: Live Quote Calculator & Proposal Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 space-y-4">
            
            {/* Live Calculation Summary Card */}
            <div className="rounded-3xl p-6 bg-slate-900 text-white shadow-xl space-y-6 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
                    {activeTier.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {activeTier.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-medium block">Delivery</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {activeTier.timeline}
                  </span>
                </div>
              </div>

              {/* Price Breakdown Display */}
              <div className="space-y-1 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                <span className="text-xs font-medium text-slate-400">Total Client Quote Range:</span>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-2">
                  <span>{currencySymbol}{formatNumber(totalMin)} – {currencySymbol}{formatNumber(totalMax)}</span>
                  <span className="text-xs font-mono font-bold text-indigo-400">{currency}</span>
                </div>
                <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
                  <span>Suggested Target:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {currencySymbol}{formatNumber(totalMid)} {currency}
                  </span>
                </div>
                {customDiscountPercent > 0 && (
                  <div className="text-[11px] text-amber-400 flex items-center gap-1 pt-1 font-medium">
                    <TrendingDown className="w-3 h-3" />
                    <span>Includes {customDiscountPercent}% negotiation discount</span>
                  </div>
                )}
              </div>

              {/* Client Name Input for Proposal */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Client / Lead Name (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Health Corp / Alex"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Copy Proposal Button */}
              <button
                type="button"
                onClick={handleCopyProposal}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Proposal Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Formatted Proposal (Markdown / WhatsApp)</span>
                  </>
                )}
              </button>

              {/* Milestone Breakdown */}
              <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
                <div className="text-slate-400 font-medium">Standard 50/50 Payment Schedule:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-800/60 p-2 rounded-lg">
                    <div className="text-slate-400">Milestone 1 (50%)</div>
                    <div className="font-bold text-white mt-0.5">
                      {currencySymbol}{formatNumber(Math.round(totalMid * 0.5))}
                    </div>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded-lg">
                    <div className="text-slate-400">Milestone 2 (50%)</div>
                    <div className="font-bold text-white mt-0.5">
                      {currencySymbol}{formatNumber(Math.round(totalMid * 0.5))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy Tip Box */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5 text-xs">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-700" />
                <span>Sales Closing Strategy</span>
              </div>
              <p className="leading-relaxed text-amber-800 text-[11px]">
                Quote the suggested target price first. If the client has budget hesitation, offer to remove non-essential add-ons or use the 10%–15% founder discount rather than reducing engineering scope.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Comprehensive Rate Matrix Table */}
      <div className="pt-8 border-t border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Standard Rate Cards Reference Matrix</h2>
            <p className="text-xs text-slate-500">Quick cheat-sheet for sales calls and client meetings.</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Service Package</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Timeline</th>
                <th className="py-3.5 px-4 font-semibold">INR Range (₹)</th>
                <th className="py-3.5 px-4 font-semibold">USD Range ($)</th>
                <th className="py-3.5 px-4 font-semibold">Best Suited For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tiers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {t.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] border border-slate-200">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                    {t.timeline}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    ₹{t.minINR.toLocaleString('en-IN')} – ₹{t.maxINR.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                    ${t.minUSD.toLocaleString('en-US')} – ${t.maxUSD.toLocaleString('en-US')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                    {t.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
