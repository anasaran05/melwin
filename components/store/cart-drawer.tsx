'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useStoreCart } from '@/hooks/use-store-cart'
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Loader2,
  Sparkles,
  Lock,
} from 'lucide-react'
import { toast } from 'sonner'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const loadCashfreeSdk = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).Cashfree) {
      resolve((window as any).Cashfree)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'
    script.async = true
    script.onload = () => {
      if ((window as any).Cashfree) {
        resolve((window as any).Cashfree)
      } else {
        reject(new Error('Cashfree SDK failed to initialize'))
      }
    }
    script.onerror = () => reject(new Error('Failed to load Cashfree SDK script'))
    document.body.appendChild(script)
  })
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, clearCart, totalAmount } = useStoreCart()

  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isSigningInGoogle, setIsSigningInGoogle] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [avatarError, setAvatarError] = useState(false)

  // Load authenticated user on open or change, and listen for auth state updates
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return

    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase!.auth.getUser()
        if (user) {
          setCurrentUser(user)
          setAvatarError(false)
        }
      } catch (_) {}
    }
    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user)
        setAvatarError(false)
      } else {
        setCurrentUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isOpen])

  if (!isOpen) return null

  const userAvatarUrl =
    currentUser?.user_metadata?.avatar_url ||
    currentUser?.user_metadata?.picture ||
    currentUser?.identities?.[0]?.identity_data?.avatar_url ||
    currentUser?.identities?.[0]?.identity_data?.picture ||
    null

  // 1-Tap Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        toast.error('Auth service unavailable.')
        return
      }

      setIsSigningInGoogle(true)
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/store'
      const returnUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(`${currentPath}?openCart=true`)}`

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: returnUrl,
        },
      })

      if (error) {
        toast.error(error.message || 'Google sign-in failed.')
        setIsSigningInGoogle(false)
      }
    } catch (err: any) {
      console.error('[Google Sign In Error]:', err)
      toast.error(err.message || 'Failed to connect with Google.')
      setIsSigningInGoogle(false)
    }
  }

  // Checkout with the authenticated Google email
  const handleCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (items.length === 0) {
      toast.error('Your cart is empty.')
      return
    }

    if (!currentUser || !currentUser.email) {
      toast.error('Please sign in with Google to continue to checkout.')
      handleGoogleSignIn()
      return
    }

    const email = currentUser.email.toLowerCase().trim()
    const name = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Customer'
    const phone = currentUser.user_metadata?.phone || currentUser.phone || '9999999999'

    setIsCheckingOut(true)

    try {
      const res = await fetch('/api/store/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          items,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to initialize payment session.')
      }

      // Handle Free Asset Unlock
      if (data.isFree) {
        clearCart()
        if (typeof window !== 'undefined') {
          localStorage.setItem('store_customer_email', email)
        }
        toast.success(data.message || 'Assets unlocked successfully!')
        window.location.href = data.redirectUrl || '/store/purchases'
        return
      }

      // Launch Cashfree SDK
      const Cashfree = await loadCashfreeSdk()
      const isProd =
        process.env.NEXT_PUBLIC_CASHFREE_ENV === 'production' ||
        process.env.NODE_ENV === 'production'

      const cashfree = Cashfree({
        mode: isProd ? 'production' : 'sandbox',
      })

      clearCart()
      await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_self',
      })
    } catch (err: any) {
      console.error('[Cart Checkout Error]:', err)
      toast.error(err.message || 'Payment initiation failed. Please try again.')
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        {/* Light Theme Drawer Panel */}
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 text-neutral-900 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-sm">
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-neutral-900 leading-tight">Your Cart</h2>
                <p className="text-xs text-neutral-500 font-medium">
                  {items.length} {items.length === 1 ? 'digital asset' : 'digital assets'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-neutral-50/50">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 shadow-sm">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-bold text-neutral-800">Your cart is currently empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                  Browse our battle-tested playbooks, templates, and frameworks and add them to your cart.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>Browse Store Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all shadow-sm flex items-start gap-3 relative group"
                >
                  <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0 text-emerald-600 overflow-hidden">
                    {item.thumbnailUrl ? (
                      <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200 mb-1">
                      {item.format}
                    </span>
                    <h4 className="text-xs font-bold text-neutral-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs font-black text-emerald-700">
                        {item.price === 0 ? 'FREE' : `₹${item.price.toLocaleString('en-IN')}`}
                      </span>
                      {item.salePrice && item.regularPrice > item.price && (
                        <span className="text-[11px] text-neutral-400 line-through">
                          ₹{item.regularPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-white space-y-4 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
              {/* Account / Google One-Tap Status */}
              {currentUser?.email ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/90">
                  <div className="flex items-center gap-3 min-w-0">
                    {userAvatarUrl && !avatarError ? (
                      <img
                        src={userAvatarUrl}
                        alt="Avatar"
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                        className="w-8 h-8 rounded-full border border-neutral-200 object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
                        {((currentUser.user_metadata?.full_name || currentUser.email || 'U').charAt(0)).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 truncate">
                        {currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Google Account'}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate font-mono">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                    Delivery Email
                  </span>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                  <div className="text-left space-y-0.5">
                    <h4 className="text-xs font-bold text-neutral-900">Sign in for Instant Delivery</h4>
                    <p className="text-[11px] text-neutral-500 leading-snug">
                      Your digital downloads and invoice receipt will be sent to your Google email.
                    </p>
                  </div>

                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isSigningInGoogle}
                    className="w-full bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-xs hover:shadow-sm cursor-pointer active:scale-[0.99]"
                  >
                    {isSigningInGoogle ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
                        <span>Connecting Google...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-0.5">
                    <Link
                      href="/store/login?next=/store?openCart=true"
                      onClick={onClose}
                      className="text-[11px] text-neutral-500 hover:text-emerald-700 font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <span>Prefer email magic link? Use Store Sign In</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold text-neutral-700">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Tax & Platform Processing</span>
                  <span className="text-emerald-700 font-semibold">Included</span>
                </div>
                <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Due</span>
                  <span className="text-emerald-700">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Proceed to Pay Button */}
              {currentUser?.email ? (
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Connecting Secure Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 stroke-[2.2]" />
                      <span>Proceed to Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSigningInGoogle}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30"
                >
                  {isSigningInGoogle ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Connecting Google...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue with Google to Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
