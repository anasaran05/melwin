'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  Globe2,
  Ship,
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Send,
  Loader2,
  Building,
  Plane,
  PackageCheck,
  Coins,
  Search
} from 'lucide-react'

// 6 Core Export & Import Pillars
const tradeServices = [
  {
    icon: FileCheck2,
    title: 'IEC Code & Export Documentation',
    tag: 'LICENSING & DGFT',
    desc: 'Get your Import Export Code (IEC), RCMC registration with export councils, and mandatory certifications without legal confusion.',
    points: ['DGFT IEC registration & renewal', 'Export Promotion Council (RCMC)', 'AD Code registration with bank & customs port'],
  },
  {
    icon: Search,
    title: 'International Buyer Discovery',
    tag: 'GLOBAL SALES',
    desc: 'Find verified foreign buyers and distributors for your products across Middle East (UAE/Saudi), USA, Europe, and Southeast Asia.',
    points: ['Verified B2B buyer matchmaking', 'International trade fair advisory', 'Export product packaging & pricing strategy'],
  },
  {
    icon: Ship,
    title: 'Sea & Air Freight Logistics',
    tag: 'GLOBAL SHIPPING',
    desc: 'Reliable freight forwarding and shipping partners to move your cargo safely via sea container (FCL/LCL) or air express.',
    points: ['Ocean & air freight bookings', 'Door-to-port and port-to-door delivery', 'Cargo marine insurance coverage'],
  },
  {
    icon: ShieldCheck,
    title: 'Customs Clearance & Port Support',
    tag: 'SMOOTH CLEARANCE',
    desc: 'Hassle-free customs clearance at major Indian ports (Chennai Port, Tuticorin, Ennore, Nhava Sheva) and international airports.',
    points: ['Customs bill of entry & shipping bill', 'HS Code classification & duty check', 'Fast port gate-in & clearance inspection'],
  },
  {
    icon: Coins,
    title: 'Letter of Credit (LC) & Trade Finance',
    tag: 'ZERO PAYMENT RISK',
    desc: 'Structure safe payment terms with overseas buyers using Letters of Credit, escrow accounts, and export credit guarantees (ECGC).',
    points: ['LC review & safe payment terms', 'ECGC credit risk insurance setup', 'Export invoice factoring & working capital'],
  },
  {
    icon: PackageCheck,
    title: 'Quality Inspection & Lab Testing',
    tag: 'INTERNATIONAL STANDARDS',
    desc: 'Ensure your products meet stringent export standards such as US FDA, CE marking, FSSAI, APEDA, and lab test certificates.',
    points: ['Lab test reports & phytosanitary certs', 'Pre-shipment batch inspection', 'Global labeling & barcode compliance'],
  },
]

const exportRoadmap = [
  { step: '01', title: 'Get IEC & Port Registration', desc: 'DGFT Import Export Code + Bank AD Code linkage.' },
  { step: '02', title: 'Product & Pricing Selection', desc: 'HS Code classification, export costing & sample dispatch.' },
  { step: '03', title: 'Safe Payment & Contract', desc: 'Advance wire transfer or Letter of Credit (LC) confirmation.' },
  { step: '04', title: 'Customs & Global Shipping', desc: 'Port clearance, bill of lading generation & safe delivery.' },
]

export default function ExportImportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    operation_type: 'Export from India',
    product: 'Agricultural / Spices / Food Products',
    country: '',
    iec_status: 'Already have IEC Code',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'export_import',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          operation_type: formData.operation_type,
          product: formData.product,
          country: formData.country,
          iec_status: formData.iec_status,
          message: formData.message,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFormStatus('success')
      } else {
        setFormStatus('error')
        setErrorMessage(data.error || 'Failed to submit. Please try again.')
      }
    } catch {
      setFormStatus('error')
      setErrorMessage('Network error. Please try again.')
    }
  }

  return (
    <main className="font-sans min-h-screen relative overflow-x-hidden bg-[#f2f2f2] text-[#111111]">
      <div className="grain-overlay" />
      <Navbar />

      {/* Hero Header */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 md:px-12 w-full relative">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/10 text-[#111111] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
              <Ship className="w-3.5 h-3.5 text-black" />
              <span>GLOBAL TRADE, FREIGHT & CUSTOMS DESK</span>
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.05]"
          >
            Export & Import 🚢 <br />
            <span className="text-[#777777]">Take your products to the global market.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-[#555555] max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Whether you want to export goods from Tamil Nadu to international buyers or import raw materials smoothly — we help with IEC codes, customs clearance, shipping logistics, and buyer connections.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <a
              href="#trade-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Export / Import Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm transition-colors shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Trade Capabilities</span>
            </a>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Global</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">UAE, US, EU & SEA</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Port Ready</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Chennai & Tuticorin</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Safe</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">LC & Escrow Guidance</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Simple</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Zero Customs Stress</span>
            </div>
          </div>

        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-12 md:py-24 px-4 sm:px-6 md:px-12 w-full border-t border-black/[0.04]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
              END-TO-END TRADE INFRASTRUCTURE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight">
              Everything to move goods across borders
            </h2>
            <p className="text-sm sm:text-base text-[#666666] max-w-xl mx-auto">
              From the initial IEC application to receiving foreign currency directly into your Indian bank account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradeServices.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-2xl bg-neutral-100 flex items-center justify-center text-[#111111]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#111111]">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[#555555] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 space-y-2">
                    {item.points.map((pt) => (
                      <div key={pt} className="flex items-center gap-2 text-xs text-[#444444]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4-Step Export Roadmap */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 w-full border-t border-black/[0.04]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight">
              4-Step Journey to Global Trade
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {exportRoadmap.map((step) => (
              <div 
                key={step.step}
                className="bg-white rounded-3xl p-6 border border-black/10 shadow-md space-y-3"
              >
                <span className="text-3xl font-black text-[#888888] font-mono block">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-[#111111]">{step.title}</h3>
                <p className="text-xs text-[#555555] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trade Consultation Form */}
      <section id="trade-form" className="py-12 md:py-24 px-4 sm:px-6 md:px-12 w-full scroll-mt-20">
        <div className="max-w-4xl mx-auto bg-[#111111] text-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden">
          
          {formStatus === 'success' ? (
            <div className="text-center py-12 space-y-5">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Trade Inquiry Received!
              </h2>
              <p className="text-neutral-300 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                Thank you for reaching out. An export/import trade associate from Dr. Melwin's partner desk will review your product details and contact you within 24 hours.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormStatus('idle')
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      operation_type: 'Export from India',
                      product: 'Agricultural / Spices / Food Products',
                      country: '',
                      iec_status: 'Already have IEC Code',
                      message: '',
                    })
                  }}
                  className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-neutral-200 transition-colors"
                >
                  Send Another Inquiry
                </button>
                <Link
                  href="/"
                  className="bg-neutral-900 text-white border border-white/20 px-6 py-3 rounded-full font-medium text-sm hover:bg-neutral-800 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                  EXPAND ACROSS BORDERS
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                  Start Your Export / Import Consultation
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed pt-1">
                  Tell us what products you want to export or import. We'll connect you with the right trade specialists and customs partners.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Your Full Name <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senthil Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Email Address <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. senthil@exportco.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Phone / WhatsApp Number <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Trade Operation
                    </label>
                    <select
                      value={formData.operation_type}
                      onChange={(e) => setFormData({ ...formData, operation_type: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Export from India">Export from India (Sell Globally)</option>
                      <option value="Import into India">Import into India (Source Materials)</option>
                      <option value="Both Export & Import">Both Export & Import Support</option>
                      <option value="Only IEC Code & Port Registration">Only IEC Code & Port Registration</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Product Category
                    </label>
                    <select
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Agricultural / Spices / Food Products">Agricultural, Spices & Food Products</option>
                      <option value="Apparel, Garments & Textiles">Apparel, Garments & Textiles</option>
                      <option value="Pharmaceuticals, Herbs & Medical">Pharmaceuticals, Herbs & Medical</option>
                      <option value="Engineering Goods & Machinery">Engineering Goods & Machinery</option>
                      <option value="Handicrafts, Coir & Natural Goods">Handicrafts, Coir & Natural Goods</option>
                      <option value="Electronics & Software Services">Electronics & Software Services</option>
                      <option value="Other Manufactured Items">Other Manufactured Items</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Target Destination / Source Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dubai (UAE), USA, UK, Singapore"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-medium text-neutral-300">
                    IEC Code Status
                  </label>
                  <select
                    value={formData.iec_status}
                    onChange={(e) => setFormData({ ...formData, iec_status: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  >
                    <option value="Already have IEC Code">Already have valid IEC Code</option>
                    <option value="Need new IEC Code registration">Need new IEC Code registration</option>
                    <option value="Need IEC modification / AD Code port update">Need IEC modification / AD Code port update</option>
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-medium text-neutral-300">
                    Briefly describe your trade requirements or questions <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what product you have, quantity/volume, whether you already have a buyer, or what specific help you need..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                {formStatus === 'error' && (
                  <p className="text-xs text-rose-400 text-left">
                    {errorMessage}
                  </p>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black px-8 py-3.5 rounded-full font-bold text-sm transition-all disabled:opacity-50"
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Trade Consultation</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <Link
                    href="/"
                    className="text-xs text-neutral-400 hover:text-white transition-colors"
                  >
                    &larr; Back to Dr. Melwin's Home
                  </Link>
                </div>
              </form>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}
