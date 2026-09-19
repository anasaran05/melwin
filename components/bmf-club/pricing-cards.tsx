'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Check,
  X,
  Sparkles,
  Crown,
  Zap,
  Users,
  Calendar,
  BookOpen,
  Eye,
  ArrowRight,
  Loader2,
  ShieldCheck,
  PartyPopper,
  Flame,
} from 'lucide-react'
import { toast } from 'sonner'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'

declare global {
  interface Window {
    Cashfree?: any
  }
}

interface PricingCardsProps {
  compact?: boolean
  showTitle?: boolean
  isModal?: boolean
  onSuccess?: () => void
  onSelectFree?: () => void
}

export function PricingCards({
  compact = false,
  showTitle = true,
  isModal = false,
  onSuccess,
  onSelectFree,
}: PricingCardsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(false)
  const [activeUser, setActiveUser] = useState<any>(null)
  const [mobileTab, setMobileTab] = useState<'premium' | 'free'>('premium')
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [successCelebration, setSuccessCelebration] = useState(false)
  const [isVerifyingReturn, setIsVerifyingReturn] = useState(false)

  // 1. Fetch current logged in user
  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = getSupabaseBrowserClient()
        if (!supabase) return
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          setActiveUser(user)
          setCustomerEmail(user.email || '')
          setCustomerName(user.user_metadata?.full_name || user.user_metadata?.name || '')
        }
      } catch (err) {
        // Non-fatal
      }
    }
    loadUser()
  }, [])

  // 2. Handle Cashfree Return URL parameter verification if redirected back
  useEffect(() => {
    const orderId = searchParams.get('order_id')
    const status = searchParams.get('status')

    if (orderId && (status === 'success' || !status)) {
      verifyCashfreeOrder(orderId)
    }
  }, [searchParams])

  // Load Cashfree SDK v3 dynamically
  const loadCashfreeSdk = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.Cashfree) {
        resolve(window.Cashfree)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
      script.async = true
      script.onload = () => {
        if (window.Cashfree) {
          resolve(window.Cashfree)
        } else {
          reject(new Error('Cashfree SDK failed to initialize'))
        }
      }
      script.onerror = () => reject(new Error('Failed to load Cashfree SDK script'))
      document.body.appendChild(script)
    })
  }

  // 3. Initiate Checkout
  const handleUpgradeClick = () => {
    if (!customerEmail && !activeUser) {
      setCheckoutModalOpen(true)
      return
    }
    initiateCashfreeCheckout()
  }

  const initiateCashfreeCheckout = async () => {
    try {
      setLoading(true)

      const emailToUse = customerEmail || activeUser?.email
      if (!emailToUse) {
        toast.error('Please enter your email to proceed')
        setCheckoutModalOpen(true)
        setLoading(false)
        return
      }

      // Step 1: Create Order via Next.js Backend
      const res = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName || activeUser?.user_metadata?.full_name || 'BMF Founder',
          customerEmail: emailToUse,
          customerPhone: customerPhone || '9999999999',
          planTier: 'premium',
          billingCycle: 'annual',
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.paymentSessionId) {
        throw new Error(data.error || 'Could not initiate Cashfree order')
      }

      setCheckoutModalOpen(false)

      // Step 2: Load Cashfree SDK & Launch Checkout
      const CashfreeSdk = await loadCashfreeSdk()
      const envMode = data.environment === 'sandbox' ? 'sandbox' : 'production'
      const cashfreeInstance = CashfreeSdk({ mode: envMode })

      cashfreeInstance.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_modal',
      }).then((result: any) => {
        if (result?.error) {
          toast.error(result.error.message || 'Payment closed or failed')
          return
        }
        if (result?.paymentDetails) {
          toast.success('Payment submitted! Confirming your membership...')
          verifyCashfreeOrder(data.orderId)
        }
      })
    } catch (err: any) {
      console.error('[Pricing] Checkout error:', err)
      toast.error(err.message || 'Payment initiation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // 4. Verify Order Fallback
  const verifyCashfreeOrder = async (orderId: string) => {
    try {
      setIsVerifyingReturn(true)
      const res = await fetch('/api/cashfree/verify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const data = await res.json()
      if (data.success && data.isPremium) {
        setSuccessCelebration(true)
        toast.success('Congratulations! Your account is upgraded to BMF Premium!')
        if (onSuccess) onSuccess()
      } else {
        toast.info('Payment status: ' + (data.status || 'Pending confirmation'))
      }
    } catch (e) {
      console.error('Error verifying order:', e)
    } finally {
      setIsVerifyingReturn(false)
    }
  }

  if (successCelebration) {
    return (
      <div className="w-full max-w-2xl mx-auto my-8 p-8 md:p-12 rounded-3xl bg-white border-2 border-amber-400 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent pointer-events-none" />
        <div className="w-20 h-20 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto mb-6 text-amber-600">
          <PartyPopper className="w-10 h-10 animate-bounce" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs uppercase font-semibold tracking-wider mb-4">
          <Crown className="w-3.5 h-3.5 text-amber-600" /> BMF Premium Active
        </div>
        <h3 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight mb-4">
          Welcome to the Inner Circle!
        </h3>
        <p className="text-stone-600 text-base md:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
          Your payment was verified successfully. You now have full access to the member-only WhatsApp community, Featured Founder directory placement, and exclusive investor access.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push('/bmf-club/dashboard')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm transition-all shadow-md hover:shadow-amber-400/20 cursor-pointer"
          >
            Go to Your Dashboard
          </button>
          <button
            onClick={() => router.push('/bmf-club/directory')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-200 font-semibold text-sm transition-all cursor-pointer"
          >
            View Directory Placement
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${showTitle ? 'py-4' : 'pt-0 pb-4'} relative text-[#111111]`}>
      {/* Verification Spinner Overlay */}
      {isVerifyingReturn && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center gap-3 text-amber-800 text-sm font-medium shadow-sm">
          <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
          Verifying payment and upgrading your BMF Club membership...
        </div>
      )}

      {/* Header Section (if enabled) */}
      {showTitle && (
        <div className={`text-center max-w-3xl mx-auto ${isModal ? 'mb-4 sm:mb-6' : 'mb-8 sm:mb-10'}`}>
          <h2 className={`${isModal ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl md:text-5xl'} font-black text-stone-950 tracking-tight leading-tight`}>
            BMF Club Membership
          </h2>
          <p className={`text-stone-600 ${isModal ? 'text-xs sm:text-sm mt-1.5' : 'text-base sm:text-lg mt-3'} max-w-xl mx-auto leading-relaxed`}>
            Connect with founders, attend events, and access tactical startup resources.
          </p>
        </div>
      )}

      {/* Mobile Segmented Tab Bar (< 768px) */}
      <div className="md:hidden flex items-center justify-center mb-6">
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-100 border border-stone-200 w-full max-w-sm shadow-inner">
          <button
            type="button"
            onClick={() => setMobileTab('premium')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === 'premium'
                ? 'bg-amber-400 text-stone-950 shadow-sm font-bold'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-stone-950" />
            <span>BMF Premium</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('free')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileTab === 'free'
                ? 'bg-white text-stone-950 shadow-sm border border-stone-200/60 font-bold'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-stone-600" />
            <span>Free Community</span>
          </button>
        </div>
      </div>

      {/* Responsive Two Column Pricing Matrix (White Theme) */}
      <div className={`grid grid-cols-1 ${compact ? 'gap-6' : 'md:grid-cols-2 gap-5 lg:gap-8'} max-w-5xl mx-auto items-stretch`}>
        
        {/* ======================================================== */}
        {/* FREE TIER CARD (WHITE THEME) */}
        {/* ======================================================== */}
        <div className={`relative flex-col justify-between rounded-3xl bg-white border border-stone-200 ${isModal ? 'p-5 sm:p-7' : 'p-7 sm:p-9'} transition-all hover:border-stone-300 shadow-sm hover:shadow-md ${mobileTab === 'free' ? 'flex' : 'hidden md:flex'}`}>
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Free Tier
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200/60">
                Free Forever
              </span>
            </div>

            <h3 className={`${isModal ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-black text-stone-900 tracking-tight mb-1.5`}>
              BMF Community
            </h3>
            <p className={`text-stone-600 ${isModal ? 'text-xs sm:text-sm mb-4' : 'text-sm mb-6'} leading-relaxed`}>
              Connect with fellow builders and stay updated with the Tamil Nadu startup ecosystem.
            </p>

            {/* Price Display */}
            <div className={`flex items-baseline gap-2 ${isModal ? 'mb-5 pb-4' : 'mb-8 pb-6'} border-b border-stone-100`}>
              <span className={`${isModal ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'} font-extrabold text-stone-950`}>
                ₹0
              </span>
              <span className="text-stone-500 text-xs sm:text-sm font-medium">
                / forever
              </span>
            </div>

            {/* Feature Groups */}
            <div className={`${isModal ? 'space-y-4 mb-6' : 'space-y-6 mb-8'} text-xs sm:text-sm`}>
              {/* 1. Community & Network */}
              <div>
                <div className="flex items-center gap-2 text-stone-900 font-bold mb-2">
                  <Users className="w-3.5 h-3.5 text-stone-500" />
                  <span>Community & Network</span>
                </div>
                <ul className="space-y-1.5 text-stone-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Access to general BMF community WhatsApp group</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Network with fellow members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Basic co-founder and collaborator matching</span>
                  </li>
                </ul>
              </div>

              {/* 2. Events & Access */}
              <div>
                <div className="flex items-center gap-2 text-stone-900 font-bold mb-2">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>Events & Access</span>
                </div>
                <ul className="space-y-1.5 text-stone-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Visibility into upcoming startup events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Monthly webinars with guest speakers</span>
                  </li>
                </ul>
              </div>

              {/* 3. Learning & Digital Products */}
              <div>
                <div className="flex items-center gap-2 text-stone-900 font-bold mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                  <span>Learning & Digital Products</span>
                </div>
                <ul className="space-y-1.5 text-stone-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Access to free recorded sessions</span>
                  </li>
                </ul>
              </div>

              {/* 4. Visibility & Direct Access */}
              <div>
                <div className="flex items-center gap-2 text-stone-900 font-bold mb-2">
                  <Eye className="w-3.5 h-3.5 text-stone-500" />
                  <span>Visibility & Direct Access</span>
                </div>
                <ul className="space-y-1.5 text-stone-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Post in community and get peer feedback</span>
                  </li>
                  <li className="flex items-start gap-2 text-stone-400 line-through">
                    <X className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span>Directory placement</span>
                  </li>
                  <li className="flex items-start gap-2 text-stone-400 line-through">
                    <X className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span>Direct access to Melwin</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (onSelectFree) {
                onSelectFree()
              } else {
                router.push('/bmf-club/login')
              }
            }}
            className="w-full py-3 px-5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs sm:text-sm transition-all border border-stone-200 cursor-pointer"
          >
            Continue with Free Community
          </button>
        </div>

        {/* ======================================================== */}
        {/* PREMIUM TIER CARD (WHITE THEME WITH SUBTLE AMBER BORDER) */}
        {/* ======================================================== */}
        <div className={`relative flex-col justify-between rounded-3xl bg-white border-2 border-amber-400 ${isModal ? 'p-5 sm:p-7' : 'p-7 sm:p-9'} shadow-lg shadow-amber-500/5 transition-all hover:border-amber-500 ${mobileTab === 'premium' ? 'flex' : 'hidden md:flex'}`}>
          
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-amber-500" /> Premium Plan
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
                Annual Membership
              </span>
            </div>

            <h3 className={`${isModal ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-black text-stone-950 tracking-tight mb-1.5`}>
              BMF Premium
            </h3>
            <p className={`text-stone-600 ${isModal ? 'text-xs sm:text-sm mb-4' : 'text-sm mb-6'} leading-relaxed`}>
              Full access to investor networks, exclusive events, tactical playbooks, and directory placement.
            </p>

            {/* Price Display */}
            <div className={`flex items-baseline gap-2.5 ${isModal ? 'mb-5 pb-4' : 'mb-8 pb-6'} border-b border-stone-100`}>
              <span className={`${isModal ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'} font-extrabold text-amber-600`}>
                ₹799
              </span>
              <span className="text-stone-500 text-xs sm:text-sm font-medium">
                / year
              </span>
              <span className="text-xs line-through text-stone-400 ml-1">
                ₹2,499
              </span>
              <span className="text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Save 68%
              </span>
            </div>

            {/* Feature Groups */}
            <div className={`${isModal ? 'space-y-4 mb-6' : 'space-y-6 mb-8'} text-xs sm:text-sm`}>
              {/* 1. Community & Network */}
              <div>
                <div className="flex items-center gap-2 text-stone-950 font-bold mb-2">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Community & Network</span>
                </div>
                <ul className="space-y-1.5 text-stone-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="font-semibold text-stone-900">Access to members WhatsApp group</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Connect with investors and guest speakers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Network with active entrepreneurs and founders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Monthly webinars with guest founders & leaders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Support for co-founders and hiring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Feedback and validation on your venture</span>
                  </li>
                </ul>
              </div>

              {/* 2. Events & Access */}
              <div>
                <div className="flex items-center gap-2 text-stone-950 font-bold mb-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Events & Access</span>
                </div>
                <ul className="space-y-1.5 text-stone-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Pass price reduction at all meetups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="font-semibold text-stone-900">Access to invite-only meetups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Early access to Tamil Nadu startup events</span>
                  </li>
                </ul>
              </div>

              {/* 3. Learning & Digital Products */}
              <div>
                <div className="flex items-center gap-2 text-stone-950 font-bold mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Founder Vault & Masterclasses</span>
                </div>
                <ul className="space-y-1.5 text-stone-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Startup Masterclasses (Upto 50% off on all)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>BMF Founder Vault digital playbooks (Upto 50% off)</span>
                  </li>
                </ul>
              </div>

              {/* 4. Visibility & Direct Access */}
              <div>
                <div className="flex items-center gap-2 text-stone-950 font-bold mb-2">
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                  <span>Visibility & Direct Access</span>
                </div>
                <ul className="space-y-1.5 text-stone-700">
                  <li className="flex items-start gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 fill-amber-400" />
                    <span className="font-bold text-stone-950">Featured Founder placement in directory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 fill-amber-400" />
                    <span className="font-bold text-stone-950">Direct access to Melwin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Obsidian Executive Pass instantly unlocked</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Ability to post your own events to the community</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleUpgradeClick}
            disabled={loading}
            className={`w-full ${isModal ? 'py-3.5' : 'py-4'} px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-black text-sm sm:text-base transition-all shadow-lg hover:shadow-amber-400/30 flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Launching Cashfree...</span>
              </>
            ) : (
              <>
                <span>Upgrade to Premium — ₹799/yr</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>


      {/* Guest Checkout Modal if email/phone is required */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 md:p-8 text-stone-900 shadow-2xl relative">
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 p-2 text-sm font-bold"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-2">
              <Crown className="w-4 h-4" /> BMF Premium Checkout
            </div>
            <h3 className="text-xl font-bold text-stone-950 mb-1">Enter Your Details</h3>
            <p className="text-stone-500 text-xs mb-6 leading-relaxed">
              Complete your payment of ₹799/year to activate your BMF Premium benefits immediately.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Anand Kumar"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                />
              </div>

              <button
                onClick={initiateCashfreeCheckout}
                disabled={loading}
                className="w-full mt-4 py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Proceed to Pay ₹799'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
