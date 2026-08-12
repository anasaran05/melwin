'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export function AgencyContact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    plan: 'Gold: Complete Production (₹90,000 / mo)',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'agency_lead',
          ...formData,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        toast.success('Agency inquiry submitted! Our team will reach out within 24 hours.')
      } else {
        toast.error('Failed to submit inquiry. Please try again.')
      }
    } catch {
      toast.error('Something went wrong. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="agency-contact" className="py-16 md:py-24 px-6 md:px-16 w-full text-[#111111] scroll-mt-24">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl p-8 md:p-14 border border-black/10 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-[#f95738] text-xs font-mono font-bold uppercase tracking-wider block mb-2">
              // AGENCY LEADS & INQUIRIES
            </span>
            <h2 className="text-3xl max-md:text-2xl md:text-5xl font-black tracking-tight text-[#111111] mb-3">
              Start Your Agency Retainer
            </h2>
            <p className="text-[#666666] text-sm md:text-base">
              Ready to build your personal brand or discuss a custom production scope? Send your details below for direct response from our strategy team.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#f95738] focus:bg-white transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#f95738] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    Phone / Mobile *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#f95738] focus:bg-white transition-all"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                    Company / Brand Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Acme Ventures"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#f95738] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Plan Choice Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                  Interested Retainer Tier *
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-[#111111] focus:outline-none focus:border-[#f95738] focus:bg-white transition-all"
                >
                  <option value="Silver: The Content Engine (₹60,000 / mo)">
                    Silver: The Content Engine (₹60,000 / mo)
                  </option>
                  <option value="Gold: Complete Production (₹90,000 / mo)">
                    Gold: Complete Production (₹90,000 / mo) [Most Popular]
                  </option>
                  <option value="Diamond: Executive Revenue (₹1,59,000 / mo)">
                    Diamond: Executive Revenue (₹1,59,000 / mo)
                  </option>
                  <option value="Custom Enterprise Retainer Scope">
                    Custom Enterprise Retainer Scope
                  </option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                  Project Notes / Channel Goals (Optional)
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about your current video footprint, goals, or shoot location..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#f95738] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#111111] hover:bg-black text-white font-semibold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 text-sm tracking-wide"
                >
                  {isSubmitting ? (
                    <span>Submitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#f95738]" />
                      <span>Submit Agency Lead Inquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#111111] mb-2">Agency Lead Submitted!</h3>
              <p className="text-[#666666] text-sm max-w-md mb-6">
                Thank you for reaching out regarding <strong className="text-[#111111]">{formData.plan}</strong>. Our team has received your submission and sent notifications to Discord and Telegram. We will contact you within 24 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-[#111111] text-white font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-black transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
