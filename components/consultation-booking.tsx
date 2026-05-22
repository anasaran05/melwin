'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, BadgeCheck } from 'lucide-react'
import { toast } from 'sonner'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import Image from 'next/image'

export function ConsultationBooking() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    slot_preference: '',
    intake_notes: '',
    consultation_type: 'consult_melwin',
  })

  useEffect(() => {
    const handleOpenConsultation = (e: CustomEvent<string>) => {
      setFormData(prev => ({...prev, consultation_type: e.detail}))
    }
    window.addEventListener('openConsultation', handleOpenConsultation as EventListener)
    return () => window.removeEventListener('openConsultation', handleOpenConsultation as EventListener)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number')
      return false
    }
    if (!formData.slot_preference.trim()) {
      toast.error('Please select a preferred date')
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
          type: 'consultation_booking',
          ...formData
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to submit booking request')
        return
      }

      toast.success(`Thanks ${formData.name}, your request is received! We will contact you to collect payment and confirm the slot.`)
      setFormData({
        name: '',
        email: '',
        phone: '',
        slot_preference: '',
        intake_notes: '',
        consultation_type: 'consult_melwin',
      })
    } catch (error) {
      toast.error('Error submitting booking request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="consultation-content" className="scroll-mt-32 py-20 max-md:py-16 md:py-32 px-4 md:px-8 bg-white border-t border-zinc-200">
      <div className="max-w-6xl mx-auto">
        <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mb-12">// Booking</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Left: Pricing / Type Selection */}
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Select Consultation Type</h3>
              <p className="text-zinc-500">Choose the level of guidance that best fits your current needs.</p>
            </div>
            
            <Accordion 
              type="single" 
              value={formData.consultation_type} 
              onValueChange={(val) => val && setFormData(prev => ({...prev, consultation_type: val}))} 
              className="space-y-4"
            >
              <AccordionItem value="general" className="border border-zinc-200 bg-white rounded-2xl px-6 shadow-sm data-[state=open]:border-black data-[state=open]:ring-1 data-[state=open]:ring-black transition-all">
                <AccordionTrigger className="hover:no-underline py-6">
                   <div className="flex flex-col text-left">
                     <span className="font-sans text-lg font-bold text-zinc-900">General Consultation</span>
                     <span className="text-sm text-zinc-500 font-normal mt-1">Foundational session for basic queries</span>
                   </div>
                </AccordionTrigger>
                <AccordionContent className="text-zinc-600 pb-6 leading-relaxed">
                   Perfect for individuals looking for quick guidance, basic strategy alignment, and answers to foundational questions to set you on the right track.
                   <div className="mt-6 pt-6 border-t border-zinc-100 flex flex-col gap-3">
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Duration</span>
                       <span className="font-semibold text-zinc-900">45-60 mins</span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-zinc-900 uppercase tracking-wide">Investment</span>
                       <span className="text-2xl font-semibold text-zinc-900">₹1,299</span>
                     </div>
                   </div>
                </AccordionContent>
              </AccordionItem>


              <AccordionItem value="consult_melwin" className="border border-zinc-200 bg-zinc-50 rounded-2xl px-6 shadow-sm data-[state=open]:border-black data-[state=open]:ring-1 data-[state=open]:ring-black transition-all overflow-hidden relative">
                {formData.consultation_type === 'consult_melwin' && (
                  <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider z-10">
                    Recommended
                  </div>
                )}
                <AccordionTrigger className="hover:no-underline py-6">
                   <div className="flex items-center gap-4 text-left">
                     <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                       <Image src="/melwin.jpeg" alt="Dr. Melwin" fill className="object-cover" />
                     </div>
                     <div className="flex flex-col">
                       <div className="flex items-center gap-1.5">
                         <span className="font-sans text-lg font-bold text-zinc-900">Consult with Melwin</span>
                         <BadgeCheck className="w-5 h-5 text-blue-500" />
                       </div>
                       <span className="text-sm text-zinc-500 font-normal mt-0.5">1-on-1 session with Dr. Melwin Vincent</span>
                     </div>
                   </div>
                </AccordionTrigger>
                <AccordionContent className="text-zinc-600 pb-6 leading-relaxed">
                   Direct access to Dr. Melwin for high-level strategic consulting. Includes a personalized roadmap, priority support, and exclusive insights from his ventures.
                   <div className="mt-6 pt-6 border-t border-zinc-200 flex flex-col gap-3">
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-zinc-500 uppercase tracking-wide">Duration</span>
                       <span className="font-semibold text-zinc-900">45-60 mins</span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-zinc-900 uppercase tracking-wide">Investment</span>
                       <div className="text-right">
                         <span className="text-sm line-through text-zinc-400 mr-2">₹5,000</span>
                         <span className="text-2xl font-bold text-zinc-900">₹2,999</span>
                       </div>
                     </div>
                   </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Right: Booking form */}
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
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Phone *</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:ring-black focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Preferred Date *</label>
                <DateTimePicker
                  name="slot_preference"
                  value={formData.slot_preference}
                  onChange={handleChange}
                  className="bg-white border-zinc-300 text-zinc-900 placeholder:text-zinc-400 rounded-xl focus:ring-black focus:border-black h-10 px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Intake Notes</label>
                <Textarea
                  name="intake_notes"
                  value={formData.intake_notes}
                  onChange={handleChange}
                  placeholder="Brief overview of your challenge or goal"
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
                    Processing...
                  </>
                ) : (
                  'Secure Your Slot'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
