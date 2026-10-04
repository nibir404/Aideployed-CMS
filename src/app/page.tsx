import { AdminLayout } from "@/core/ui/AdminLayout";
import prisma from "@/core/db/prisma";
import Link from "next/link";
import {
  Layers,
  Cpu,
  HelpCircle,
  Terminal,
  Inbox,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Monitor,
  Activity,
  Globe,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    sectionCount,
    moduleCount,
    faqCount,
    topicCount,
    leads,
  ] = await Promise.all([
    prisma.section.count(),
    prisma.platformModule.count(),
    prisma.faqItem.count(),
    prisma.cliTopic.count(),
    prisma.leadSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const newLeadsCount = await prisma.leadSubmission.count({
    where: { status: "new" },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="badge-status-new">New</span>;
      case "in_review":
        return <span className="badge-status-review">In Review</span>;
      case "contacted":
        return <span className="badge-status-success">Contacted</span>;
      default:
        return <span className="badge-status-neutral">{status}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Hero Banner */}
        <div className="card-surface p-5 sm:p-6 md:p-8 relative overflow-hidden border hairline rounded-[6px]">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/[0.04] to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="eyebrow block">AI Deployed · Mission Control</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-mono uppercase tracking-[0.08em] font-semibold text-[var(--color-ink)]">
              Operations & Editorial CMS
            </h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-[var(--color-ink-muted)] leading-relaxed">
              Unified micro-monolith CMS powering visual page building, enterprise platform capabilities,
              inbound inquiry triage, and offline CLI knowledge for{" "}
              <a
                href="https://www.aideployed.io"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-ink)] underline underline-offset-4 hover:text-[var(--color-accent)] font-medium"
              >
                aideployed.io
              </a>
              .
            </p>
          </div>
        </div>

        {/* Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/content"
            className="card-surface p-4 sm:p-5 flex flex-col justify-between group hover:border-[var(--color-line-strong)] transition-all border hairline rounded-[6px] shadow-xs"
          >
            <div className="flex items-center justify-between text-[var(--color-ink-muted)]">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em]">
                Page Sections
              </span>
              <Layers size={15} className="group-hover:text-[var(--color-ink)] transition-colors" />
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-2xl sm:text-3xl font-mono font-medium text-[var(--color-ink)]">
                {sectionCount}
              </div>
              <div className="mt-1 text-[11px] text-[var(--color-ink-dim)] font-mono">
                Across 6 Live Pages
              </div>
            </div>
          </Link>

          <Link
            href="/platform"
            className="card-surface p-4 sm:p-5 flex flex-col justify-between group hover:border-[var(--color-line-strong)] transition-all border hairline rounded-[6px] shadow-xs"
          >
            <div className="flex items-center justify-between text-[var(--color-ink-muted)]">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em]">
                Platform Modules
              </span>
              <Cpu size={15} className="group-hover:text-[var(--color-ink)] transition-colors" />
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-2xl sm:text-3xl font-mono font-medium text-[var(--color-ink)]">
                {moduleCount}
              </div>
              <div className="mt-1 text-[11px] text-[var(--color-ink-dim)] font-mono">
                Build to Measure (7 Anchors)
              </div>
            </div>
          </Link>

          <Link
            href="/leads"
            className="card-surface p-4 sm:p-5 flex flex-col justify-between group hover:border-[var(--color-line-strong)] transition-all border hairline rounded-[6px] shadow-xs"
          >
            <div className="flex items-center justify-between text-[var(--color-ink-muted)]">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em]">
                Inbound Inquiries
              </span>
              <Inbox size={15} className="group-hover:text-[var(--color-ink)] transition-colors" />
            </div>
            <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
              <div className="text-2xl sm:text-3xl font-mono font-medium text-[var(--color-ink)]">
                {leads.length}
              </div>
              {newLeadsCount > 0 && (
                <span className="badge-status-new text-[9px]">
                  {newLeadsCount} New
                </span>
              )}
            </div>
            <div className="mt-1 text-[11px] text-[var(--color-ink-dim)] font-mono">
              From Intake Pipeline
            </div>
          </Link>

          <Link
            href="/cli-knowledge"
            className="card-surface p-4 sm:p-5 flex flex-col justify-between group hover:border-[var(--color-line-strong)] transition-all border hairline rounded-[6px] shadow-xs"
          >
            <div className="flex items-center justify-between text-[var(--color-ink-muted)]">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em]">
                CLI Topics
              </span>
              <Terminal size={15} className="group-hover:text-[var(--color-ink)] transition-colors" />
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="text-2xl sm:text-3xl font-mono font-medium text-[var(--color-ink)]">
                {topicCount}
              </div>
              <div className="mt-1 text-[11px] text-[var(--color-ink-dim)] font-mono">
                Interactive Matcher
              </div>
            </div>
          </Link>
        </div>

        {/* Two-Column Workspace Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Recent Inbound Leads */}
          <div className="lg:col-span-8 card-surface overflow-hidden flex flex-col border hairline rounded-[6px]">
            <div className="p-4 sm:p-5 border-b hairline flex items-center justify-between bg-[var(--color-card)]">
              <div>
                <span className="eyebrow block">Intake Stream</span>
                <h3 className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.1em] text-[var(--color-ink)] mt-0.5">
                  Recent Inbound Inquiries
                </h3>
              </div>
              <Link
                href="/leads"
                className="btn-ghost h-7 sm:h-8 px-2.5 sm:px-3 inline-flex items-center gap-1.5 text-[10px]"
              >
                <span>All Leads</span>
                <ArrowUpRight size={11} />
              </Link>
            </div>

            <div className="divide-y hairline">
              {leads.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--color-ink-dim)] font-mono">
                  No submissions recorded yet.
                </div>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 sm:p-4 hover:bg-[var(--color-surface-hover)] transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="font-medium text-xs sm:text-sm text-[var(--color-ink)] truncate">
                          {lead.name}
                        </span>
                        {lead.organization && (
                          <span className="text-[11px] text-[var(--color-ink-dim)] font-mono truncate">
                            · {lead.organization}
                          </span>
                        )}
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[2px] border hairline bg-[var(--color-surface)] text-[var(--color-ink-muted)]">
                          {lead.engagementTier}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-ink-muted)] line-clamp-1">
                        {lead.message}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--color-ink-dim)]">
                        <span className="truncate max-w-[150px] sm:max-w-none">{lead.email}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Clock size={10} />
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {getStatusBadge(lead.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts & Preview */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <div className="card-surface p-4 sm:p-5 border hairline rounded-[6px]">
              <span className="eyebrow block mb-2.5">Quick Navigation</span>
              <div className="space-y-2">
                <Link
                  href="/preview"
                  className="flex items-center justify-between p-2.5 rounded-[4px] border hairline hover:border-[var(--color-line-strong)] bg-[var(--color-card)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Monitor size={14} className="text-[var(--color-accent)] shrink-0" />
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink)] font-semibold">
                      Live Simulator Preview
                    </span>
                  </div>
                  <ArrowUpRight size={12} className="text-[var(--color-ink-dim)]" />
                </Link>

                <Link
                  href="/content"
                  className="flex items-center justify-between p-2.5 rounded-[4px] border hairline hover:border-[var(--color-line-strong)] bg-[var(--color-card)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers size={14} className="text-[var(--color-accent)] shrink-0" />
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink)]">
                      Visual Page Builder
                    </span>
                  </div>
                  <ArrowUpRight size={12} className="text-[var(--color-ink-dim)]" />
                </Link>

                <Link
                  href="/platform"
                  className="flex items-center justify-between p-2.5 rounded-[4px] border hairline hover:border-[var(--color-line-strong)] bg-[var(--color-card)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Cpu size={14} className="text-[var(--color-accent)] shrink-0" />
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink)]">
                      Platform Modules (7)
                    </span>
                  </div>
                  <ArrowUpRight size={12} className="text-[var(--color-ink-dim)]" />
                </Link>

                <Link
                  href="/cli-knowledge"
                  className="flex items-center justify-between p-2.5 rounded-[4px] border hairline hover:border-[var(--color-line-strong)] bg-[var(--color-card)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Terminal size={14} className="text-[var(--color-accent)] shrink-0" />
                    <span className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-ink)]">
                      CLI Matcher Test
                    </span>
                  </div>
                  <ArrowUpRight size={12} className="text-[var(--color-ink-dim)]" />
                </Link>
              </div>
            </div>

            {/* Delivery & Revalidation Status */}
            <div className="card-surface p-4 sm:p-5 border hairline rounded-[6px]">
              <span className="eyebrow block mb-2.5">Engine Status</span>
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between py-1 border-b hairline">
                  <span className="text-[var(--color-ink-dim)]">Content API</span>
                  <span className="text-[var(--color-ink)] font-semibold truncate max-w-[140px]">
                    /api/v1/content
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b hairline">
                  <span className="text-[var(--color-ink-dim)]">Themes</span>
                  <span className="text-[var(--color-ink)] font-semibold">Dark + Light</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[var(--color-ink-dim)]">Status</span>
                  <span className="text-emerald-500 flex items-center gap-1 text-[11px] font-semibold">
                    <CheckCircle2 size={11} /> Healthy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
