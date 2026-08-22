'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import {
  FileText,
  ShieldCheck,
  Building2,
  Calculator,
  Scale,
  Users,
  CheckCircle2,
  ArrowRight,
  Send,
  Loader2,
  BookOpen,
  DollarSign,
  HelpCircle
} from 'lucide-react'

const serviceCategories = [
  {
    icon: Building2,
    title: 'Company Registration & Incorporation',
    tag: 'START RIGHT',
    description: 'We help you legally register your company as a Private Limited (Pvt Ltd), LLP, or OPC with zero confusion and fast approval.',
    points: ['Name approval & certificate of incorporation', 'Director DIN & Digital Signature (DSC)', 'PAN, TAN & Bank account support'],
  },
  {
    icon: FileText,
    title: 'GST Registration & Monthly Filings',
    tag: 'ZERO PENALTIES',
    description: 'Get your GST number quickly and let our chartered accountants handle your monthly and quarterly GST returns on time.',
    points: ['New GST number registration', 'GSTR-1, GSTR-3B monthly filings', 'Input tax credit (ITC) reconciliation'],
  },
  {
    icon: Calculator,
    title: 'Accounting & Bookkeeping',
    tag: 'CLEAN BOOKS',
    description: 'Never worry about messy bills. We record all your sales, expenses, and invoices using standard software like Zoho Books and Tally.',
    points: ['Monthly profit & loss statement', 'Expense tracking & invoice management', 'Bank statement reconciliation'],
  },
  {
    icon: Scale,
    title: 'Legal Contracts & Founder Agreements',
    tag: 'LEGAL SAFETY',
    description: 'Custom, airtight legal agreements drafted by experienced startup lawyers to protect your equity, IP, and team relationships.',
    points: ['Co-founder agreements & vesting', 'Client service contracts & NDAs', 'Employment & ESOP agreement drafting'],
  },
  {
    icon: ShieldCheck,
    title: 'Trademarks, IP & Copyrights',
    tag: 'PROTECT YOUR BRAND',
    description: 'Protect your brand name, logo, software code, and inventions so nobody else can copy your hard work.',
    points: ['Trademark search & filing', 'Copyright & patent guidance', 'Notice handling & legal response'],
  },
  {
    icon: Users,
    title: 'Payroll, PF & ESIC Compliance',
    tag: 'HAPPY TEAM',
    description: 'Automate salary payouts, payslip generation, and mandatory government employee benefits without legal headache.',
    points: ['Monthly salary slips calculation', 'PF & ESIC monthly returns', 'Professional tax & TDS on salary'],
  },
]

const complianceChecklist = [
  { step: '01', title: 'Register Company', desc: 'Pvt Ltd / LLP incorporation with PAN, TAN & Bank opening.' },
  { step: '02', title: 'GST & MSME', desc: 'Official tax registration + MSME certificate for government perks.' },
  { step: '03', title: 'Trademark Logo', desc: 'Secure brand ownership across India before spending on ads.' },
  { step: '04', title: 'Monthly CA Filings', desc: 'Timely GST, TDS, accounting, and annual audit without fines.' },
]

export default function BusinessServicesPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'Company Incorporation (Pvt Ltd / LLP)',
    city: '',
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
          type: 'business_services',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          city: formData.city,
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
              <FileText className="w-3.5 h-3.5 text-black" />
              <span>TRUSTED CHARTERED ACCOUNTANTS & LEGAL PARTNERS</span>
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#111111] max-w-4xl mx-auto leading-[1.05]"
          >
            Business Services 🧾 <br />
            <span className="text-[#777777]">GST, CA, Legal & Taxes Made Simple.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-[#555555] max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Don't get stuck in complicated paperwork. We connect you with top-tier, trustworthy Chartered Accountants and startup lawyers who take care of company registration, GST, bookkeeping, and legal contracts.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <a
              href="#service-form"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-black text-white px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Talk to a Verified CA / Lawyer</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-[#111111] border border-black/10 px-7 py-3.5 sm:py-4 rounded-full font-semibold text-sm transition-colors shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>View All Services</span>
            </a>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 text-left">
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">100%</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Verified CA Network</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Transparent</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">No Hidden Charges</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Fast</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Fast-track Registrations</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-black/10 shadow-xs">
              <span className="text-2xl sm:text-3xl font-black text-[#111111] block">Stress-Free</span>
              <span className="text-xs font-medium text-neutral-500 font-mono">Zero Notice Headaches</span>
            </div>
          </div>

        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-12 md:py-24 px-4 sm:px-6 md:px-12 w-full border-t border-black/[0.04]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
              COMPREHENSIVE CATALOGUE
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight">
              Everything required to run legally
            </h2>
            <p className="text-sm sm:text-base text-[#666666] max-w-xl mx-auto">
              Straightforward pricing, prompt reminders, and friendly chartered accountants who explain things in plain words.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCategories.map((item) => {
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
                      {item.description}
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

      {/* 4-Step Checklist */}
      <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 w-full border-t border-black/[0.04]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
              STARTUP ROADMAP
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] tracking-tight">
              Essential 4-Step Legal Setup
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {complianceChecklist.map((step) => (
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

      {/* Service Request Form */}
      <section id="service-form" className="py-12 md:py-24 px-4 sm:px-6 md:px-12 w-full scroll-mt-20">
        <div className="max-w-4xl mx-auto bg-[#111111] text-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden">
          
          {formStatus === 'success' ? (
            <div className="text-center py-12 space-y-5">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Request Received!
              </h2>
              <p className="text-neutral-300 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                Thank you for reaching out. A dedicated partner CA or legal associate from Dr. Melwin's trusted network will connect with you via phone or WhatsApp within 24 hours.
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
                      company: '',
                      service: 'Company Incorporation (Pvt Ltd / LLP)',
                      city: '',
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
                  CONNECT WITH TRUSTED PROFESSIONALS
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                  Get Clear Advice & Direct Quote
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed pt-1">
                  Tell us what you need help with. We'll assign a certified CA or legal advisor to guide you through every step.
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
                      placeholder="e.g. Karthik Nathan"
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
                      placeholder="e.g. karthik@business.com"
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
                      Business / Startup Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nathan Agro Tech"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      Service Required
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Company Incorporation (Pvt Ltd / LLP)">Company Incorporation (Pvt Ltd / LLP)</option>
                      <option value="GST Registration & Monthly Filings">GST Registration & Monthly Filings</option>
                      <option value="Monthly Accounting & Bookkeeping">Monthly Accounting & Bookkeeping</option>
                      <option value="Legal Contracts & Founder Agreements">Legal Contracts & Founder Agreements</option>
                      <option value="Trademark & Brand Protection">Trademark & Brand Protection</option>
                      <option value="Payroll, PF & ESIC Setup">Payroll, PF & ESIC Setup</option>
                      <option value="Complete Annual Compliance Package">Complete Annual Compliance Package</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-medium text-neutral-300">
                      City / Location <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chennai, Coimbatore, Madurai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-medium text-neutral-300">
                    Briefly describe your requirement or current stage <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what you need help with, any specific questions, or how soon you want to get started..."
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
                        <span>Connect with CA / Legal Partner</span>
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
