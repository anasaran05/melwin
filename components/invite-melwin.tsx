'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function InviteMelwin() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    institution_event: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter the name of the responsible person')
      return false
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return false
    }
    if (!formData.mobile_number.trim()) {
      toast.error('Please enter a mobile number')
      return false
    }
    if (!formData.institution_event.trim()) {
      toast.error('Please enter the institution or event name')
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
          type: 'invite_melwin',
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to submit inquiry')
        return
      }

      toast.success(`Thanks ${formData.name}, inquiry submitted! I'll reach out within 48 hours.`)
      setFormData({
        name: '',
        email: '',
        mobile_number: '',
        institution_event: '',
        message: '',
      })
    } catch (error) {
      toast.error('Error submitting inquiry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="invite-content" className="py-20 max-md:py-16 md:py-32 px-4 md:px-8 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto">
        <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mb-12">// Invite to Event</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left: Copy */}
          <div className="space-y-6">
            <h2 className="font-sans text-4xl max-md:text-3xl font-bold text-zinc-900">Invite Melwin</h2>
            <p className="font-sans font-medium text-sm text-zinc-900 uppercase tracking-wide">
              Keynotes • Guest Lectures • Panel Discussions • Conferences
            </p>
            <div className="space-y-4 text-zinc-600 leading-relaxed">
              <p>
                Invite Dr. Melwin Vincent to speak at your institution, conference, or private event. 
              </p>
              <p>
                Melwin frequently shares insights on technology, career development, entrepreneurship, and building scalable systems, offering actionable advice to students, professionals, and founders alike.
              </p>
            </div>
            
            <div className="pt-6 space-y-3">
              <p className="font-sans font-medium text-sm text-zinc-900 uppercase tracking-wide">Speaking topics often include:</p>
              <ul className="text-sm text-zinc-600 space-y-2">
                <li>• Navigating modern career paths & upskilling</li>
                <li>• Building startups & scaling products</li>
                <li>• The intersection of technology and healthcare</li>
                <li>• Practical leadership & community building</li>
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Name *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:ring-black focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Email *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Mobile Number *</label>
                  <Input
                    name="mobile_number"
                    type="tel"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    placeholder="Your mobile number"
                    className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Organization/institution *</label>
                <Input
                  name="institution_event"
                  value={formData.institution_event}
                  onChange={handleChange}
                  placeholder="Name of your college, company or event"
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Tell us about the event</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Briefly describe the event format and what you expect from the session..."
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl min-h-[100px] focus:ring-black focus:border-black"
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
                  'Submit Invitation'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
