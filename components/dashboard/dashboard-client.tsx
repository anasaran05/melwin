"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { User, Mail, MessageSquare, Clock, Filter, Activity, Tag, CheckCircle, RefreshCcw } from "lucide-react"
import { toast } from "sonner"

export type Lead = {
  id: string
  name: string
  email: string
  type: string
  message: string
  status: string
  assigned_to: string | null
  created_at: string
}

export function DashboardClient({ initialLeads }: { initialLeads: Lead[] }) {
  const supabase = createClient()
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(initialLeads[0]?.id || null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Setup real-time subscription
    const channel = supabase
      .channel('public:leads')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          console.log('Real-time event:', payload)
          if (payload.eventType === 'INSERT') {
            setLeads((prev) => [payload.new as Lead, ...prev])
            toast.success('New lead received!')
          } else if (payload.eventType === 'UPDATE') {
            setLeads((prev) => prev.map((lead) => (lead.id === payload.new.id ? (payload.new as Lead) : lead)))
          } else if (payload.eventType === 'DELETE') {
            setLeads((prev) => prev.filter((lead) => lead.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleUpdate = async (id: string, updates: Partial<Lead>) => {
    setIsUpdating(true)
    try {
      const res = await fetch('/api/update-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates })
      })
      if (!res.ok) throw new Error('Failed to update')
      toast.success('Lead updated successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update lead')
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesAssignee = assigneeFilter === "all" || 
      (assigneeFilter === "unassigned" ? !lead.assigned_to : lead.assigned_to === assigneeFilter)
    return matchesStatus && matchesAssignee
  })

  const selectedLead = leads.find(l => l.id === selectedLeadId)

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'contacted': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'qualified': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'closed': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'lost': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-50 font-sans overflow-hidden">
      {/* Sidebar - Leads List */}
      <div className="w-1/3 min-w-[350px] border-r border-neutral-800 flex flex-col bg-neutral-900/50 backdrop-blur-xl">
        <div className="p-6 border-b border-neutral-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">Pipeline</h1>
            <Badge variant="outline" className="bg-neutral-800 text-neutral-300 border-neutral-700">
              {filteredLeads.length} Leads
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-neutral-900 border-neutral-800">
                <Filter className="w-4 h-4 mr-2 text-neutral-500" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-full bg-neutral-900 border-neutral-800">
                <User className="w-4 h-4 mr-2 text-neutral-500" />
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
                <SelectItem value="all">Everyone</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="anas">Anas</SelectItem>
                <SelectItem value="melwin">Melwin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 flex flex-col gap-2">
            {filteredLeads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
                  selectedLeadId === lead.id 
                    ? 'bg-neutral-800 border-neutral-700 shadow-lg' 
                    : 'bg-transparent border-transparent hover:bg-neutral-800/50 hover:border-neutral-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-neutral-100 truncate pr-2">{lead.name}</span>
                  <Badge variant="outline" className={`text-xs ${getStatusColor(lead.status)} capitalize`}>
                    {lead.status || 'New'}
                  </Badge>
                </div>
                <div className="flex items-center text-xs text-neutral-500 mb-2 truncate">
                  <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <Badge variant="secondary" className="bg-neutral-900 text-neutral-400 hover:bg-neutral-900 px-2 py-0.5 capitalize">
                    {lead.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-neutral-600 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
            {filteredLeads.length === 0 && (
              <div className="text-center p-8 text-neutral-500">
                No leads match your filters.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content - Lead Details */}
      <div className="flex-1 flex flex-col bg-neutral-950 relative">
        {selectedLead ? (
          <>
            <div className="p-8 border-b border-neutral-800 flex justify-between items-start bg-neutral-900/20">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedLead.name}</h2>
                <div className="flex items-center text-neutral-400 gap-4">
                  <a href={`mailto:${selectedLead.email}`} className="flex items-center hover:text-white transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    {selectedLead.email}
                  </a>
                  <span className="flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    {selectedLead.type.replace('_', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select 
                  value={selectedLead.status || 'new'} 
                  onValueChange={(val) => handleUpdate(selectedLead.id, { status: val })}
                  disabled={isUpdating}
                >
                  <SelectTrigger className={`w-[140px] ${getStatusColor(selectedLead.status || 'new')}`}>
                    <Activity className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={selectedLead.assigned_to || 'unassigned'} 
                  onValueChange={(val) => handleUpdate(selectedLead.id, { assigned_to: val === 'unassigned' ? null : val })}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-[140px] bg-neutral-900 border-neutral-800">
                    <User className="w-4 h-4 mr-2 text-neutral-400" />
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-100">
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="anas">Anas</SelectItem>
                    <SelectItem value="melwin">Melwin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ScrollArea className="flex-1 p-8">
              <Card className="bg-neutral-900/50 border-neutral-800 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg text-neutral-200">
                    <MessageSquare className="w-5 h-5 mr-2 text-neutral-400" />
                    Inquiry Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-neutral-300 whitespace-pre-wrap leading-relaxed text-sm p-4 bg-neutral-950 rounded-lg border border-neutral-800">
                    {selectedLead.message || 'No message provided.'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900/50 border-neutral-800">
                <CardHeader>
                  <CardTitle className="text-lg text-neutral-200">Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-500">Lead ID</span>
                      <span className="font-mono text-xs text-neutral-400 bg-neutral-950 p-2 rounded border border-neutral-800">{selectedLead.id}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-500">Created At</span>
                      <span className="text-neutral-300 bg-neutral-950 p-2 rounded border border-neutral-800">
                        {new Date(selectedLead.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-500">
            <CheckCircle className="w-16 h-16 mb-4 text-neutral-800" />
            <h3 className="text-xl font-medium text-neutral-400 mb-2">No Lead Selected</h3>
            <p className="text-sm">Select a lead from the sidebar to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}
