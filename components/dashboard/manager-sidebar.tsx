'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GitFork,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  FolderKanban,
  FileText,
  Film,
  Handshake,
  CreditCard,
  Calendar,
  Ticket,
  Building2,
  Crown,
  ChevronDown,
  Layers,
  Zap,
  Coffee,
  GraduationCap,
  TrendingUp,
  Coins,
  Globe2,
  Briefcase,
  UserCheck,
  ExternalLink,
  Boxes,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ManagerSidebarProps {
  activeClientId?: string;
  onOpenCreateClient?: () => void;
  onClose?: () => void;
}

export function ManagerSidebar({ activeClientId, onOpenCreateClient, onClose }: ManagerSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'showcases';

  // Collapsible section states
  const [isAgencyOpen, setIsAgencyOpen] = useState(true);
  const [isClubOpen, setIsClubOpen] = useState(true);
  const [isServicesOpen, setIsServicesOpen] = useState(true);

  // 1. AGENCY MODULE NAVIGATION
  const agencyNavItems = [
    {
      name: 'Agency Executive Overview',
      href: '/dashboard/manager',
      icon: LayoutDashboard,
      active: pathname === '/dashboard/manager',
    },
    {
      name: 'All Clients Directory',
      href: '/dashboard/manager/clients',
      icon: Users,
      active: pathname.startsWith('/dashboard/manager/clients') && !activeClientId,
    },
    {
      name: '13-Stage Pipeline Branching',
      href: '/dashboard/manager/pipeline',
      icon: GitFork,
      active: pathname === '/dashboard/manager/pipeline',
    },
    {
      name: 'Content Workshop & Script AI',
      href: '/dashboard/manager/content-workshop',
      icon: Sparkles,
      active: pathname === '/dashboard/manager/content-workshop',
    },
    {
      name: 'Published Content Tracker',
      href: '/dashboard/manager/analytics',
      icon: Film,
      active: pathname === '/dashboard/manager/analytics',
    },
  ];

  // 2. BMF FOUNDERS CLUB MODULE NAVIGATION
  const clubNavItems = [
    {
      name: 'Admissions & Showcase Queue',
      href: '/dashboard/manager/bmf-review?tab=showcases',
      icon: Layers,
      active: pathname.includes('/bmf-review') && (currentTab === 'showcases' || !currentTab),
    },
    {
      name: 'Warm Intros Pipeline',
      href: '/dashboard/manager/bmf-review?tab=intros',
      icon: Handshake,
      active: pathname.includes('/bmf-review') && currentTab === 'intros',
    },
    {
      name: 'Executive Metal Pass Cards',
      href: '/dashboard/manager/bmf-review?tab=cards',
      icon: CreditCard,
      active: pathname.includes('/bmf-review') && currentTab === 'cards',
    },
    {
      name: 'Events & Private Retreats',
      href: '/dashboard/manager/bmf-review?tab=events',
      icon: Calendar,
      active: pathname.includes('/bmf-review') && currentTab === 'events',
    },
    {
      name: 'Attendee RSVP Deck',
      href: '/dashboard/manager/bmf-review?tab=registrations',
      icon: Ticket,
      active: pathname.includes('/bmf-review') && currentTab === 'registrations',
    },
  ];

  // 3. SERVICES & CLIENT VENTURES MODULE NAVIGATION
  const servicesNavItems = [
    {
      name: 'Atom SE',
      subtext: 'Innovation Studio',
      href: '/atom-se',
      icon: Zap,
      badge: 'Venture',
      active: pathname.startsWith('/atom-se'),
    },
    {
      name: 'Wocha',
      subtext: 'Consumer Brand',
      href: '/wocha',
      icon: Coffee,
      badge: 'Brand',
      active: pathname.startsWith('/wocha'),
    },
    {
      name: 'Startup Academy',
      subtext: 'Founder Incubation',
      href: '/startup-academy',
      icon: GraduationCap,
      badge: 'Pro',
      active: pathname.startsWith('/startup-academy'),
    },
    {
      name: 'Digital Growth',
      subtext: 'Performance & SEO',
      href: '/digital-growth',
      icon: TrendingUp,
      badge: 'Service',
      active: pathname.startsWith('/digital-growth'),
    },
    {
      name: 'Funding & Grants',
      subtext: 'Capital Advisory',
      href: '/funding-grants',
      icon: Coins,
      badge: 'Advisory',
      active: pathname.startsWith('/funding-grants'),
    },
    {
      name: 'Export-Import',
      subtext: 'Global Trade Hub',
      href: '/export-import',
      icon: Globe2,
      badge: 'Trade',
      active: pathname.startsWith('/export-import'),
    },
    {
      name: 'Business Services',
      subtext: 'Corporate & Legal',
      href: '/business-services',
      icon: Briefcase,
      badge: 'Service',
      active: pathname.startsWith('/business-services'),
    },
    {
      name: 'Jobs & Talent Network',
      subtext: 'Executive Guild',
      href: '/jobs-talent',
      icon: UserCheck,
      badge: 'Network',
      active: pathname.startsWith('/jobs-talent'),
    },
  ];

  // 4. CONTEXTUAL ACTIVE CLIENT NAVIGATION
  const clientNavItems = activeClientId
    ? [
        {
          name: 'Client Hub Overview',
          href: `/dashboard/manager/clients/${activeClientId}`,
          icon: FolderKanban,
          active: pathname === `/dashboard/manager/clients/${activeClientId}`,
        },
        {
          name: '9-Part Brand Blueprint',
          href: `/dashboard/manager/clients/${activeClientId}/onboarding`,
          icon: FileText,
          active: pathname.includes('/onboarding'),
        },
        {
          name: 'Client Pipeline',
          href: `/dashboard/manager/clients/${activeClientId}/pipeline`,
          icon: GitFork,
          active: pathname.includes('/pipeline') && pathname.includes(activeClientId),
        },
        {
          name: 'Client Content Workshop',
          href: `/dashboard/manager/clients/${activeClientId}/content`,
          icon: Sparkles,
          active: pathname.includes('/content') && pathname.includes(activeClientId),
        },
        {
          name: 'Published Content Tracker',
          href: `/dashboard/manager/clients/${activeClientId}/analytics`,
          icon: Film,
          active: pathname.includes('/analytics') && pathname.includes(activeClientId),
        },
      ]
    : [];

  return (
    <aside className="w-72 bg-white border-r border-slate-200/80 min-h-screen flex flex-col justify-between p-4 select-none shrink-0 shadow-sm">
      <div className="space-y-4 overflow-y-auto pr-1">
        {/* Official Header */}
        <div className="flex items-center justify-between gap-2">
          <Link 
            href="/" 
            onClick={onClose}
            className="flex-1 flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-200/80 rounded-xl shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all group"
          >
            <img src="/logo-2.png" alt="Dr. Melwin Logo" className="h-7 w-auto object-contain shrink-0" />
            <div className="border-l border-slate-200 pl-3">
              <h2 className="text-xs font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
                Admin Console
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Multi-Domain Ecosystem</p>
            </div>
          </Link>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Action Button */}
        {onOpenCreateClient && (
          <Button
            onClick={onOpenCreateClient}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/15 rounded-xl flex items-center justify-center gap-2 py-2 text-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Add New Client
          </Button>
        )}

        {/* Active Client Contextual Section */}
        {activeClientId && (
          <div className="space-y-1.5 pt-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-indigo-600 uppercase">
              Active Client Menu
            </div>
            {clientNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                    item.active
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  )}
                >
                  <Icon className={cn('w-4 h-4', item.active ? 'text-indigo-600' : 'text-slate-400')} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* DOMAIN 1: AGENCY OS (Marketing & Client Pipeline)                         */}
        {/* ========================================================================= */}
        <div className="space-y-1 pt-1">
          <button
            onClick={() => setIsAgencyOpen(!isAgencyOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-600 hover:text-slate-900 uppercase transition-colors cursor-pointer group rounded-lg hover:bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Agency OS</span>
            </div>
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200 text-slate-400 group-hover:text-slate-700', !isAgencyOpen && '-rotate-90')} />
          </button>

          {isAgencyOpen && (
            <div className="space-y-0.5 pl-1">
              {agencyNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                      item.active
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0', item.active ? 'text-white' : 'text-slate-400')} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DOMAIN 2: BMF FOUNDERS CLUB (Exclusive Founder Network)                   */}
        {/* ========================================================================= */}
        <div className="space-y-1 pt-2 border-t border-slate-200/60">
          <button
            onClick={() => setIsClubOpen(!isClubOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-600 hover:text-slate-900 uppercase transition-colors cursor-pointer group rounded-lg hover:bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-3.5 h-3.5 text-emerald-600" />
              <span>BMF Founders Club</span>
            </div>
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200 text-slate-400 group-hover:text-slate-700', !isClubOpen && '-rotate-90')} />
          </button>

          {isClubOpen && (
            <div className="space-y-0.5 pl-1">
              {clubNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150',
                      item.active
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    )}
                  >
                    <Icon className={cn('w-4 h-4 shrink-0', item.active ? 'text-white' : 'text-slate-400')} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DOMAIN 3: SERVICES & CLIENT VENTURES (Atom SE, Wocha, Growth, etc.)       */}
        {/* ========================================================================= */}
        <div className="space-y-1 pt-2 border-t border-slate-200/60">
          <button
            onClick={() => setIsServicesOpen(!isServicesOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-600 hover:text-slate-900 uppercase transition-colors cursor-pointer group rounded-lg hover:bg-slate-50"
          >
            <div className="flex items-center gap-2">
              <Boxes className="w-3.5 h-3.5 text-amber-600" />
              <span>Services & Ventures ({servicesNavItems.length})</span>
            </div>
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200 text-slate-400 group-hover:text-slate-700', !isServicesOpen && '-rotate-90')} />
          </button>

          {isServicesOpen && (
            <div className="space-y-0.5 pl-1">
              {servicesNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group/item',
                      item.active
                        ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={cn('w-4 h-4 shrink-0', item.active ? 'text-white' : 'text-slate-400 group-hover/item:text-amber-600')} />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold leading-tight">{item.name}</p>
                        <p className={cn('truncate text-[10px] leading-none mt-0.5', item.active ? 'text-amber-100' : 'text-slate-400')}>
                          {item.subtext}
                        </p>
                      </div>
                    </div>
                    
                    <span className={cn(
                      'text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md uppercase tracking-tight shrink-0',
                      item.active 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-100 text-slate-500 group-hover/item:bg-amber-100 group-hover/item:text-amber-700'
                    )}>
                      {item.badge}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Profile / Agency Status */}
      <div className="pt-3 border-t border-slate-200/80">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white border border-slate-700 flex items-center justify-center text-xs font-black shrink-0">
            DM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">Social Media Manager</p>
            <p className="text-[10px] text-slate-500 truncate">Master Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
