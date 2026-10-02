'use client'

import React from 'react'
import { useStoreFavorites } from '@/hooks/use-store-favorites'
import { useStoreCart } from '@/hooks/use-store-cart'
import { StoreProductItem } from '@/lib/supabase/store'
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface FavoritesModalProps {
  isOpen: boolean
  onClose: () => void
  allProducts: StoreProductItem[]
  onOpenCart?: () => void
}

export function FavoritesModal({ isOpen, onClose, allProducts, onOpenCart }: FavoritesModalProps) {
  const { favoriteIds, toggleFavorite } = useStoreFavorites()
  const { addItem, isInCart } = useStoreCart()

  if (!isOpen) return null

  const favoriteProducts = allProducts.filter((p) => favoriteIds.includes(p.id) || favoriteIds.includes(p.slug))

  const handleMoveToCart = (product: StoreProductItem) => {
    addItem(product)
    toast.success(`"${product.title}" added to cart!`)
    if (onOpenCart) {
      onClose()
      onOpenCart()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 text-neutral-900 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200/80 flex items-center justify-center text-red-500">
              <Heart className="w-4 h-4 fill-red-500/20" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Your Saved Favorites</h3>
              <p className="text-[11px] text-neutral-500 font-medium">
                {favoriteProducts.length} {favoriteProducts.length === 1 ? 'saved asset' : 'saved assets'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-neutral-50/50">
          {favoriteProducts.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 shadow-sm">
                <Heart className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="text-xs font-bold text-neutral-800">No saved assets yet</h4>
              <p className="text-[11px] text-neutral-500 max-w-xs leading-relaxed">
                Click the heart icon on any store card to save playbooks and templates for later.
              </p>
            </div>
          ) : (
            favoriteProducts.map((p) => {
              const inCart = isInCart(p.id)
              const price = p.sale_price || p.regular_price

              return (
                <div
                  key={p.id}
                  className="p-3 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 transition-all shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200 mb-1">
                      {p.format_badge}
                    </span>
                    <h4 className="text-xs font-bold text-neutral-900 truncate">{p.title}</h4>
                    <div className="mt-0.5 flex items-baseline gap-2">
                      <span className="text-xs font-black text-emerald-700">
                        {price === 0 ? 'FREE' : `₹${price.toLocaleString('en-IN')}`}
                      </span>
                      {p.sale_price && p.regular_price > p.sale_price && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          ₹{p.regular_price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleMoveToCart(p)}
                      disabled={inCart}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-100 disabled:text-neutral-400 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>{inCart ? 'In Cart' : 'Add to Cart'}</span>
                    </button>
                    <button
                      onClick={() => toggleFavorite(p.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded-lg hover:bg-neutral-100"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
