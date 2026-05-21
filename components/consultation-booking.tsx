'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { DateTimePicker } from '@/components/ui/date-time-picker'

export function ConsultationBooking() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    slot_preference: '',
    intake_notes: '',
  })

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
      toast.error('Please select a preferred time slot')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to create order')
        return
      }

      // Load Razorpay
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: data.orderId,
          amount: data.amount,
          currency: data.currency,
          name: 'Dr. Melwin Vincent',
          description: '30-Minute Strategy Consultation',
          handler: async (response: any) => {
            try {
              const verifyResponse = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...formData,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              })

              const verifyData = await verifyResponse.json()

              if (verifyData.success) {
                toast.success(`Thanks ${formData.name}, booking confirmed! Check your email for details.`)
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  slot_preference: '',
                  intake_notes: '',
                })
              } else {
                toast.error('Payment verification failed')
              }
            } catch (error) {
              toast.error('Error verifying payment')
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#000000',
          },
        }

        const razorpay = new (window as any).Razorpay(options)
        razorpay.open()
      }
      document.body.appendChild(script)
    } catch (error) {
      toast.error('Error creating order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="consultation" className="py-20 max-md:py-16 md:py-32 px-4 md:px-8 bg-white border-t border-zinc-200">
      <div className="max-w-6xl mx-auto">
        <p className="font-sans text-xs text-zinc-500 uppercase tracking-widest mb-12">// Booking</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Left: Pricing */}
          <div>
              <Card className="border border-zinc-200 bg-zinc-50 p-8 max-md:p-6 rounded-2xl shadow-sm">
              <div className="space-y-6">
                <Badge className="bg-black text-white hover:bg-zinc-800 border-0">LAUNCH OFFER</Badge>

                <div>
                  <p className="text-sm text-zinc-500 font-sans mb-2 uppercase tracking-wide">Regular Price</p>
                  <p className="text-4xl font-medium line-through text-zinc-400">₹3,000</p>
                </div>

                <div className="border-t border-zinc-200 pt-6">
                  <p className="text-sm text-zinc-500 font-sans mb-2 uppercase tracking-wide">Launch Price</p>
                  <p className="text-5xl font-semibold text-zinc-900">₹1,299</p>
                </div>

                <div className="border-t border-zinc-200 pt-6 space-y-4">
                  <h4 className="font-sans text-lg font-bold text-zinc-900">30-Minute Execution Block</h4>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    Strategic deep-dive covering your specific challenge, market positioning, or next steps. Actionable insights, not theory.
                  </p>

                  <div className="pt-4 space-y-2">
                    <p className="text-sm font-sans font-medium text-zinc-900 uppercase tracking-wide">What to bring:</p>
                    <ul className="text-sm text-zinc-600 space-y-2">
                      <li>• Specific challenge or goal</li>
                      <li>• Current metrics (if applicable)</li>
                      <li>• Timeline expectations</li>
                      <li>• Budget constraints</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
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
                <label className="block text-sm font-sans font-medium text-zinc-700 mb-2">Preferred Time Slot *</label>
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
