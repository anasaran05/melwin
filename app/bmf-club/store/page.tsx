'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getSupabaseBrowserClient } from '@/lib/supabase/bmf-members'
import {
  ShoppingBag,
  Crown,
  Sparkles,
  ArrowLeft,
  Search,
  Download,
  Check,
  Zap,
  Users,
  LayoutDashboard,
  ExternalLink,
  ShieldCheck,
  FileText,
  FileSpreadsheet,
  Video,
  BookOpen,
  Loader2,
  X,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Gift,
} from 'lucide-react'
import { toast } from 'sonner'

export interface BmfProductItem {
  id: string
  title: string
  slug: string
  category: 'Export & Trade' | 'Growth' | 'Legal & Grants' | 'Fundraising' | 'Career' | 'Operations' | 'Ideas & Hustles'
  format: string
  description: string
  highlights: string[]
  regularPrice: number
  premiumPrice: number
  fileType: 'pdf' | 'docx' | 'sheets' | 'notion' | 'video'
  downloadUrl?: string
  isExclusive?: boolean
  isFree?: boolean
}

// Dynamically load Cashfree SDK v3
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

function BmfStoreContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Dynamic store products loaded directly from Supabase database
  const [products, setProducts] = useState<BmfProductItem[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isPremium, setIsPremium] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [purchasedProductIds, setPurchasedProductIds] = useState<Set<string>>(new Set())

  // Direct buy state
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null)

  // 1. Check user auth, premium status & purchased products
  useEffect(() => {
    async function loadUserState() {
      try {
        const supabase = getSupabaseBrowserClient()
        if (!supabase) return

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setCurrentUser(user)
          setBuyerEmail(user.email || '')
          setBuyerName(user.user_metadata?.full_name || user.user_metadata?.name || '')

          // Check if premium member
          const { data: member } = await supabase
            .from('bmf_members')
            .select('role, is_featured, full_name, membership_tier, membership_status')
            .eq('user_id', user.id)
            .maybeSingle()

          const { data: card } = await supabase
            .from('bmf_cards')
            .select('approval_status')
            .eq('user_id', user.id)
            .maybeSingle()

          const userIsPremium = Boolean(
            (member?.membership_tier === 'premium' && member?.membership_status === 'active') ||
            member?.role === 'admin' ||
            member?.is_featured === true ||
            card?.approval_status === 'approved' ||
            (member?.full_name && member.full_name.toLowerCase().includes('melwin'))
          )

          setIsPremium(userIsPremium)

          // Check purchased products
          const { data: purchases } = await supabase
            .from('bmf_product_purchases')
            .select('product_id')
            .eq('user_id', user.id)
            .eq('access_status', 'active')

          if (purchases && purchases.length > 0) {
            setPurchasedProductIds((prev) => {
              const s = new Set(prev)
              purchases.forEach((p) => s.add(p.product_id))
              return s
            })
          }
        }

        // Also load locally persisted purchases and demo member credentials
        if (typeof window !== 'undefined') {
          try {
            const localPurchasesRaw = localStorage.getItem('bmf_purchased_products')
            if (localPurchasesRaw) {
              const localList = JSON.parse(localPurchasesRaw)
              if (Array.isArray(localList)) {
                setPurchasedProductIds((prev) => {
                  const s = new Set(prev)
                  localList.forEach((item: any) => {
                    if (item.id) s.add(item.id)
                    if (item.slug) s.add(item.slug)
                    if (item.product_id) s.add(item.product_id)
                  })
                  return s
                })
              }
            }

            const storedMember = localStorage.getItem('bmf_current_member')
            const demoEmail = localStorage.getItem('bmf_current_user_email')
            if (demoEmail) setBuyerEmail((prev) => prev || demoEmail)
            if (storedMember) {
              const parsed = JSON.parse(storedMember)
              if (parsed.full_name) setBuyerName((prev) => prev || parsed.full_name)
              if (parsed.email) setBuyerEmail((prev) => prev || parsed.email)
              if (
                parsed.membership_tier === 'premium' ||
                parsed.role === 'admin' ||
                parsed.is_featured === true ||
                (parsed.full_name && parsed.full_name.toLowerCase().includes('melwin'))
              ) {
                setIsPremium(true)
              }
            }
          } catch (_) {}
        }

        // Fetch dynamic products from API endpoint or directly from Supabase bmf_products
        try {
          const res = await fetch('/api/bmf/products')
          const json = await res.json()
          if (json.success && Array.isArray(json.products) && json.products.length > 0) {
            setProducts(json.products)
          } else {
            // Fallback: direct Supabase query
            const { data: dbProducts, error: prodErr } = await supabase
              .from('bmf_products')
              .select('*')
              .eq('is_published', true)
              .order('display_order', { ascending: true })

            if (!prodErr && dbProducts && dbProducts.length > 0) {
              const mapped: BmfProductItem[] = dbProducts.map((p) => {
                const parsedReg = Number(p.regular_price ?? p.price_inr ?? p.price ?? 99)
                const regPrice = isNaN(parsedReg) ? 99 : parsedReg
                const discountPercent = Number(p.premium_discount_percent ?? 50)
                const calculatedPrem =
                  regPrice === 0 ? 0 : Math.round(regPrice * (1 - (isNaN(discountPercent) ? 50 : discountPercent) / 100))
                const parsedPrem = Number(p.discounted_price_inr ?? p.premium_price ?? calculatedPrem)
                const premPrice = regPrice === 0 ? 0 : isNaN(parsedPrem) ? 49 : parsedPrem

                return {
                  id: p.id,
                  slug: p.slug || p.id,
                  title: p.title,
                  category: p.category || 'Growth',
                  format: p.format_badge || p.format || 'PDF Guide',
                  description: p.description || '',
                  highlights: Array.isArray(p.highlights) ? p.highlights : [],
                  regularPrice: regPrice,
                  premiumPrice: premPrice,
                  fileType: (p.product_type as any) || (p.file_type as any) || 'pdf',
                  downloadUrl: p.asset_url || p.download_url,
                  isExclusive: p.is_exclusive ?? false,
                  isFree: regPrice === 0,
                }
              })
              setProducts(mapped)
            }
          }
        } catch (fetchErr) {
          console.warn('[BMF Store] Error fetching products:', fetchErr)
        } finally {
          setIsLoadingProducts(false)
        }
      } catch (err) {
        console.warn('[BMF Store] Error initializing store data:', err)
        setIsLoadingProducts(false)
      }
    }

    loadUserState()
  }, [])

  // 2. Handle return redirect from Cashfree with order_id
  useEffect(() => {
    const orderId = searchParams.get('order_id')
    const status = searchParams.get('status')
    const productId = searchParams.get('product_id')

    if (orderId && (status === 'success' || !status)) {
      verifyStoreOrder(orderId, productId)
    }
  }, [searchParams])

  const verifyStoreOrder = async (orderId: string, productId?: string | null) => {
    try {
      const res = await fetch('/api/cashfree/verify-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success('Payment verified! Taking you to your purchased assets...')
        router.replace('/bmf-club/dashboard?tab=purchases')
      }
    } catch (err) {
      console.warn('[BMF Store] Order verification check error:', err)
    }
  }

  // 3. Handle Claiming a Free Asset (₹0)
  const handleClaimFree = async (product: BmfProductItem) => {
    const purchaseRecord = {
      id: product.id,
      product_id: product.id,
      slug: product.slug,
      title: product.title,
      category: product.category,
      format: product.format,
      format_badge: product.format,
      description: product.description,
      downloadUrl: product.downloadUrl,
      asset_url: product.downloadUrl,
      regularPrice: product.regularPrice,
      amount_paid: 0,
      unlocked_at: new Date().toISOString(),
      access_status: 'active',
      product: {
        id: product.id,
        title: product.title,
        category: product.category,
        format_badge: product.format,
        description: product.description,
        asset_url: product.downloadUrl,
        download_url: product.downloadUrl,
      },
    }

    // Resolve customer email reliably from current user or local storage
    let resolvedEmail = buyerEmail || currentUser?.email
    if (!resolvedEmail && typeof window !== 'undefined') {
      resolvedEmail = localStorage.getItem('bmf_current_user_email') || ''
      if (!resolvedEmail) {
        const stored = localStorage.getItem('bmf_current_member')
        if (stored) {
          try {
            resolvedEmail = JSON.parse(stored).email || ''
          } catch (_) {}
        }
      }
    }
    if (!resolvedEmail) resolvedEmail = 'buildwithmelwin@gmail.com'

    // Persist immediately in localStorage so dashboard can display it instantly
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('bmf_purchased_products')
        const list = raw ? JSON.parse(raw) : []
        const filtered = list.filter((p: any) => p.slug !== product.slug && p.id !== product.id)
        const updated = [purchaseRecord, ...filtered]
        localStorage.setItem('bmf_purchased_products', JSON.stringify(updated))
        window.dispatchEvent(new Event('storage'))
      } catch (e) {
        console.warn('LocalStorage save error:', e)
      }
    }

    // Async record in Supabase database
    try {
      fetch('/api/bmf/claim-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productSlug: product.slug,
          title: product.title,
          description: product.description,
          category: product.category,
          format_badge: product.format,
          asset_url: product.downloadUrl,
          userId: currentUser?.id,
          customerEmail: resolvedEmail,
          amountPaid: 0,
          discountPercent: 100,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('[BMF Store] Claim recorded in database:', data)
        })
        .catch((err) => {
          console.warn('[BMF Store] Claim sync notice:', err)
        })
    } catch (_) {}

    setPurchasedProductIds((prev) => new Set([...Array.from(prev), product.id, product.slug]))
    toast.success(`"${product.title}" unlocked! Opening your purchased assets...`)
    router.push('/bmf-club/dashboard?tab=purchases')
  }

  // 4. Initiate Product Action (Buy, Download, or Claim Free)
  const handleProductAction = async (product: BmfProductItem) => {
    // If already owned, give access immediately
    if (purchasedProductIds.has(product.id) || purchasedProductIds.has(product.slug)) {
      openAssetLink(product)
      return
    }

    // If item is 100% Free:
    if (product.isFree || product.regularPrice === 0) {
      handleClaimFree(product)
      return
    }

    // Direct Cashfree checkout without intermediate popup
    await handleDirectBuy(product)
  }

  const openAssetLink = (product: BmfProductItem) => {
    if (product.downloadUrl) {
      window.open(product.downloadUrl, '_blank', 'noopener,noreferrer')
    } else {
      toast.info(`Access link for ${product.title} will open in a new tab`)
    }
  }

  // 5. Direct Cashfree Checkout for Paid Product
  const handleDirectBuy = async (product: BmfProductItem) => {
    if (loadingProductId) return

    setLoadingProductId(product.id)

    // Resolve customer email reliably from state, user or local storage
    let emailToUse = buyerEmail || currentUser?.email
    if (!emailToUse && typeof window !== 'undefined') {
      emailToUse = localStorage.getItem('bmf_current_user_email') || ''
      if (!emailToUse) {
        const stored = localStorage.getItem('bmf_current_member')
        if (stored) {
          try {
            emailToUse = JSON.parse(stored).email || ''
          } catch (_) {}
        }
      }
    }
    if (!emailToUse) {
      emailToUse = 'founder@bmfclub.com'
    }

    let nameToUse = buyerName || currentUser?.user_metadata?.full_name || currentUser?.user_metadata?.name || 'BMF Founder'
    if (!buyerName && typeof window !== 'undefined') {
      const stored = localStorage.getItem('bmf_current_member')
      if (stored) {
        try {
          nameToUse = JSON.parse(stored).full_name || nameToUse
        } catch (_) {}
      }
    }

    let phoneToUse = buyerPhone || currentUser?.phone || '9999999999'
    const selectedPrice = product.regularPrice

    try {
      // Step 1: Create or Reuse Order Session via Cashfree
      const res = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType: 'product',
          productId: product.id,
          productSlug: product.slug,
          productTitle: product.title,
          productPrice: selectedPrice,
          customerName: nameToUse,
          customerEmail: emailToUse,
          customerPhone: phoneToUse,
        }),
      })

      const data = await res.json()

      // If already purchased, redirect immediately
      if (data.alreadyPurchased) {
        toast.success(`You already own "${product.title}"! Taking you to your dashboard...`)
        setPurchasedProductIds((prev) => new Set([...Array.from(prev), product.id, product.slug]))
        router.push('/bmf-club/dashboard?tab=purchases')
        return
      }

      if (!res.ok || !data.success || !data.paymentSessionId) {
        throw new Error(data.error || 'Failed to initiate payment gateway.')
      }

      if (data.reused) {
        console.log(`[BMF Store] Reused active 15m order session: ${data.orderId}`)
      }

      // Step 2: Open Cashfree Modal Directly
      const CashfreeSdk = await loadCashfreeSdk()
      const envMode = data.environment === 'sandbox' ? 'sandbox' : 'production'
      const cashfreeInstance = CashfreeSdk({ mode: envMode })

      cashfreeInstance.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_modal',
      }).then((result: any) => {
        if (result?.error) {
          toast.error(result.error.message || 'Payment was cancelled or closed.')
          return
        }
        if (result?.paymentDetails) {
          toast.success('Payment successful! Taking you to your purchased assets...')

          const purchaseRecord = {
            id: product.id,
            product_id: product.id,
            order_id: data.orderId,
            slug: product.slug,
            title: product.title,
            category: product.category,
            format: product.format,
            format_badge: product.format,
            description: product.description,
            downloadUrl: product.downloadUrl,
            asset_url: product.downloadUrl,
            regularPrice: product.regularPrice,
            amount_paid: selectedPrice,
            discount_applied_percent: 0,
            unlocked_at: new Date().toISOString(),
            access_status: 'active',
            product: {
              id: product.id,
              title: product.title,
              category: product.category,
              format_badge: product.format,
              description: product.description,
              asset_url: product.downloadUrl,
              download_url: product.downloadUrl,
            },
          }

          if (typeof window !== 'undefined') {
            try {
              const raw = localStorage.getItem('bmf_purchased_products')
              const list = raw ? JSON.parse(raw) : []
              const filtered = list.filter((p: any) => p.slug !== product.slug && p.id !== product.id)
              const updated = [purchaseRecord, ...filtered]
              localStorage.setItem('bmf_purchased_products', JSON.stringify(updated))
              window.dispatchEvent(new Event('storage'))
            } catch (e) {
              console.warn(e)
            }
          }

          setPurchasedProductIds((prev) => new Set([...Array.from(prev), product.id, product.slug]))

          // Verify with backend in background
          fetch('/api/cashfree/verify-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderId }),
          }).catch((err) => console.warn('[Product Checkout] Background verification notice:', err))

          // Directly go to user purchased items page!
          router.push('/bmf-club/dashboard?tab=purchases')
        }
      })
    } catch (err: any) {
      console.error('[Product Checkout] Error:', err)
      toast.error(err.message || 'Payment initiation failed. Please try again.')
    } finally {
      setLoadingProductId(null)
    }
  }

  const categories = ['All', 'Export & Trade', 'Growth', 'Legal & Grants', 'Fundraising', 'Career', 'Ideas & Hustles', 'Free Resources']

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      let matchesCategory = true
      if (activeCategory === 'Free Resources') {
        matchesCategory = product.isFree || product.regularPrice === 0
      } else if (activeCategory !== 'All') {
        matchesCategory = product.category === activeCategory
      }

      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, activeCategory, searchQuery])

  const getFormatIcon = (fileType: string) => {
    switch (fileType) {
      case 'docx':
        return <FileText className="w-3.5 h-3.5 text-blue-600" />
      case 'sheets':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
      case 'video':
        return <Video className="w-3.5 h-3.5 text-rose-500" />
      default:
        return <BookOpen className="w-3.5 h-3.5 text-amber-600" />
    }
  }

  return (
    <main className="font-sans min-h-screen bg-[#fbfbfb] text-[#111111] relative overflow-x-hidden selection:bg-amber-100 selection:text-amber-900">
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[380px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/[0.07] via-transparent to-transparent pointer-events-none" />
      <div className="grain-overlay" />

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-24 relative z-10">
        {/* Top Header Navigation Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <Link
              href="/bmf-club"
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to BMF Club
            </Link>
            <span className="text-stone-300">/</span>
            <span className="text-xs text-stone-900 font-semibold flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600" /> Store
            </span>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/bmf-club/dashboard?tab=purchases"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-50 hover:border-stone-300 text-xs font-semibold shadow-2xs transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-stone-500" />
              <span>My Purchases & Library</span>
            </Link>

            <Link
              href="/bmf-club#join"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-2xs transition-all"
            >
              <Users className="w-3.5 h-3.5 text-stone-300" />
              <span>Join Free Community</span>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-stone-200/80 pb-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-950 tracking-tight leading-[1.12]">
              Digital Playbooks, Models & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700">
                Executive Blueprints
              </span>
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed">
              Real export frameworks, government grant checklists, cold outreach templates, and startup revenue playbooks. Instant digital downloads and execution blueprints.
            </p>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-stone-950 text-white shadow-2xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100/80 border border-stone-200'
                }`}
              >
                {cat === 'All' ? 'All Assets' : cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search playbooks, exports, grants..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        {isLoadingProducts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-7 shadow-xs h-[300px] animate-pulse"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-24 bg-stone-100 rounded-full" />
                    <div className="h-5 w-20 bg-stone-100 rounded-full" />
                  </div>
                  <div className="h-6 w-3/4 bg-stone-200 rounded-xl mb-3" />
                  <div className="space-y-2 mb-4">
                    <div className="h-3.5 w-full bg-stone-100 rounded-md" />
                    <div className="h-3.5 w-4/5 bg-stone-100 rounded-md" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3 w-2/3 bg-stone-100 rounded-md" />
                    <div className="h-3 w-1/2 bg-stone-100 rounded-md" />
                  </div>
                </div>
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="h-7 w-20 bg-stone-200 rounded-lg" />
                  <div className="h-9 w-28 bg-stone-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map((product) => {
              const isOwned = purchasedProductIds.has(product.id)
              const isFreeResource = product.isFree || product.regularPrice === 0
              const displayPrice = isPremium ? product.premiumPrice : product.regularPrice

              return (
                <div
                  key={product.id}
                  className="flex flex-col justify-between rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all hover:border-stone-300 relative overflow-hidden group"
                >
                  <div>
                    {/* Top Category & Format Tag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold">
                        {product.category}
                      </span>
                      <div className="flex items-center gap-2">
                        {isFreeResource && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Free Resource
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-stone-500">
                          {getFormatIcon(product.fileType)}
                          <span>{product.format}</span>
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-stone-950 tracking-tight mb-2 group-hover:text-amber-950 transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-stone-600 text-xs leading-relaxed mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Highlights bullets */}
                    {product.highlights && product.highlights.length > 0 && (
                      <ul className="space-y-1.5 mb-6">
                        {product.highlights.slice(0, 3).map((hl, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-stone-600">
                            <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{hl}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Pricing & CTA Button */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
                    <div>
                      {isOwned ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Added to Dashboard</span>
                        </div>
                      ) : isFreeResource ? (
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-emerald-600">
                              FREE
                            </span>
                          </div>
                          <div className="text-[10px] font-semibold text-emerald-700 mt-0.5">
                            100% Free Community Resource
                          </div>
                        </div>
                      ) : (
                        // Standard Product Price Display
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-stone-950">
                              ₹{product.regularPrice}
                            </span>
                          </div>
                          <div className="text-[10px] font-semibold text-stone-500 mt-0.5">
                            Instant Digital Blueprint
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {isOwned ? (
                      <button
                        type="button"
                        onClick={() => openAssetLink(product)}
                        className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    ) : isFreeResource ? (
                      <button
                        type="button"
                        onClick={() => handleProductAction(product)}
                        className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Get Free Asset</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={loadingProductId === product.id}
                        onClick={() => handleProductAction(product)}
                        className="px-4 py-2.5 rounded-xl font-bold text-xs bg-stone-900 hover:bg-black text-amber-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loadingProductId === product.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                            <span>Opening...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5 text-stone-300" />
                            <span>Buy • ₹{product.regularPrice}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-2xs">
            <ShoppingBag className="w-8 h-8 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-900">No products found</h3>
            <p className="text-xs text-stone-500 mt-1">Try another search query or category filter.</p>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

export default function BmfStorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbfbfb] flex items-center justify-center text-stone-500 font-sans text-xs">
          Loading BMF Store...
        </div>
      }
    >
      <BmfStoreContent />
    </Suspense>
  )
}
