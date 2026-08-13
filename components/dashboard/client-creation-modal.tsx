'use client';

import React, { useState } from 'react';
import { Client, PipelineStage } from '@/types/smm-dashboard';
import { PIPELINE_STAGES } from '@/lib/supabase/smm-db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ClientCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (newClient: Client) => void;
}

export function ClientCreationModal({ isOpen, onClose, onClientCreated }: ClientCreationModalProps) {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [niche, setNiche] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [initialStage, setInitialStage] = useState<PipelineStage>('research');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !niche.trim()) {
      toast.error('Client Name and Niche are required');
      return;
    }

    const createdClient: Client = {
      id: `client-${Date.now()}`,
      name: name.trim(),
      company_name: companyName.trim() || null,
      niche: niche.trim(),
      target_audience: targetAudience.trim() || 'General Audience',
      current_stage: initialStage,
      status: 'active',
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onClientCreated(createdClient);
    toast.success(`Client ${name} added to agency OS!`);
    setName('');
    setCompanyName('');
    setNiche('');
    setTargetAudience('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border border-slate-200 text-slate-900 max-w-md p-6 rounded-2xl select-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
            <PlusCircle className="w-5 h-5 text-indigo-600" /> Onboard New Personal Brand Client
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Create a client profile to begin the 13-stage brand OS workflow.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Founder / Client Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tiwary"
              className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Company / Brand Name</label>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. AlphaVentures"
              className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Niche / Industry Focus *</label>
            <Input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. Tech Entrepreneurship & SaaS"
              className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Target Audience Profile</label>
            <Input
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Young ambitious founders & tech leaders"
              className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Initial Pipeline Stage</label>
            <Select value={initialStage} onValueChange={(val: PipelineStage) => setInitialStage(val)}>
              <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 text-xs">
                <SelectValue placeholder="Select Stage" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900 text-xs">
                {PIPELINE_STAGES.map((stg) => (
                  <SelectItem key={stg.id} value={stg.id} className="text-xs">
                    {stg.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-200 text-slate-700 text-xs hover:bg-slate-100">
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/15">
              Create Client Profile
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
