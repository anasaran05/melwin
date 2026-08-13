'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Client } from '@/types/smm-dashboard';
import { INITIAL_MOCK_CLIENTS, PIPELINE_STAGES, fetchClientsFromSupabase } from '@/lib/supabase/smm-db';
import { ClientCreationModal } from '@/components/dashboard/client-creation-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, PlusCircle, ChevronRight, Sparkles } from 'lucide-react';

export default function ClientsDirectoryPage() {
  const [clients, setClients] = useState<Client[]>(INITIAL_MOCK_CLIENTS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadClients() {
      const data = await fetchClientsFromSupabase();
      if (data && data.length > 0) {
        setClients(data);
      }
    }
    loadClients();
  }, []);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.niche.toLowerCase().includes(search.toLowerCase()) ||
      (c.company_name && c.company_name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleClientCreated = (newClient: Client) => {
    setClients((prev) => [newClient, ...prev]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Agency Clients Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage all active personal brand clients and their 13-stage workflow progression.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 py-2 px-4 shadow-md shadow-indigo-600/15"
        >
          <PlusCircle className="w-4 h-4" /> Add New Client
        </Button>
      </div>

      {/* Search & Filter Inputs */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients by founder name, company, or niche..."
            className="pl-9 bg-white border-slate-200 text-slate-900 text-xs shadow-xs focus:border-indigo-300"
          />
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const stageObj = PIPELINE_STAGES.find((s) => s.id === client.current_stage);
          return (
            <div
              key={client.id}
              className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-4 hover:border-indigo-300 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={client.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={client.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{client.name}</h3>
                      <p className="text-xs text-indigo-600 font-semibold">{client.company_name || 'Personal Brand'}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] uppercase font-bold">
                    {client.status}
                  </Badge>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Niche & Target Audience</div>
                  <div className="text-xs font-bold text-slate-800">{client.niche}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{client.target_audience}</div>
                </div>

                <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 space-y-1">
                  <div className="text-[10px] text-indigo-700 font-bold uppercase">Active Stage</div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {stageObj?.name}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/dashboard/manager/clients/${client.id}/onboarding`}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
                >
                  9-Part Blueprint
                </Link>
                <Link
                  href={`/dashboard/manager/clients/${client.id}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs py-1.5 px-3 rounded-xl flex items-center gap-1 font-semibold transition-colors"
                >
                  Open Client Hub <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <ClientCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClientCreated={handleClientCreated}
      />
    </div>
  );
}
