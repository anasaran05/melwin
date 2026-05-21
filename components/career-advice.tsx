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
    background: '',
    message: '',
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
    if (!formData.background) {
      toast.error('Please select your background')
      return false
    }
    if (!formData.message.trim()) {
      toast.error('Please share your situation or question')
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
        background: '',
        message: '',
      })
    } catch (error) {
      toast.error('Error submitting request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="career" className="py-20 max-md:py-16 md:py-32 px-4 md:px-8 bg-white border-t border-zinc-200">
      <div className="max-w-6xl mx-auto">
        <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mb-12">// Career</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left: Copy */}
          <div className="space-y-6">
            <h2 className="font-sans text-4xl max-md:text-3xl font-bold text-zinc-900">Career Repositioning for Technical Builders.</h2>
            <p className="text-zinc-600 leading-relaxed">
              If you&apos;re in healthcare or engineering and feeling stuck—whether it&apos;s a salary plateau, role mismatch, or lack of growth
              trajectory—let&apos;s talk strategy. I help high-performers find roles and paths that align with their technical depth and ambitions.
            </p>
            <div className="pt-6 space-y-3">
              <p className="font-sans font-medium text-sm text-zinc-900 uppercase tracking-wide">Common challenges:</p>
              <ul className="text-sm text-zinc-600 space-y-2">
                <li>• Feeling undervalued in current role</li>
                <li>• Uncertain about next career move</li>
                <li>• Want to scale impact globally</li>
                <li>• Exploring startup vs. corporate trade-offs</li>
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
