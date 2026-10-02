'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface StoreFavoritesContextType {
  favoriteIds: string[]
  isLoaded: boolean
  favoriteCount: number
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

const STORAGE_KEY = 'melwin_store_favorites'
const EVENT_KEY = 'melwin_store_favorites_change'

const StoreFavoritesContext = createContext<StoreFavoritesContextType | null>(null)

export function StoreFavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const loadFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setFavoriteIds(parsed)
        }
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

  const notifyChange = (updated: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        setTimeout(() => {
          window.dispatchEvent(new Event(EVENT_KEY))
        }, 0)
      } catch (_) {}
    }
  }

  const toggleFavorite = useCallback((productId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(productId)
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId]
      notifyChange(updated)
      return updated
    })
  }, [])

  const isFavorite = useCallback(
    (productId: string) => {
      return favoriteIds.includes(productId)
    },
    [favoriteIds]
  )

  return (
    <StoreFavoritesContext.Provider
      value={{
        favoriteIds,
        isLoaded,
        favoriteCount: favoriteIds.length,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </StoreFavoritesContext.Provider>
  )
}

export function useStoreFavorites(): StoreFavoritesContextType {
  const context = useContext(StoreFavoritesContext)
  if (context) {
    return context
  }

  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  const loadFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setFavoriteIds(parsed)
        }
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

  const notifyChange = (updated: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        setTimeout(() => {
          window.dispatchEvent(new Event(EVENT_KEY))
        }, 0)
      } catch (_) {}
    }
  }

  const toggleFavorite = useCallback((productId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(productId)
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId]
      notifyChange(updated)
      return updated
    })
  }, [])

  const isFavorite = useCallback(
    (productId: string) => {
      return favoriteIds.includes(productId)
    },
    [favoriteIds]
  )

  return {
    favoriteIds,
    isLoaded,
    favoriteCount: favoriteIds.length,
    toggleFavorite,
    isFavorite,
  }
}
