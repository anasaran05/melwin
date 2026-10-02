'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { StoreProductItem } from '@/lib/supabase/store'

export interface StoreCartItem {
  id: string
  slug: string
  title: string
  format: string
  regularPrice: number
  salePrice?: number | null
  price: number
  thumbnailUrl?: string | null
}

export interface StoreCartContextType {
  items: StoreCartItem[]
  isLoaded: boolean
  itemCount: number
  totalAmount: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  addItem: (product: StoreProductItem, effectivePrice?: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  isInCart: (productId: string) => boolean
}

const STORAGE_KEY = 'melwin_store_cart'
const EVENT_KEY = 'melwin_store_cart_change'

const StoreCartContext = createContext<StoreCartContextType | null>(null)

export function StoreCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<StoreCartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const loadFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      } else {
        setItems([])
      }
    } catch (_) {}
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    loadFromStorage()

    const handleStorageChange = () => {
      loadFromStorage()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(EVENT_KEY, handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(EVENT_KEY, handleStorageChange)
    }
  }, [loadFromStorage])

  const notifyChange = (updated: StoreCartItem[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        // Defer dispatch out of the current React render/state-reducer cycle
        setTimeout(() => {
          window.dispatchEvent(new Event(EVENT_KEY))
        }, 0)
      } catch (_) {}
    }
  }

  const addItem = useCallback(
    (product: StoreProductItem, effectivePrice?: number) => {
      setItems((prev) => {
        const exists = prev.some((i) => i.id === product.id || i.slug === product.slug)
        if (exists) return prev

        const priceToCharge =
          effectivePrice !== undefined
            ? effectivePrice
            : product.sale_price && product.sale_price > 0
            ? product.sale_price
            : product.regular_price

        const newItem: StoreCartItem = {
          id: product.id,
          slug: product.slug,
          title: product.title,
          format: product.format_badge,
          regularPrice: product.regular_price,
          salePrice: product.sale_price,
          price: priceToCharge,
          thumbnailUrl: product.thumbnail_url,
        }

        const updated = [...prev, newItem]
        notifyChange(updated)
        return updated
      })
    },
    []
  )

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== productId && i.slug !== productId)
      notifyChange(updated)
      return updated
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY)
        setTimeout(() => {
          window.dispatchEvent(new Event(EVENT_KEY))
        }, 0)
      } catch (_) {}
    }
  }, [])

  const isInCart = useCallback(
    (productId: string) => {
      return items.some((i) => i.id === productId || i.slug === productId)
    },
    [items]
  )

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)

  return (
    <StoreCartContext.Provider
      value={{
        items,
        isLoaded,
        itemCount: items.length,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </StoreCartContext.Provider>
  )
}

/**
 * useStoreCart Hook
 * Uses StoreCartContext when available, or falls back to local instance with safe deferred events.
 */
export function useStoreCart(): StoreCartContextType {
  const context = useContext(StoreCartContext)
  if (context) {
    return context
  }

  // Fallback for components rendered outside StoreCartProvider
  const [items, setItems] = useState<StoreCartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const loadFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      } else {
        setItems([])
      }
    } catch (_) {}
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    loadFromStorage()

    const handleStorageChange = () => {
      loadFromStorage()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener(EVENT_KEY, handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(EVENT_KEY, handleStorageChange)
    }
  }, [loadFromStorage])

  const notifyChange = (updated: StoreCartItem[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        setTimeout(() => {
          window.dispatchEvent(new Event(EVENT_KEY))
        }, 0)
      } catch (_) {}
    }
  }

  const addItem = useCallback(
    (product: StoreProductItem, effectivePrice?: number) => {
      setItems((prev) => {
        const exists = prev.some((i) => i.id === product.id || i.slug === product.slug)
        if (exists) return prev

        const priceToCharge =
          effectivePrice !== undefined
            ? effectivePrice
            : product.sale_price && product.sale_price > 0
            ? product.sale_price
            : product.regular_price

        const newItem: StoreCartItem = {
          id: product.id,
          slug: product.slug,
          title: product.title,
          format: product.format_badge,
          regularPrice: product.regular_price,
          salePrice: product.sale_price,
          price: priceToCharge,
          thumbnailUrl: product.thumbnail_url,
        }

        const updated = [...prev, newItem]
        notifyChange(updated)
        return updated
      })
    },
    []
  )

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== productId && i.slug !== productId)
      notifyChange(updated)
      return updated
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY)
        setTimeout(() => {
          window.dispatchEvent(new Event(EVENT_KEY))
        }, 0)
      } catch (_) {}
    }
  }, [])

  const isInCart = useCallback(
    (productId: string) => {
      return items.some((i) => i.id === productId || i.slug === productId)
    },
    [items]
  )

  const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0)

  return {
    items,
    isLoaded,
    itemCount: items.length,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
    addItem,
    removeItem,
    clearCart,
    isInCart,
  }
}
