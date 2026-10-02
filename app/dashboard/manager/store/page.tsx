'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Upload,
  Loader2,
  IndianRupee,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Tag,
  ArrowUpRight,
  Filter,
  Check,
  X,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'

interface AdminProduct {
  id: string
  slug: string
  title: string
  subtitle?: string | null
  description: string
  category: string
  product_type: string
  format_badge: string
  regular_price: number
  sale_price?: number | null
  bmf_discount_percent: number
  is_free_public: boolean
  is_free_for_bmf: boolean
  is_exclusive: boolean
  show_in_public_store: boolean
  show_in_bmf_club: boolean
  highlights: string[]
  asset_url?: string | null
  preview_url?: string | null
  thumbnail_url?: string | null
  author_name: string
  sales_count: number
  purchase_units?: number
  paid_units?: number
  free_units?: number
  revenue_generated?: number
  is_published: boolean
  display_order: number
}

interface AdminOrder {
  id: string
  order_id: string
  customer_name: string
  customer_email: string
  customer_phone?: string | null
  order_amount: number
  currency: string
  status: string
  channel: string
  created_at: string
  items?: Array<{ title?: string; price?: number }>
}

const CATEGORIES = [
  'Fundraising',
  'Growth',
  'Legal & Grants',
  'Operations',
  'AI & Prompts',
  'Templates',
  'E-Books',
]

const FORMAT_OPTIONS = [
  'PDF Guide',
  'Google Sheets',
  'Notion Workspace',
  'Figma + Keynote',
  '1080p Video',
  'Editable Legal Docx',
]

export default function ManagerStoreDashboardPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingAsset, setIsUploadingAsset] = useState(false)
  const [isUploadingThumb, setIsUploadingThumb] = useState(false)

  // Form State
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Growth',
    product_type: 'playbook',
    format_badge: 'PDF Guide',
    regular_price: 999,
    sale_price: '',
    bmf_discount_percent: 50,
    is_free_public: false,
    is_free_for_bmf: false,
    is_exclusive: false,
    show_in_public_store: true,
    show_in_bmf_club: true,
    highlightsString: '',
    asset_url: '',
    preview_url: '',
    thumbnail_url: '',
    author_name: 'Build With Melwin',
    is_published: true,
    display_order: 1,
  })

  // Load Products & Orders
  const loadData = async () => {
    setIsLoading(true)
    try {
      const [prodRes, orderRes] = await Promise.all([
        fetch('/api/store/admin-products'),
        fetch('/api/store/admin-orders'),
      ])

      const prodData = await prodRes.json()
      const orderData = await orderRes.json()

      if (prodData.success) setProducts(prodData.products || [])
      if (orderData.success) setOrders(orderData.orders || [])
    } catch (err) {
      console.error('[Manager Store] Error loading data:', err)
      toast.error('Failed to load store data.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Metrics
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + (Number(o.order_amount) || 0), 0)
  }, [orders])

  const totalUnitsPurchased = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.purchase_units ?? p.sales_count ?? 0), 0)
  }, [products])

  const openCreateModal = () => {
    setEditingProduct(null)
    setForm({
      title: '',
      subtitle: '',
      description: '',
      category: 'Growth',
      product_type: 'playbook',
      format_badge: 'PDF Guide',
      regular_price: 999,
      sale_price: '',
      bmf_discount_percent: 50,
      is_free_public: false,
      is_free_for_bmf: false,
      is_exclusive: false,
      show_in_public_store: true,
      show_in_bmf_club: true,
      highlightsString: '',
      asset_url: '',
      preview_url: '',
      thumbnail_url: '',
      author_name: 'Build With Melwin',
      is_published: true,
      display_order: products.length + 1,
    })
    setIsModalOpen(true)
  }

  const openEditModal = (p: AdminProduct) => {
    setEditingProduct(p)
    setForm({
      title: p.title,
      subtitle: p.subtitle || '',
      description: p.description,
      category: p.category,
      product_type: p.product_type,
      format_badge: p.format_badge,
      regular_price: p.regular_price,
      sale_price: p.sale_price ? String(p.sale_price) : '',
      bmf_discount_percent: p.bmf_discount_percent || 50,
      is_free_public: Boolean(p.is_free_public),
      is_free_for_bmf: Boolean(p.is_free_for_bmf),
      is_exclusive: Boolean(p.is_exclusive),
      show_in_public_store: p.show_in_public_store !== false,
      show_in_bmf_club: p.show_in_bmf_club !== false,
      highlightsString: Array.isArray(p.highlights) ? p.highlights.join('\n') : '',
      asset_url: p.asset_url || '',
      preview_url: p.preview_url || '',
      thumbnail_url: p.thumbnail_url || '',
      author_name: p.author_name || 'Build With Melwin',
      is_published: p.is_published !== false,
      display_order: p.display_order || 1,
    })
    setIsModalOpen(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Product title is required.')
      return
    }

    setIsSaving(true)
    try {
      const action = editingProduct ? 'update' : 'create'
      const highlights = form.highlightsString
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean)

      const payload = {
        ...form,
        highlights,
        sale_price: form.sale_price ? Number(form.sale_price) : null,
      }

      const res = await fetch('/api/store/admin-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          productId: editingProduct?.id,
          product: payload,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save asset.')
      }

      toast.success(editingProduct ? 'Asset updated successfully!' : 'New asset published!')
      setIsModalOpen(false)
      loadData()
    } catch (err: any) {
      toast.error(err.message || 'Error saving product.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      const res = await fetch('/api/store/admin-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', productId: id }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Asset deleted.')
        loadData()
      }
    } catch (_) {
      toast.error('Failed to delete asset.')
    }
  }

  // Upload Asset File to R2
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'asset' | 'thumb') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === 'asset') setIsUploadingAsset(true)
    else setIsUploadingThumb(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'events')

      const res = await fetch('/api/bmf/upload-media', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success && data.url) {
        if (type === 'asset') {
          setForm((prev) => ({ ...prev, asset_url: data.url }))
          toast.success('Asset uploaded to Cloudflare R2!')
        } else {
          setForm((prev) => ({ ...prev, thumbnail_url: data.url }))
          toast.success('Thumbnail uploaded to Cloudflare R2!')
        }
      } else {
        toast.error(data.error || 'Upload failed.')
      }
    } catch (_) {
      toast.error('File upload error.')
    } finally {
      if (type === 'asset') setIsUploadingAsset(false)
      else setIsUploadingThumb(false)
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchCat = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-8 select-none">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              STORE MANAGEMENT
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Digital Store & Asset Vault
          </h1>
          <p className="text-xs text-neutral-400">
            Publish playbooks, set pricing, upload R2 assets, and manage multi-channel distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/store"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Live /store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Asset</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-xs text-neutral-400 font-medium">Total Store Revenue</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-400">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Processed securely via Cashfree</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-xs text-neutral-400 font-medium">Total Units Purchased</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">
              {totalUnitsPurchased}
            </span>
            <span className="text-xs font-semibold text-neutral-400">units</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Aggregated across all store assets</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-xs text-neutral-400 font-medium">Completed Orders</span>
          <div className="mt-1 text-2xl font-black text-white">
            {orders.filter((o) => o.status === 'paid').length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Across Public Store & BMF Club</p>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <span className="text-xs text-neutral-400 font-medium">Active Store Products</span>
          <div className="mt-1 text-2xl font-black text-white">
            {products.filter((p) => p.is_published).length} / {products.length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Published in live catalog</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'products'
              ? 'border-emerald-500 text-white'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Digital Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'border-emerald-500 text-white'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* Tab 1: Products List */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900/80 border border-neutral-800 focus:border-neutral-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              <span className="text-[11px] text-neutral-500 shrink-0 font-medium mr-1">Category:</span>
              {['All', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-900/80 text-neutral-400 font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-3.5">Asset</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Format</th>
                    <th className="p-3.5">Pricing</th>
                    <th className="p-3.5">Channels</th>
                    <th className="p-3.5">Purchase Units</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-850">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="p-3.5 max-w-xs">
                        <div className="font-bold text-white leading-tight">{p.title}</div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">
                          /{p.slug}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-300">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-neutral-300">{p.format_badge}</td>
                      <td className="p-3.5">
                        <div className="font-black text-emerald-400">
                          ₹{(p.sale_price || p.regular_price).toLocaleString('en-IN')}
                        </div>
                        {p.sale_price && (
                          <div className="text-[10px] text-neutral-500 line-through">
                            ₹{p.regular_price.toLocaleString('en-IN')}
                          </div>
                        )}
                        <div className="text-[10px] text-amber-400 font-medium">
                          BMF: {p.bmf_discount_percent}% off
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1">
                          {p.show_in_public_store && (
                            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> Public Store
                            </span>
                          )}
                          {p.show_in_bmf_club && (
                            <span className="text-[10px] text-sky-400 font-medium flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> BMF Club
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-white">
                            {p.purchase_units ?? p.sales_count ?? 0}
                          </span>
                          <span className="text-[11px] font-semibold text-neutral-400">
                            {(p.purchase_units ?? p.sales_count ?? 0) === 1 ? 'unit' : 'units'}
                          </span>
                        </div>
                        {(p.purchase_units ?? p.sales_count ?? 0) > 0 ? (
                          <div className="text-[10px] mt-0.5">
                            {(p.revenue_generated || 0) > 0 ? (
                              <span className="text-emerald-400 font-semibold">
                                ₹{(p.revenue_generated || 0).toLocaleString('en-IN')} rev
                              </span>
                            ) : (
                              <span className="text-sky-400 font-medium">Free claims</span>
                            )}
                            {p.paid_units !== undefined &&
                              p.free_units !== undefined &&
                              p.paid_units > 0 &&
                              p.free_units > 0 && (
                                <span className="text-neutral-500 ml-1">
                                  ({p.paid_units} paid · {p.free_units} free)
                                </span>
                              )}
                          </div>
                        ) : (
                          <div className="text-[10px] text-neutral-600 mt-0.5">0 units</div>
                        )}
                      </td>
                      <td className="p-3.5">
                        {p.is_published ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                            Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-400">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                            title="Edit Asset"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Orders List */}
      {activeTab === 'orders' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/80 text-neutral-400 font-semibold border-b border-neutral-800">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Purchased Asset(s)</th>
                  <th className="p-3.5">Channel</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] text-white">{o.order_id}</td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{o.customer_name}</div>
                      <div className="text-[10px] text-neutral-400">{o.customer_email}</div>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-neutral-300">
                      {Array.isArray(o.items) && o.items.length > 0
                        ? o.items.map((i) => i.title || 'Digital Asset').join(', ')
                        : 'Digital Asset'}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-300">
                        {o.channel === 'public_store' ? 'Public Store' : 'BMF Club'}
                      </span>
                    </td>
                    <td className="p-3.5 font-black text-emerald-400">
                      ₹{o.order_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'paid'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-neutral-500 text-[11px]">
                      {new Date(o.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 text-white animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  {editingProduct ? 'Edit Digital Asset' : 'Publish New Digital Asset'}
                </h3>
                <p className="text-xs text-neutral-400">
                  Configure asset details, Cloudflare R2 downloads, and pricing.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Title & Subtitle */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300">Asset Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tamil Nadu Angel Syndicate Pitch Deck"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 outline-none mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300">Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Figma + Keynote + Pitch Script"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-600 outline-none mt-1"
                  />
                </div>
              </div>

              {/* Category & Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 text-xs text-white outline-none mt-1"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300">Format Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. PDF Guide, Google Sheets, Notion OS"
                    value={form.format_badge}
                    onChange={(e) => setForm({ ...form, format_badge: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 text-xs text-white outline-none mt-1"
                  />
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-3">
                <span className="text-xs font-bold text-neutral-200">Pricing & Discounts</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400">Regular Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={form.regular_price}
                      onChange={(e) => setForm({ ...form, regular_price: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-400">Sale Price (₹ optional)</label>
                    <input
                      type="number"
                      placeholder="e.g. 999"
                      value={form.sale_price}
                      onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-neutral-400">BMF Member Discount (%)</label>
                    <input
                      type="number"
                      value={form.bmf_discount_percent}
                      onChange={(e) => setForm({ ...form, bmf_discount_percent: Number(e.target.value) })}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Asset URL & Cloudflare R2 Upload */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">
                  Asset File Download Link (PDF, ZIP, Notion, Drive) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="https://... or upload below"
                    value={form.asset_url}
                    onChange={(e) => setForm({ ...form, asset_url: e.target.value })}
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                  <label className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shrink-0">
                    {isUploadingAsset ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload R2</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'asset')}
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-neutral-300">Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed breakdown of what founders get..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-xl p-3 text-xs text-white placeholder:text-neutral-600 outline-none mt-1"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="text-xs font-semibold text-neutral-300">
                  Key Takeaways / Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Slide-by-slide commentary&#10;Founder vesting cliff simulator&#10;Ready-to-use email sequences"
                  value={form.highlightsString}
                  onChange={(e) => setForm({ ...form, highlightsString: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-600 rounded-xl p-3 text-xs text-white placeholder:text-neutral-600 outline-none mt-1"
                />
              </div>

              {/* Channel Distribution Toggles */}
              <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-2">
                <span className="text-xs font-bold text-neutral-200">Channel Visibility</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.show_in_public_store}
                      onChange={(e) => setForm({ ...form, show_in_public_store: e.target.checked })}
                      className="rounded accent-emerald-500"
                    />
                    <span>Show in Public Store (/store)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.show_in_bmf_club}
                      onChange={(e) => setForm({ ...form, show_in_bmf_club: e.target.checked })}
                      className="rounded accent-emerald-500"
                    />
                    <span>Show in BMF Club (/bmf-club/store)</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                      className="rounded accent-emerald-500"
                    />
                    <span>Is Published & Active</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? 'Save Changes' : 'Publish Asset'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
