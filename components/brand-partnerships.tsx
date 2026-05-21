'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function BrandPartnerships() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    company_name: '',
    platform_url: '',
    budget_tier: '',
    objective: '',
    contact_email: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      budget_tier: value,
    }))
  }

  const validateForm = () => {
    if (!formData.company_name.trim()) {
      toast.error('Please enter your company name')
      return false
    }
    if (!formData.platform_url.trim()) {
      toast.error('Please enter your platform URL')
      return false
    }
    if (!formData.budget_tier) {
      toast.error('Please select a budget tier')
      return false
    }
    if (!formData.objective.trim()) {
      toast.error('Please describe your objective')
      return false
    }
    if (!formData.contact_email.trim() || !formData.contact_email.includes('@')) {
      toast.error('Please enter a valid email')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch('/api/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'brand_collab',
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to submit inquiry')
        return
      }

      toast.success(`Thanks ${formData.company_name}, inquiry submitted! I'll reach out within 48 hours.`)
      setFormData({
        company_name: '',
        platform_url: '',
        budget_tier: '',
        objective: '',
        contact_email: '',
      })
    } catch (error) {
      toast.error('Error submitting inquiry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="partnerships" className="py-20 max-md:py-16 md:py-32 px-4 md:px-8 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto">
        <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mb-12">// Partnerships</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left: Copy */}
          <div className="space-y-6">
            <h2 className="font-sans text-4xl max-md:text-3xl font-bold text-zinc-900">Infrastructure Partnerships Only.</h2>
            <p className="text-zinc-600 leading-relaxed">
              I partner with companies that share a commitment to execution speed, global reach, and measurable impact. We&apos;re
              looking for mutual growth—infrastructure plays that open doors for both sides.
            </p>
            <div className="pt-6 space-y-3">
              <p className="font-sans font-medium text-sm text-zinc-900 uppercase tracking-wide">Ideal fit criteria:</p>
              <ul className="text-sm text-zinc-600 space-y-2">
                <li>• Expanding into new markets or verticals</li>
                <li>• Building GTM infrastructure at scale</li>
                <li>• Seeking strategic advisor relationships</li>
                <li>• Product-market fit with distribution challenges</li>
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Company Name *</label>
                <Input
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Your company name"
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Platform URL *</label>
                <Input
                  name="platform_url"
                  value={formData.platform_url}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Budget Tier *</label>
                <Select value={formData.budget_tier} onValueChange={handleSelectChange}>
                  <SelectTrigger className="bg-white border-zinc-300 text-zinc-900 rounded-xl focus:ring-black focus:border-black">
                    <SelectValue placeholder="Select budget tier" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-zinc-300">
                    <SelectItem value="25k-50k">₹25k–₹50k</SelectItem>
                    <SelectItem value="50k-1lakh">₹50k–₹1L</SelectItem>
                    <SelectItem value="1lakh-plus">₹1L+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Objective *</label>
                <Textarea
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  placeholder="What are you looking to achieve through this partnership?"
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl min-h-[100px] focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Contact Email *</label>
                <Input
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="your@company.com"
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:ring-black focus:border-black"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-zinc-800 text-white font-medium py-6 rounded-full shadow-lg transition-all hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Inquiry'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
