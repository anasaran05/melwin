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

  // 2. Handle return from checkout (paid Cashfree order verification or free claim toast)
  useEffect(() => {
    if (orderIdParam) {
      verifyCashfreeOrder(orderIdParam)
    }
  }, [orderIdParam])

  useEffect(() => {
    if (statusParam === 'claimed') {
      toast.success('Asset unlocked! Your download links are ready below.')
    }
  }, [statusParam])

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
        if (statusParam === 'claimed') {
          toast.success('Asset unlocked! Your download links are ready below.')
        } else {
          toast.success('Payment verified! Your assets are unlocked below.')
        }
        if (data.customerEmail) {
          setCustomerEmail(data.customerEmail)
          setLookupEmail(data.customerEmail)
          if (typeof window !== 'undefined') {
            localStorage.setItem('store_customer_email', data.customerEmail)
          }
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {purchases.map((purchase) => {
                  const prod = purchase.product
                  const title = prod?.title || 'Purchased Digital Asset'
                  const format = prod?.format_badge || 'PDF Guide'
                  const downloadLink = prod?.asset_url || '#'
                  const previewLink = prod?.preview_url

                  return (
                    <div
                      key={purchase.id}
                      className="group rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg hover:shadow-neutral-200/50"
                    >
                      {/* Top: 4:3 Thumbnail */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 select-none">
                        {prod?.thumbnail_url ? (
                          <img
                            src={prod.thumbnail_url}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          /* Dark Executive Mockup Graphic */
                          <div className="relative w-full h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col justify-between p-4 overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-700/10 rounded-full blur-xl pointer-events-none" />
                            <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                            <div className="relative z-10 m-auto w-[84%] aspect-[1.35/1] rounded-xl bg-gradient-to-b from-neutral-800/95 to-neutral-900/98 border border-white/10 shadow-2xl p-3.5 flex flex-col justify-between group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                  <span className="text-[9px] font-mono tracking-wider uppercase text-emerald-300 font-bold">
                                    {prod?.category || 'Vault Asset'}
                                  </span>
                                </div>
                                <span className="text-[8px] font-mono text-neutral-400 font-medium px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                                  {format}
                                </span>
                              </div>

                              <div className="my-auto py-1">
                                <p className="text-[12px] sm:text-[13px] font-extrabold text-white leading-tight line-clamp-2 drop-shadow-xs">
                                  {title}
                                </p>
                                {prod?.subtitle && (
                                  <p className="text-[9px] text-neutral-400 mt-1 line-clamp-1">
                                    {prod.subtitle}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[8px] text-neutral-400 font-mono">
                                <span>MELWIN VAULT</span>
                                <span className="text-emerald-400 font-bold">UNLOCKED</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Top Format Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide bg-neutral-950/80 backdrop-blur-md border border-white/15 text-white shadow-md">
                            {format}
                          </span>
                        </div>

                        {/* Top Unlocked Badge */}
                        <div className="absolute top-3 right-3 z-10">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide bg-emerald-600/90 backdrop-blur-md border border-emerald-400/30 text-white shadow-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Unlocked</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Content & Action Footer */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                            <span>{prod?.category || 'Digital Vault Asset'}</span>
                            <span>
                              {new Date(purchase.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-neutral-950 leading-snug line-clamp-2">
                            {title}
                          </h3>

                          {prod?.subtitle && (
                            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                              {prod.subtitle}
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
                                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                                title="Open Preview"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Preview</span>
                              </a>
                            )}

                            <a
                              href={downloadLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Asset</span>
                            </a>
                          </div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favoriteProducts.map((p) => (
                  <div
                    key={p.id}
                    className="group rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 shadow-xs flex flex-col justify-between overflow-hidden transition-all duration-300"
                  >
                    {/* Top: 4:3 Thumbnail */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 select-none">
                      {p.thumbnail_url ? (
                        <img
                          src={p.thumbnail_url}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="relative w-full h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col justify-between p-4 overflow-hidden">
                          <div className="relative z-10 m-auto w-[84%] aspect-[1.35/1] rounded-xl bg-neutral-900 border border-white/10 p-3 flex flex-col justify-between">
                            <span className="text-[8px] font-mono text-neutral-400 font-medium">{p.format_badge}</span>
                            <p className="text-[12px] font-bold text-white line-clamp-2">{p.title}</p>
                            <span className="text-[8px] font-mono text-emerald-400 font-bold">{p.category}</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-950/80 backdrop-blur-md border border-white/15 text-white">
                          {p.format_badge}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-950 line-clamp-1">{p.title}</h4>
                        <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">{p.description}</p>
                      </div>

                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
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
