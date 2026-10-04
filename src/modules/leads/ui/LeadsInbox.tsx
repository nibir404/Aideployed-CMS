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
import { cn } from "@/core/lib/cn";

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

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="badge-status-new">New</span>;
      case "in_review":
        return <span className="badge-status-review">In Review</span>;
      case "contacted":
        return <span className="badge-status-success">Contacted</span>;
      case "closed":
      default:
        return <span className="badge-status-neutral">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="card-surface p-4 flex flex-wrap items-center justify-between gap-4 border hairline">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-dim)]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, company..."
              className="input-text pl-9 py-1.5 text-xs input-mono"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-text w-auto py-1.5 text-xs input-mono"
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
            className="input-text w-auto py-1.5 text-xs input-mono"
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
        <div className="lg:col-span-6 card-surface overflow-hidden divide-y hairline border">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[var(--color-ink-dim)]">
              No matching inbound submissions found.
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => handleSelectLead(lead)}
                  className={cn(
                    "p-4 cursor-pointer transition-colors",
                    isSelected
                      ? "bg-[var(--color-surface)] border-l-2 border-l-[var(--color-accent)] font-medium"
                      : "hover:bg-[var(--color-surface-hover)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-sm text-[var(--color-ink)] flex items-center gap-2">
                        <span>{lead.name}</span>
                        {lead.organization && (
                          <span className="text-xs text-[var(--color-ink-dim)] font-mono">
                            ({lead.organization})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[var(--color-ink-muted)] font-mono mt-0.5">
                        {lead.email}
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      {renderStatusBadge(lead.status)}
                      <div className="text-[10px] text-[var(--color-ink-dim)] font-mono">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-[var(--color-ink-muted)] line-clamp-2">
                    {lead.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Lead Detail & Triage */}
        <div className="lg:col-span-6 card-surface p-6 flex flex-col justify-between min-h-[550px] border hairline">
          {selectedLead ? (
            <div className="space-y-6">
              <div className="border-b hairline pb-4 flex items-start justify-between">
                <div>
                  <span className="eyebrow block">Lead Dossier</span>
                  <h3 className="text-lg font-semibold text-[var(--color-ink)] mt-1">
                    {selectedLead.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--color-ink-dim)] font-mono">
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

                <span className="font-mono text-[10px] uppercase px-2.5 py-1 rounded-[3px] border hairline bg-[var(--color-surface)] text-[var(--color-ink)] font-semibold">
                  {selectedLead.engagementTier}
                </span>
              </div>

              {/* Message Payload */}
              <div className="space-y-2">
                <span className="label-text">
                  Inbound Message
                </span>
                <div className="bg-[var(--color-surface)] p-4 rounded-[4px] border hairline text-xs text-[var(--color-ink)] leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedLead.message}
                </div>
              </div>

              {/* Status Update & Internal Notes */}
              <div className="space-y-4 pt-3 border-t hairline">
                <div>
                  <label className="label-text">
                    Engagement Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
                    className="input-text text-xs input-mono"
                  >
                    <option value="new">New (Awaiting Review)</option>
                    <option value="in_review">In Review (FDE Assessing)</option>
                    <option value="contacted">Contacted (Meeting Scheduled)</option>
                    <option value="closed">Closed / Archived</option>
                  </select>
                </div>

                <div>
                  <label className="label-text">
                    Internal Engineer Notes
                  </label>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add notes about call schedule, VPC requirements, SOC2 clearance..."
                    className="input-text text-xs leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {toast && (
                    <span className="badge-status-success">
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
            <div className="h-full flex items-center justify-center text-center text-xs font-mono text-[var(--color-ink-dim)]">
              Select an inbound submission to inspect details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
