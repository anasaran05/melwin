import React from 'react';
import { ManagerSidebar } from '@/components/dashboard/manager-sidebar';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      <ManagerSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-50">
        {children}
      </main>
    </div>
  );
}
