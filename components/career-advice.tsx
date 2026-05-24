'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function CareerAdvice() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    background: '',
    message: '',
    city: '',
    state: '',
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
      background: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter your name')
      return false
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Please enter a valid email')
      return false
    }
    if (!formData.mobile_number.trim()) {
      toast.error('Please enter your mobile number')
      return false
    }
    if (!formData.background) {
      toast.error('Please select your background')
      return false
    }
    if (!formData.message.trim()) {
      toast.error('Please share your situation or question')
      return false
    }
    if (!formData.city.trim()) {
      toast.error('Please enter your city')
      return false
    }
    if (!formData.state.trim()) {
      toast.error('Please enter your state')
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
          type: 'career_advice',
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to submit')
        return
      }

      toast.success(`Thanks ${formData.name}! I'll review and reach out with initial thoughts.`)
      setFormData({
        name: '',
        email: '',
        mobile_number: '',
        background: '',
        message: '',
        city: '',
        state: '',
      })
    } catch (error) {
      toast.error('Error submitting request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="career-content" className="py-20 max-md:py-16 md:py-32 px-4 md:px-8 bg-white border-t border-zinc-200">
      <div className="max-w-6xl mx-auto">
        <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mb-12">// Career</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left: Copy */}
          <div className="space-y-6">
            <h2 className="font-sans text-4xl max-md:text-3xl font-bold text-zinc-900">Career Guidance</h2>
            <p className="font-sans font-medium text-sm text-zinc-900 uppercase tracking-wide">
              School • College • Careers • Higher Studies
            </p>
            <p className="text-zinc-600 leading-relaxed">
              Helping students and professionals make confident academic and career decisions through practical guidance, strategic planning, and long-term positioning.
            </p>
            <div className="pt-6 space-y-3">
              <p className="font-sans font-medium text-sm text-zinc-900 uppercase tracking-wide">Areas of support include:</p>
              <ul className="text-sm text-zinc-600 space-y-2">
                <li>• School to college planning</li>
                <li>• College admissions and career direction</li>
                <li>• College to job transition strategy</li>
                <li>• Master&apos;s planning in India or abroad</li>
                <li>• Career switching and repositioning</li>
                <li>• Resume, LinkedIn, and profile building</li>
                <li>• Skill roadmap and industry alignment</li>
                <li>• Higher studies, placements, and growth planning</li>
                <li>• Startup, corporate, and global career pathways</li>
              </ul>
            </div>
            <div className="pt-4">
              <p className="text-zinc-600 leading-relaxed font-medium">
                Whether you&apos;re choosing your next course, planning your career trajectory, preparing for placements, or exploring higher studies, the goal is simple: help you avoid confusion, make smarter decisions, and move with clarity.
              </p>
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
                  placeholder="Your name"
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:ring-black focus:border-black"
                />
              </div>

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

              <div>
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Background *</label>
                <Select value={formData.background} onValueChange={handleSelectChange}>
                  <SelectTrigger className="bg-white border-zinc-300 text-zinc-900 rounded-xl focus:ring-black focus:border-black">
                    <SelectValue placeholder="Select your background" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-zinc-300">
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="sciences">Sciences</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Your Situation *</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="What&apos;s your current situation? Where do you want to go?"
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl min-h-[120px] focus:ring-black focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">City *</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">State *</label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:ring-black focus:border-black"
                  />
                </div>
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
                  'Start the Conversation'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
