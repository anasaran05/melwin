'use client'

import React from 'react'
import { StoreProductItem } from '@/lib/supabase/store'
import { useStoreCart } from '@/hooks/use-store-cart'
import { useStoreFavorites } from '@/hooks/use-store-favorites'
import {
  X,
  ShoppingBag,
  Heart,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'

interface ProductPreviewModalProps {
  product: StoreProductItem | null
  isOpen: boolean
  onClose: () => void
  onDirectBuy: (product: StoreProductItem) => void
  isBmfMember?: boolean
}

export function ProductPreviewModal({
  product,
  isOpen,
  onClose,
  onDirectBuy,
  isBmfMember = false,
}: ProductPreviewModalProps) {
  const { addItem, isInCart } = useStoreCart()
  const { isFavorite, toggleFavorite } = useStoreFavorites()

  if (!isOpen || !product) return null

  const inCart = isInCart(product.id)
  const favorited = isFavorite(product.id)

  const regularPrice = product.regular_price
  let currentPrice = product.sale_price || regularPrice

  if (isBmfMember && product.bmf_discount_percent > 0) {
    currentPrice = Math.round(currentPrice * (1 - product.bmf_discount_percent / 100))
  }
  if (product.is_free_public || (isBmfMember && product.is_free_for_bmf)) {
    currentPrice = 0
  }

  const handleAddToCart = () => {
    addItem(product, currentPrice)
    toast.success(`"${product.title}" added to cart!`)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white border border-neutral-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 text-neutral-900 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 border border-emerald-200/80 text-emerald-800">
              {product.category}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 border border-neutral-200 text-neutral-700">
              {product.format_badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                favorited
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-white border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          <div>
            <h2 className="text-xl font-black text-neutral-950 tracking-tight leading-snug">
              {product.title}
            </h2>
            {product.subtitle && (
              <p className="text-xs text-neutral-500 mt-1 font-medium">{product.subtitle}</p>
            )}
          </div>

          {/* Description */}
          <div className="text-xs text-neutral-700 leading-relaxed space-y-2 whitespace-pre-line bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
            {product.description}
          </div>

          {/* What's Inside / Highlights */}
          {Array.isArray(product.highlights) && product.highlights.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>What&apos;s Included In This Vault Asset</span>
              </h4>
              <div className="space-y-2">
                {product.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Preview Link if available */}
          {product.preview_url && (
            <a
              href={product.preview_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Interactive Preview Sample</span>
            </a>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-neutral-200 bg-neutral-50/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-neutral-950">
                {currentPrice === 0 ? 'FREE' : `₹${currentPrice.toLocaleString('en-IN')}`}
              </span>
              {regularPrice > currentPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{regularPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {isBmfMember && product.bmf_discount_percent > 0 && (
              <p className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                <Zap className="w-3 h-3 fill-current text-amber-600" />
                <span>{product.bmf_discount_percent}% BMF Club Founder Discount Applied</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-300 disabled:opacity-50 text-neutral-800 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{inCart ? 'In Cart' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={() => onDirectBuy(product)}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
            >
              <span>{currentPrice === 0 ? 'Claim Free' : 'Buy Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
