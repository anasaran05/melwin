'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { StorePurchaseItem, StoreProductItem } from '@/lib/supabase/store'
import { useStoreFavorites, StoreFavoritesProvider } from '@/hooks/use-store-favorites'
import { StoreCartProvider } from '@/hooks/use-store-cart'
import { Footer } from '@/components/footer'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'
import {
  Download,
  ShoppingBag,
  Heart,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Mail,
  Receipt,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

function StorePurchasesContent() {
  const searchParams = useSearchParams()

  const orderIdParam = searchParams.get('order_id')
  const statusParam = searchParams.get('status')

  const [activeTab, setActiveTab] = useState<'purchases' | 'favorites'>('purchases')
  const [purchases, setPurchases] = useState<StorePurchaseItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [customerEmail, setCustomerEmail] = useState('')
  const [lookupEmail, setLookupEmail] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isVerifyingOrder, setIsVerifyingOrder] = useState(false)

  const { favoriteIds } = useStoreFavorites()
  const [allProducts, setAllProducts] = useState<StoreProductItem[]>([])

  // 1. Initial Auth Check and Email resolution
  useEffect(() => {
    async function initUser() {
      let resolvedEmail = ''
      try {
        const supabase = getSupabaseBrowserClient()
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            setCurrentUser(user)
            resolvedEmail = user.email || ''
          }
        }
      } catch (_) {}

      if (!resolvedEmail && typeof window !== 'undefined') {
        resolvedEmail =
          localStorage.getItem('store_customer_email') ||
          localStorage.getItem('bmf_current_user_email') ||
          ''
      }

      if (resolvedEmail) {
        setCustomerEmail(resolvedEmail)
        setLookupEmail(resolvedEmail)
        loadCustomerPurchases(resolvedEmail)
      } else {
        setIsLoading(false)
      }
    }

    initUser()
  }, [])

  // 2. Handle return from Cashfree with order_id verification
  useEffect(() => {
    if (orderIdParam && (statusParam === 'success' || !statusParam)) {
      verifyCashfreeOrder(orderIdParam)
    }
  }, [orderIdParam, statusParam])

  const verifyCashfreeOrder = async (orderId: string) => {
    setIsVerifyingOrder(true)
    try {
      const res = await fetch('/api/store/verify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Payment verified! Your assets are unlocked below.')
        if (data.customerEmail) {
          setCustomerEmail(data.customerEmail)
          setLookupEmail(data.customerEmail)
          loadCustomerPurchases(data.customerEmail)
        }
      }
    } catch (err) {
      console.warn('[Store Purchases] Order verification notice:', err)
    } finally {
      setIsVerifyingOrder(false)
    }
  }

  // 3. Load Purchases from API
  const loadCustomerPurchases = async (email: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/store/my-purchases?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.purchases)) {
        setPurchases(data.purchases)
      }
    } catch (err) {
      console.error('[Store Purchases] Error loading purchases:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // 4. Load Catalog Products for Favorites tab
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch('/api/store/products')
        const data = await res.json()
        if (data.success && Array.isArray(data.products)) {
          setAllProducts(data.products)
        }
      } catch (_) {}
    }
    loadCatalog()
  }, [])

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lookupEmail || !lookupEmail.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }
    setCustomerEmail(lookupEmail)
    if (typeof window !== 'undefined') {
      localStorage.setItem('store_customer_email', lookupEmail.toLowerCase().trim())
    }
    loadCustomerPurchases(lookupEmail)
  }

  const favoriteProducts = allProducts.filter((p) => favoriteIds.includes(p.id) || favoriteIds.includes(p.slug))

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-neutral-200/90 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store Catalog</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-900">Customer Asset Vault</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Payment Success Alert if returning from Cashfree */}
        {orderIdParam && (
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-950">Order Confirmed & Unlocked</h3>
                <p className="text-xs text-neutral-600">
                  Order ID: <span className="font-mono text-emerald-800 font-semibold">{orderIdParam}</span>. Your download links are ready below.
                </p>
              </div>
            </div>
            {isVerifyingOrder && (
              <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Verifying...</span>
              </div>
            )}
          </div>
        )}

        {/* Dashboard Title & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight">
              My Digital Assets & Downloads
            </h1>
            <p className="text-xs text-neutral-500 font-normal">
              {customerEmail
                ? `Showing unlocked assets for ${customerEmail}`
                : 'Access your purchased playbooks, spreadsheets, and legal frameworks'}
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 border border-neutral-200 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('purchases')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'purchases'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Purchased ({purchases.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'favorites'
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Saved ({favoriteProducts.length})</span>
            </button>
          </div>
        </div>

        {/* Guest Email Lookup Bar */}
        {!currentUser && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Find Past Purchases</h4>
                <p className="text-[11px] text-neutral-500">
                  Bought with a different email? Enter it below to load your asset library.
                </p>
              </div>
            </div>

            <form onSubmit={handleLookupSubmit} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="customer@email.com"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none w-full sm:w-60 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 font-bold text-xs shrink-0 transition-colors cursor-pointer shadow-xs"
              >
                Access
              </button>
            </form>
          </div>
        )}

        {/* Tab 1: Purchased Assets List */}
        {activeTab === 'purchases' && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <p className="text-xs text-neutral-500">Loading your purchased assets...</p>
              </div>
            ) : purchases.length === 0 ? (
              <div className="py-16 text-center space-y-4 rounded-3xl border border-dashed border-neutral-300 bg-white p-8 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 mx-auto">
                  <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-neutral-900">No purchased assets found</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {customerEmail
                      ? `We couldn't find any orders tied to ${customerEmail}. If you used a different email during Cashfree checkout, enter it above.`
                      : 'Enter your checkout email above or browse the store to unlock frameworks.'}
                  </p>
                </div>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-colors shadow-sm cursor-pointer"
                >
                  <span>Explore Vault Store</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {purchases.map((purchase) => {
                  const prod = purchase.product
                  const title = prod?.title || 'Purchased Digital Asset'
                  const format = prod?.format_badge || 'PDF Guide'
                  const downloadLink = prod?.asset_url || '#'
                  const previewLink = prod?.preview_url

                  return (
                    <div
                      key={purchase.id}
                      className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-800">
                            {format}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {new Date(purchase.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-neutral-950 leading-snug">{title}</h3>
                          {prod?.subtitle && (
                            <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                              {prod.subtitle}
                            </p>
                          )}
                        </div>

                        {prod?.description && (
                          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>
                        )}
                      </div>

                      {/* Download Action & Receipt */}
                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                          <Receipt className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Paid: ₹{purchase.amount_paid.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {previewLink && (
                            <a
                              href={previewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>View</span>
                            </a>
                          )}

                          <a
                            href={downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Asset</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Favorites */}
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            {favoriteProducts.length === 0 ? (
              <div className="py-16 text-center space-y-3 rounded-3xl border border-dashed border-neutral-300 bg-white p-8 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center text-neutral-400 mx-auto">
                  <Heart className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">No saved favorites</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  Save assets from the store catalog to review or purchase them later.
                </p>
                <Link
                  href="/store"
                  className="inline-block text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Browse Store &rarr;
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700 mb-2">
                        {p.format_badge}
                      </span>
                      <h4 className="text-sm font-bold text-neutral-950 line-clamp-1">{p.title}</h4>
                      <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">{p.description}</p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-sm font-black text-neutral-950">
                        ₹{(p.sale_price || p.regular_price).toLocaleString('en-IN')}
                      </span>
                      <Link
                        href="/store"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors shadow-2xs"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function StorePurchasesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white text-neutral-700 flex items-center justify-center font-sans">Loading Purchases...</div>}>
      <StoreCartProvider>
        <StoreFavoritesProvider>
          <StorePurchasesContent />
        </StoreFavoritesProvider>
      </StoreCartProvider>
    </Suspense>
  )
}
