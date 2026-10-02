'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StoreProductItem } from '@/lib/supabase/store'
import { useStoreCart, StoreCartProvider } from '@/hooks/use-store-cart'
import { useStoreFavorites, StoreFavoritesProvider } from '@/hooks/use-store-favorites'
import { StoreNavbar } from '@/components/store/store-navbar'
import { CartDrawer } from '@/components/store/cart-drawer'
import { FavoritesModal } from '@/components/store/favorites-modal'
import { Footer } from '@/components/footer'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'
import {
  Share2,
  Copy,
  Check,
  Heart,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Download,
  Star,
  ExternalLink,
  ChevronRight,
  MessageCircle,
  Twitter,
  Linkedin,
  Send,
  Eye,
} from 'lucide-react'
import { toast } from 'sonner'

interface ProductShowcaseClientProps {
  product: StoreProductItem
  relatedProducts: StoreProductItem[]
  allProducts: StoreProductItem[]
}

function ShowcaseContent({ product, relatedProducts, allProducts }: ProductShowcaseClientProps) {
  const router = useRouter()
  const { addItem, isInCart, setIsCartOpen, isCartOpen } = useStoreCart()
  const { isFavorite, toggleFavorite } = useStoreFavorites()

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [isBmfMember, setIsBmfMember] = useState(false)
  const [pageUrl, setPageUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href)
    }
  }, [])

  // Check if current user is active BMF Member for special pricing
  useEffect(() => {
    async function checkMember() {
      try {
        const supabase = getSupabaseBrowserClient()
        if (!supabase) return
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const { data: member } = await supabase
            .from('bmf_members')
            .select('membership_tier, membership_status, role')
            .eq('user_id', user.id)
            .maybeSingle()

          if (
            member?.role === 'admin' ||
            (member?.membership_tier === 'premium' && member?.membership_status === 'active')
          ) {
            setIsBmfMember(true)
          }
        }
      } catch (_) {}
    }
    checkMember()
  }, [])

  const inCart = isInCart(product.id)
  const favorited = isFavorite(product.id)

  // Pricing calculations
  const regularPrice = product.regular_price
  let currentPrice = product.sale_price || regularPrice

  if (isBmfMember && product.bmf_discount_percent > 0) {
    currentPrice = Math.round(currentPrice * (1 - product.bmf_discount_percent / 100))
  }
  if (product.is_free_public || (isBmfMember && product.is_free_for_bmf)) {
    currentPrice = 0
  }

  // Handle Buy Now / Claim
  const handleBuyNow = () => {
    addItem(product, currentPrice)
    setIsCartOpen(true)
  }

  // Handle Add to Cart
  const handleAddToCart = () => {
    addItem(product, currentPrice)
    toast.success(`"${product.title}" added to your cart!`, {
      action: {
        label: 'View Cart',
        onClick: () => setIsCartOpen(true),
      },
    })
  }

  // Handle Web Share or Fallback Copy
  const handleShare = async () => {
    const url = pageUrl || (typeof window !== 'undefined' ? window.location.href : '')
    const shareData = {
      title: product.title,
      text: `${product.title} - ${product.subtitle || product.description}`,
      url,
    }

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        return
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setShowShareModal(true)
        }
      }
    } else {
      setShowShareModal(true)
    }
  }

  const copyToClipboard = () => {
    const url = pageUrl || (typeof window !== 'undefined' ? window.location.href : '')
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Product link copied to clipboard!')
    setTimeout(() => setCopied(false), 2500)
  }

  const shareText = encodeURIComponent(`${product.title} by Dr. Melwin Vincent`)
  const shareUrl = encodeURIComponent(pageUrl || '')

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <StoreNavbar
        searchQuery=""
        onSearchChange={() => {}}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Main Showcase Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: 4:3 Visual Card Showcase (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 shadow-xl group select-none">
              {product.thumbnail_url ? (
                <img
                  src={product.thumbnail_url}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="relative w-full h-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col justify-between p-6">
                  <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative z-10 m-auto w-[85%] aspect-[1.35/1] rounded-xl bg-neutral-900 border border-white/10 shadow-2xl p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                      {product.category}
                    </span>
                    <h3 className="text-white font-black text-sm leading-tight line-clamp-2">
                      {product.title}
                    </h3>
                    <span className="text-[9px] font-mono text-neutral-400">MELWIN VAULT VERIFIED</span>
                  </div>
                </div>
              )}

              {/* Top Floating Badges */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-emerald-300 border border-white/10 shadow-sm">
                  {product.category}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-neutral-900 shadow-sm">
                  {product.format_badge}
                </span>
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                className={`absolute top-3 right-3 z-20 p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer shadow-md ${
                  favorited
                    ? 'bg-red-500 text-white border border-red-400'
                    : 'bg-black/50 hover:bg-black/75 border border-white/20 text-white/90 hover:text-white hover:scale-105'
                }`}
                title="Save to favorites"
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Product Overview */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Product Overview
              </h2>
              <div className="text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-line bg-white border border-neutral-200 rounded-2xl p-4.5 shadow-xs">
                {product.description}
              </div>
            </div>

            {/* Quick Guarantees Box */}
            <div className="rounded-2xl border border-neutral-200/90 bg-white p-4.5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-neutral-900">Verified Direct Author Edition</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Instant download link + permanent email copy</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                <Download className="w-4 h-4 text-sky-500 shrink-0" />
                <span>PDF format compatible with iOS, Android, Mac & PC</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Actions, Highlights (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header Titles */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-700">4.9 / 5.0</span>
                <span className="text-xs text-neutral-400">·</span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Verified Resource
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight leading-tight">
                {product.title}
              </h1>

              {product.subtitle && (
                <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Pricing Card */}
            <div className="p-5 rounded-2xl bg-neutral-900 text-white border border-neutral-800 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400">
                    Instant Access Price
                  </span>
                  <div className="flex items-baseline gap-2.5 mt-0.5">
                    <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {currentPrice === 0 ? 'FREE' : `₹${currentPrice.toLocaleString('en-IN')}`}
                    </span>
                    {product.regular_price > currentPrice && (
                      <span className="text-sm text-neutral-400 line-through">
                        ₹{product.regular_price.toLocaleString('en-IN')}
                      </span>
                    )}
                    {product.regular_price > currentPrice && currentPrice > 0 && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                        {Math.round(((product.regular_price - currentPrice) / product.regular_price) * 100)}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* BMF Member Discount Badge */}
                {product.bmf_discount_percent > 0 && (
                  <div className="text-right sm:border-l sm:border-neutral-800 sm:pl-4">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center sm:justify-end gap-1">
                      <Zap className="w-3 h-3 fill-current" />
                      BMF Club Exclusive
                    </span>
                    <p className="text-xs text-neutral-300 font-medium mt-0.5">
                      {product.bmf_discount_percent}% off for active members
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/15 cursor-pointer hover:scale-[1.01]"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>{currentPrice === 0 ? 'Claim Free Asset' : 'Buy Now · Instant Unlock'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-neutral-700"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{inCart ? 'In Your Cart' : 'Add to Cart'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
                    title="Share this product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            {Array.isArray(product.highlights) && product.highlights.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3.5 shadow-xs">
                <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  What's Covered in this Guide
                </h2>
                <ul className="space-y-2.5">
                  {product.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 leading-relaxed">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-neutral-200/80">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                  EXPLORE THE VAULT
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight mt-0.5">
                  Related Playbooks & Guides
                </h2>
              </div>

              <Link
                href="/store"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
              >
                <span>View Full Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => {
                const relPrice = rel.sale_price || rel.regular_price
                return (
                  <Link
                    key={rel.id}
                    href={`/store/${rel.slug}`}
                    className="group rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all duration-300 overflow-hidden shadow-xs hover:shadow-lg flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
                      {rel.thumbnail_url ? (
                        <img
                          src={rel.thumbnail_url}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center p-4">
                          <span className="text-white text-xs font-bold text-center line-clamp-2">
                            {rel.title}
                          </span>
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-black/60 text-white backdrop-blur-md">
                        {rel.format_badge}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
                          {rel.category}
                        </span>
                        <h3 className="text-sm font-bold text-neutral-950 group-hover:text-emerald-700 transition-colors line-clamp-2 mt-1">
                          {rel.title}
                        </h3>
                      </div>

                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-sm font-black text-neutral-950">
                          {relPrice === 0 ? 'FREE' : `₹${relPrice.toLocaleString('en-IN')}`}
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          <span>View Guide</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </main>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-xs" onClick={() => setShowShareModal(false)} />
          <div className="relative w-full max-w-sm bg-white border border-neutral-200 rounded-2xl shadow-2xl p-5 z-10 space-y-4 animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-black text-neutral-950 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-600" />
                Share this Resource
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-4 gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors text-center"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle className="w-4 h-4 fill-current" />
                </div>
                <span className="text-[10px] font-semibold">WhatsApp</span>
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors text-center"
              >
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-xs">
                  <Twitter className="w-4 h-4 fill-current" />
                </div>
                <span className="text-[10px] font-semibold">X / Twitter</span>
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-center"
              >
                <div className="w-8 h-8 rounded-full bg-[#0077b5] text-white flex items-center justify-center shadow-xs">
                  <Linkedin className="w-4 h-4 fill-current" />
                </div>
                <span className="text-[10px] font-semibold">LinkedIn</span>
              </a>

              <a
                href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors text-center"
              >
                <div className="w-8 h-8 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-xs">
                  <Send className="w-4 h-4 fill-current" />
                </div>
                <span className="text-[10px] font-semibold">Telegram</span>
              </a>
            </div>

            {/* Direct Link Copy Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-semibold text-neutral-500">Direct Page Link</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={pageUrl}
                  className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-700 font-mono select-all outline-none"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'
                  }`}
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        allProducts={allProducts}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <Footer />
    </div>
  )
}

export function ProductShowcaseClient(props: ProductShowcaseClientProps) {
  return (
    <StoreCartProvider>
      <StoreFavoritesProvider>
        <ShowcaseContent {...props} />
      </StoreFavoritesProvider>
    </StoreCartProvider>
  )
}
