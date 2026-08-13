'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GitFork,
  Sparkles,
  BarChart3,
  Settings,
  ShieldCheck,
  PlusCircle,
  TrendingUp,
  FolderKanban,
  FileText,
  Film
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ManagerSidebarProps {
  activeClientId?: string;
  onOpenCreateClient?: () => void;
}

export function ManagerSidebar({ activeClientId, onOpenCreateClient }: ManagerSidebarProps) {
  const pathname = usePathname();

  const mainNavItems = [
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
      <div className="space-y-6">
        {/* Official App Logo Header */}
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 bg-white border border-slate-200/80 rounded-xl shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all group">
          <img src="/logo-2.png" alt="Dr. Melwin Logo" className="h-7 w-auto object-contain shrink-0" />
          <div className="border-l border-slate-200 pl-3">
            <h2 className="text-xs font-extrabold text-slate-900 tracking-tight flex items-center gap-1">
              Agency OS
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">Social Media Manager</p>
          </div>
        </Link>

        {/* Action Button */}
        {onOpenCreateClient && (
          <Button
            onClick={onOpenCreateClient}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/15 rounded-xl flex items-center justify-center gap-2 py-2.5 text-xs transition-all"
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

        {/* Main Agency Navigation */}
        <div className="space-y-1.5">
          <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Agency Navigation
          </div>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
                  item.active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                )}
              >
                <Icon className={cn('w-4 h-4', item.active ? 'text-white' : 'text-slate-400')} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Profile / Agency Status */}
      <div className="pt-4 border-t border-slate-200/80">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white border border-slate-700 flex items-center justify-center text-xs font-black">
            DM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">Social Media Manager</p>
            <p className="text-[10px] text-slate-500 truncate">Agency Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
