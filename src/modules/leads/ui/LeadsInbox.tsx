"use client";

import { useState } from "react";
import {
  Inbox,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building,
  Mail,
  Edit3,
} from "lucide-react";
import type { LeadEntity, LeadStatus } from "../types";

export function LeadsInbox({ initialLeads }: { initialLeads: LeadEntity[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadEntity | null>(
    initialLeads[0] || null
  );

  const [editNotes, setEditNotes] = useState(selectedLead?.notes || "");
  const [editStatus, setEditStatus] = useState<LeadStatus>(
    (selectedLead?.status as LeadStatus) || "new"
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSelectLead = (lead: LeadEntity) => {
    setSelectedLead(lead);
    setEditNotes(lead.notes || "");
    setEditStatus((lead.status as LeadStatus) || "new");
  };

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== "all" && lead.status !== statusFilter) return false;
    if (tierFilter !== "all" && lead.engagementTier !== tierFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.organization && lead.organization.toLowerCase().includes(q)) ||
        lead.message.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleSaveLead = async () => {
    if (!selectedLead) return;
    setSaving(true);
    setToast(null);

    try {
      const res = await fetch("/api/admin/leads/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedLead.id,
          status: editStatus,
          notes: editNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? data.lead : l))
        );
        setSelectedLead(data.lead);
        setToast("Lead updated");
      }
    } catch {
      setToast("Error updating lead");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="card-surface p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, company..."
              className="w-full bg-[#161616] border hairline rounded-[4px] pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-neutral-400 font-mono"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#161616] border hairline rounded-[4px] px-2.5 py-1.5 text-xs font-mono text-neutral-300 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in_review">In Review</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>

          {/* Tier Filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-[#161616] border hairline rounded-[4px] px-2.5 py-1.5 text-xs font-mono text-neutral-300 outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="foundation">Foundation</option>
            <option value="embedded">Embedded</option>
            <option value="scaled">Scaled</option>
            <option value="unsure">Not sure yet</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/leads/export"
            download
            className="btn-ghost h-8 px-3 text-[10px] inline-flex items-center gap-1.5"
          >
            <Download size={12} />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Leads List & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Leads List */}
        <div className="lg:col-span-6 card-surface overflow-hidden divide-y hairline">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-neutral-500">
              No matching inbound submissions found.
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => handleSelectLead(lead)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-[#1c1c1c] border-l-2 border-l-[var(--color-accent)]"
                      : "hover:bg-[#141414]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-sm text-white flex items-center gap-2">
                        <span>{lead.name}</span>
                        {lead.organization && (
                          <span className="text-xs text-neutral-400 font-mono">
                            ({lead.organization})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono mt-0.5">
                        {lead.email}
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span
                        className={`inline-block font-mono text-[9px] uppercase px-2 py-0.5 rounded-[3px] border ${
                          lead.status === "new"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : lead.status === "contacted"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-neutral-800 border-neutral-700 text-neutral-400"
                        }`}
                      >
                        {lead.status}
                      </span>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-neutral-400 line-clamp-2">
                    {lead.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Lead Detail & Triage */}
        <div className="lg:col-span-6 card-surface p-6 flex flex-col justify-between min-h-[550px]">
          {selectedLead ? (
            <div className="space-y-6">
              <div className="border-b hairline pb-4 flex items-start justify-between">
                <div>
                  <span className="eyebrow block">Lead Dossier</span>
                  <h3 className="text-lg font-semibold text-white mt-1">
                    {selectedLead.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Mail size={12} /> {selectedLead.email}
                    </span>
                    {selectedLead.organization && (
                      <span className="flex items-center gap-1">
                        <Building size={12} /> {selectedLead.organization}
                      </span>
                    )}
                  </div>
                </div>

                <span className="font-mono text-[10px] uppercase px-2 py-1 rounded-[3px] border border-neutral-700 bg-neutral-800 text-neutral-300">
                  {selectedLead.engagementTier}
                </span>
              </div>

              {/* Message Payload */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400">
                  Inbound Message
                </span>
                <div className="bg-[#141414] p-4 rounded-[4px] border hairline text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedLead.message}
                </div>
              </div>

              {/* Status Update & Internal Notes */}
              <div className="space-y-4 pt-3 border-t hairline">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400 mb-1.5">
                    Engagement Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
                    className="w-full bg-[#161616] border hairline rounded-[4px] px-3 py-2 text-xs font-mono text-white outline-none focus:border-neutral-400"
                  >
                    <option value="new">New (Awaiting Review)</option>
                    <option value="in_review">In Review (FDE Assessing)</option>
                    <option value="contacted">Contacted (Meeting Scheduled)</option>
                    <option value="closed">Closed / Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400 mb-1.5">
                    Internal Engineer Notes
                  </label>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes about call schedule, VPC requirements, SOC2 clearance..."
                    className="w-full bg-[#161616] border hairline rounded-[4px] p-3 text-xs text-neutral-300 focus:border-neutral-400 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {toast && (
                    <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={11} /> {toast}
                    </span>
                  )}
                  <button
                    onClick={handleSaveLead}
                    disabled={saving}
                    className="btn-pill h-8 px-4 text-[10px] ml-auto"
                  >
                    {saving ? "Updating..." : "Save Triage Notes"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-xs font-mono text-neutral-500">
              Select an inbound submission to inspect details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
