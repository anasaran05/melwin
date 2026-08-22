'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Send, Loader2, Sparkles } from 'lucide-react'

export function AtomSeInquiryFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'SaaS & Custom Web Application',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'atom_se',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
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
      setErrorMessage('Something went wrong. Please check your connection and try again.')
    }
  }

  return (
    <section id="project-form" className="py-12 md:py-24 px-4 sm:px-6 md:px-12 w-full scroll-mt-24">
      <div className="max-w-4xl mx-auto bg-[#111111] text-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden">
        {formStatus === 'success' ? (
          <div className="text-center py-12 space-y-5">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Project Inquiry Received!
            </h2>
            <p className="text-neutral-300 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Thank you for reaching out. Dr. Melwin and the Atom SE engineering team will review your requirements and get in touch with you within 24 hours.
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
                    service: 'SaaS & Custom Web Application',
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
            {/* Form Heading */}
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                LET'S WORK TOGETHER
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Start Your Project with Atom SE
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto leading-relaxed pt-1">
                Tell us what you need in simple words. We will get back to you with clear steps, timeline, and a direct quote.
              </p>
            </div>

            {/* Inquiry Form */}
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-medium text-neutral-300">
                    Your Full Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-medium text-neutral-300">
                    Email Address <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-medium text-neutral-300">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* Business / Company Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-medium text-neutral-300">
                    Company / Brand Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Studio"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-medium text-neutral-300">
                  What are you looking to build?
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="SaaS & Custom Web Application">SaaS & Custom Web Application</option>
                  <option value="AI Solutions & Intelligent Workflows">AI Solutions & Intelligent Workflows (LLMs/Agents)</option>
                  <option value="Automation & Business Systems">Automation & Background Pipelines</option>
                  <option value="Internal Tools & Admin Portals">Internal Tools, ERP & Admin Portals</option>
                  <option value="Modern Website & SEO Flagship">Modern High-Converting Website & SEO</option>
                  <option value="API Integrations & Payment Architecture">API Integrations & Payment Architecture</option>
                  <option value="Full End-to-End Product Build">Complete End-to-End Product Suite (Turnkey)</option>
                </select>
              </div>

              {/* Message / Project Notes */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-medium text-neutral-300">
                  Briefly describe your product, workflow, or goal <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what you want to build, current tech stack if any, key features, or operational bottlenecks you want to automate..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              {/* Error Message Display */}
              {formStatus === 'error' && (
                <p className="text-xs text-rose-400 text-left">
                  {errorMessage}
                </p>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black px-8 py-3.5 rounded-full font-bold text-sm transition-all disabled:opacity-50"
                >
                  {formStatus === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Project Inquiry</span>
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
  )
}
