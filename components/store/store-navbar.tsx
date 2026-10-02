'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useStoreCart } from '@/hooks/use-store-cart'
import { useStoreFavorites } from '@/hooks/use-store-favorites'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'
import {
  ShoppingBag,
  Heart,
  Download,
  ArrowLeft,
  User,
  LogOut,
} from 'lucide-react'

interface StoreNavbarProps {
  searchQuery?: string
  onSearchChange?: (q: string) => void
  onOpenCart: () => void
  onOpenFavorites: () => void
}

export function StoreNavbar({
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenFavorites,
}: StoreNavbarProps) {
  const { itemCount } = useStoreCart()
  const { favoriteCount } = useStoreFavorites()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [avatarError, setAvatarError] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = React.useRef<HTMLDivElement>(null)

  const avatarUrl =
    currentUser?.user_metadata?.avatar_url ||
    currentUser?.user_metadata?.picture ||
    currentUser?.identities?.[0]?.identity_data?.avatar_url ||
    currentUser?.identities?.[0]?.identity_data?.picture ||
    null

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
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleSignOut = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        await supabase.auth.signOut()
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem('store_customer_email')
      }
      setCurrentUser(null)
      setShowUserMenu(false)
      window.location.reload()
    } catch (_) {}
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-neutral-200/90 text-neutral-900 shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Home Link */}
        <div className="flex items-center shrink-0 z-10">
          <Link
            href="/"
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors"
            title="Back to Main Site"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>

        {/* Center: Store Brand */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <Link href="/store" className="flex items-center justify-center group" title="Store">
            <img
              src="https://img.icons8.com/stickers/100/shop--v1.png"
              alt="Store"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-xs group-hover:scale-110 transition-transform cursor-pointer"
            />
          </Link>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3 ml-auto z-10">
          <div className="relative" ref={userMenuRef}>
            {currentUser ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 focus:outline-none"
                title={currentUser.email}
              >
                {avatarUrl && !avatarError ? (
                  <img
                    src={avatarUrl}
                    alt={currentUser.user_metadata?.full_name || currentUser.email || 'avatar'}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarError(true)}
                    className="w-9 h-9 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
                    {((currentUser.user_metadata?.full_name || currentUser.email || 'U').charAt(0)).toUpperCase()}
                  </div>
                )}
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs ring-2 ring-white animate-in zoom-in-50">
                    {itemCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-neutral-600" />
                <span>Menu</span>
                {itemCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white border border-neutral-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in-0 zoom-in-95">
                {/* User Info Header or Sign-In Prompt */}
                {currentUser ? (
                  <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-neutral-100">
                    {avatarUrl && !avatarError ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
                        {((currentUser.user_metadata?.full_name || currentUser.email || 'U').charAt(0)).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">
                        {currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Customer'}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate font-mono mt-0.5">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 border-b border-neutral-100 text-left">
                    <p className="text-xs font-bold text-neutral-900">Store</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">Sign in to save items and access downloads</p>
                    <Link
                      href="/store/login?next=/store"
                      onClick={() => setShowUserMenu(false)}
                      className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-neutral-950 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </Link>
                  </div>
                )}

                {/* Dropdown Items: Cart, Favorites, My Purchases */}
                <div className="py-1 space-y-0.5">
                  {/* Shopping Cart */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      onOpenCart()
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </div>
                      <span>Shopping Cart</span>
                    </div>
                    {itemCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400 font-normal">Empty</span>
                    )}
                  </button>

                  {/* Saved Favorites */}
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      onOpenFavorites()
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                        <Heart className="w-3.5 h-3.5" />
                      </div>
                      <span>Saved Favorites</span>
                    </div>
                    {favoriteCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                        {favoriteCount}
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400 font-normal">0</span>
                    )}
                  </button>

                  {/* My Purchases Library Link */}
                  <Link
                    href="/store/purchases"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-neutral-700">
                        <Download className="w-3.5 h-3.5" />
                      </div>
                      <span>My Purchases</span>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400">Library</span>
                  </Link>
                </div>

                {/* Sign Out Footer */}
                {currentUser && (
                  <div className="pt-1 mt-1 border-t border-neutral-100">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
