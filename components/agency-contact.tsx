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
    plan: '1-Month Trial Pass (₹29,990 / one-time)',
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
        toast.success('Trial inquiry submitted! Our team will reach out within 24 hours.')
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
    <section id="agency-contact" className="py-12 md:py-24 px-4 sm:px-6 md:px-16 w-full text-[#111111] scroll-mt-24">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl p-5 sm:p-8 md:p-14 border border-black/10 shadow-2xl relative overflow-hidden"
        >
          {/* Top Right Offer Badge */}
          <div className="absolute top-3 right-3 sm:top-5 sm:right-5 md:top-8 md:right-8 z-20 pointer-events-none">
            <img
              src="https://img.icons8.com/external-sbts2018-flat-sbts2018/468/external-offer-diwali-sbts2018-flat-sbts2018.png"
              alt="Special Offer"
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 drop-shadow-md hover:scale-105 transition-transform"
            />
          </div>

          {/* Header */}
          <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white border border-black/10 text-[#666666] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
              <span>1-MONTH TRIAL OFFER · ₹29,990</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-[#111111]">
              Start Your Trial at <span className="text-[#888888]">₹29,990</span>
            </h2>
            <p className="text-[#666666] text-xs sm:text-sm md:text-base">
              Test our full-service founder production with an initial 1-month trial before committing to a long-term monthly retainer.
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
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
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
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
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
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
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
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111] focus:bg-white transition-all"
                  />
                </div>
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
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#111111] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#111111] hover:bg-black text-white font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/10 disabled:opacity-50 text-sm tracking-wide"
                >
                  {isSubmitting ? (
                    <span>Submitting Trial Request...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>Start Your Trial at ₹29,990</span>
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
              <h3 className="text-2xl font-bold text-[#111111] mb-2">Trial Request Received!</h3>
              <p className="text-[#666666] text-sm max-w-md mb-6">
                Thank you for choosing <strong className="text-[#111111]">{formData.plan}</strong>. Our strategy team has received your submission and sent notifications to Discord & Telegram. We will reach out within 24 business hours with your onboarding survey.
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
