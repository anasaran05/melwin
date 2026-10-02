'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { StoreProductItem } from '@/lib/supabase/store'
import { useStoreCart, StoreCartProvider } from '@/hooks/use-store-cart'
import { useStoreFavorites, StoreFavoritesProvider } from '@/hooks/use-store-favorites'
import { StoreNavbar } from '@/components/store/store-navbar'
import { CartDrawer } from '@/components/store/cart-drawer'
import { FavoritesModal } from '@/components/store/favorites-modal'
import { ProductPreviewModal } from '@/components/store/product-preview-modal'
import { Footer } from '@/components/footer'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'
import {
  ShoppingBag,
  Sparkles,
  Heart,
  Search,
  Eye,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  X,
} from 'lucide-react'

const CATEGORIES = [
  'All',
  'Fundraising',
  'Growth',
  'Legal & Grants',
  'Operations',
  'Templates',
]

function StoreCatalogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<StoreProductItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('All')

  // Modals & Drawers state
  const { isCartOpen, setIsCartOpen, addItem, isInCart } = useStoreCart()
  const { isFavorite, toggleFavorite } = useStoreFavorites()
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [previewProduct, setPreviewProduct] = useState<StoreProductItem | null>(null)

  // Auth & BMF Membership status for discounts
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isBmfMember, setIsBmfMember] = useState(false)

  // Auto-open cart if returned from Google OAuth checkout
  useEffect(() => {
    if (searchParams.get('openCart') === 'true') {
      setIsCartOpen(true)
    }
  }, [searchParams, setIsCartOpen])

  // 1. Load products from API
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/store/products')
        const data = await res.json()
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products)
        }
      } catch (err) {
        console.error('[Store Page] Error fetching products:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [])

  // 2. Check if logged-in user has active BMF Club discount
  useEffect(() => {
    async function checkMemberStatus() {
      try {
        const supabase = getSupabaseBrowserClient()
        if (!supabase) return
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          setCurrentUser(user)
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
    checkMemberStatus()
  }, [])

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === 'All' ||
        p.category.toLowerCase().includes(activeCategory.toLowerCase())

      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.format_badge.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFormat =
        selectedFormat === 'All' ||
        p.format_badge.toLowerCase().includes(selectedFormat.toLowerCase()) ||
        p.product_type.toLowerCase().includes(selectedFormat.toLowerCase())

      return matchesCategory && matchesSearch && matchesFormat
    })
  }, [products, activeCategory, searchQuery, selectedFormat])

  const handleDirectBuy = (product: StoreProductItem) => {
    addItem(product)
    setPreviewProduct(null)
    setIsCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <StoreNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative pt-8 pb-8 sm:pt-12 sm:pb-10 px-4 sm:px-6 lg:px-8 border-b border-neutral-200/80 bg-white overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-emerald-100/40 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-950 leading-tight">
            Tested Playbooks, Templates & Frameworks
          </h1>

          {/* Member Perk Notice */}
          {isBmfMember && (
            <div className="pt-3">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] sm:text-xs font-semibold shadow-2xs text-left">
                <Zap className="w-3.5 h-3.5 fill-current text-amber-600" />
                <span>BMF Club Founder Pass Active: 50% discount automatically applied to all assets</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Catalog & Filter Controls */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Category Pills & Search Bar Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          {/* Scrollable category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-neutral-950 text-white shadow-md shadow-neutral-950/15'
                    : 'bg-white hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200/90 shadow-2xs'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Side: Search Input & Asset Count */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-full sm:w-64 md:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search playbooks, templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white hover:bg-neutral-50/80 focus:bg-white border border-neutral-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 rounded-xl pl-9 pr-8 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-700 rounded-full cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="text-[11px] sm:text-xs text-neutral-500 font-medium whitespace-nowrap hidden lg:block">
              <span>
                Showing <span className="text-neutral-900 font-bold">{filteredProducts.length}</span> verified assets
              </span>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet asset count & clear query */}
        <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium lg:hidden -mt-2">
          <span>
            Showing <span className="text-neutral-900 font-bold">{filteredProducts.length}</span> verified assets
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-emerald-700 font-bold hover:underline text-xs cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-white border border-neutral-200 animate-pulse shadow-sm"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-neutral-200 shadow-sm p-8">
            <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 mx-auto">
              <Search className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">No assets found</h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
              Try adjusting your category or search query to find relevant playbooks.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All')
                setSearchQuery('')
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const inCart = isInCart(product.id)
              const favorited = isFavorite(product.id)

              let price = product.sale_price || product.regular_price
              if (isBmfMember && product.bmf_discount_percent > 0) {
                price = Math.round(price * (1 - product.bmf_discount_percent / 100))
              }
              if (product.is_free_public || (isBmfMember && product.is_free_for_bmf)) {
                price = 0
              }

              return (
                <div
                  key={product.id}
                  className="group relative rounded-2xl bg-white border border-neutral-200/90 hover:border-neutral-300 transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:shadow-neutral-200/50"
                >
                  <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                    {/* Top Row: Category, Format & Wishlist */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200/80 text-emerald-800">
                          {product.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                          {product.format_badge}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          favorited
                            ? 'bg-red-50 border-red-200 text-red-500'
                            : 'bg-white border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 shadow-2xs'
                        }`}
                        title="Save to favorites"
                      >
                        <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3
                        onClick={() => setPreviewProduct(product)}
                        className="text-base font-bold text-neutral-950 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-2 leading-snug"
                      >
                        {product.title}
                      </h3>
                      {product.subtitle && (
                        <p className="text-[11px] text-neutral-500 mt-1 line-clamp-1 font-medium">
                          {product.subtitle}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Highlights bullets preview */}
                    {Array.isArray(product.highlights) && product.highlights.length > 0 && (
                      <div className="space-y-1.5 pt-3 border-t border-neutral-100">
                        {product.highlights.slice(0, 2).map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-neutral-700 truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Pricing & Actions */}
                  <div className="p-4 sm:p-6 pt-3 sm:pt-3.5 border-t border-neutral-100 bg-neutral-50/60 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-neutral-950">
                          {price === 0 ? 'FREE' : `₹${price.toLocaleString('en-IN')}`}
                        </span>
                        {product.regular_price > price && (
                          <span className="text-xs text-neutral-400 line-through">
                            ₹{product.regular_price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-500 font-medium">Instant Download</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewProduct(product)}
                        className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 border border-neutral-200 shadow-2xs transition-colors cursor-pointer"
                        title="Preview details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDirectBuy(product)}
                        className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-[0.98] shadow-sm shadow-emerald-600/20 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{price === 0 ? 'Claim' : 'Buy Now'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Preview Modal */}
      <ProductPreviewModal
        product={previewProduct}
        isOpen={Boolean(previewProduct)}
        onClose={() => setPreviewProduct(null)}
        onDirectBuy={handleDirectBuy}
        isBmfMember={isBmfMember}
      />

      {/* Cart Drawer (Slider) */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        allProducts={products}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <Footer />
    </div>
  )
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white text-neutral-800 flex items-center justify-center font-sans">Loading Store Vault...</div>}>
      <StoreCartProvider>
        <StoreFavoritesProvider>
          <StoreCatalogContent />
        </StoreFavoritesProvider>
      </StoreCartProvider>
    </Suspense>
  )
}
