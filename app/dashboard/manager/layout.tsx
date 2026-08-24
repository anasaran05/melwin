'use client';

import React, { useState } from 'react';
import { ManagerSidebar } from '@/components/dashboard/manager-sidebar';
import { Menu, X, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans antialiased">
      
      {/* 1. MOBILE TOP HEADER (Hidden on Desktop md:hidden) */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo-2.png" alt="Dr. Melwin Logo" className="h-6 w-auto object-contain" />
          <div className="border-l border-slate-200 pl-2.5">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1">
              Admin Console
              <ShieldCheck className="w-3 h-3 text-indigo-600" />
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* 2. MOBILE DRAWER SLIDE-OVER (Hidden on Desktop) */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200" 
            onClick={() => setIsMobileNavOpen(false)}
          />
          {/* Slide-out Sidebar */}
          <div className="relative z-10 w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
            <ManagerSidebar onClose={() => setIsMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. DESKTOP SIDEBAR (Untouched, hidden on mobile, visible on md+) */}
      <aside className="hidden md:flex w-72 shrink-0 min-h-screen">
        <ManagerSidebar />
      </aside>

      {/* 4. MAIN CONTENT CONTAINER */}
      <main className="flex-1 overflow-y-auto min-w-0 w-full p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 bg-slate-50">
        {children}
      </main>
    </div>
  );
}
