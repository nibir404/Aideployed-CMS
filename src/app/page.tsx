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

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Hero Banner */}
        <div className="card-surface p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/[0.04] to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="eyebrow block mb-3">Control Plane · AI Deployed</span>
            <h2 className="text-2xl font-mono uppercase tracking-[0.08em] font-semibold text-[var(--color-ink)]">
              Operations & Editorial CMS
            </h2>
            <p className="mt-3 text-sm text-[var(--color-ink-muted)] leading-relaxed">
              Bespoke CMS engine managing website sections, platform architecture,
              inbound enterprise lead pipelines, and AI CLI assistant knowledge for{" "}
              <a
                href="https://www.aideployed.io"
                target="_blank"
                rel="noreferrer"
                className="text-[var(--color-ink)] underline underline-offset-4 hover:text-[var(--color-accent)]"
              >
                aideployed.io
              </a>
              .
            </p>
          </div>
        </div>

        {/* Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/content"
            className="card-surface p-6 flex flex-col justify-between group hover:border-[var(--color-line-strong)] transition-all"
          >
            <div className="flex items-center justify-between text-[var(--color-ink-muted)]">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                Page Sections
              </span>
              <Layers size={16} className="group-hover:text-[var(--color-ink)] transition-colors" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-mono font-medium text-[var(--color-ink)]">
                {sectionCount}
              </div>
              <div className="mt-1 text-xs text-[var(--color-ink-dim)] font-mono">
                Across Home & Editorial
              </div>
            </div>
          </Link>

          <Link
            href="/platform"
            className="card-surface p-6 flex flex-col justify-between group hover:border-[var(--color-line-strong)] transition-all"
          >
            <div className="flex items-center justify-between text-[var(--color-ink-muted)]">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                Platform Modules
              </span>
              <Cpu size={16} className="group-hover:text-[var(--color-ink)] transition-colors" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-mono font-medium text-[var(--color-ink)]">
                {moduleCount}
              </div>
              <div className="mt-1 text-xs text-[var(--color-ink-dim)] font-mono">
                Build to Measure (7 Anchors)
              </div>
            </div>
          </Link>

          <Link
            href="/leads"
            className="card-surface p-6 flex flex-col justify-between group hover:border-[var(--color-line-strong)] transition-all"
          >
            <div className="flex items-center justify-between text-[var(--color-ink-muted)]">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                Inbound Leads
              </span>
              <Inbox size={16} className="group-hover:text-[var(--color-ink)] transition-colors" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <div className="text-3xl font-mono font-medium text-[var(--color-ink)]">
                {leads.length}
              </div>
              {newLeadsCount > 0 && (
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[3px] bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  {newLeadsCount} New
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-[var(--color-ink-dim)] font-mono">
              From /contact Intake
            </div>
          </Link>

          <Link
            href="/cli-knowledge"
            className="card-surface p-6 flex flex-col justify-between group hover:border-[var(--color-line-strong)] transition-all"
          >
            <div className="flex items-center justify-between text-[var(--color-ink-muted)]">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                CLI Topics
              </span>
              <Terminal size={16} className="group-hover:text-[var(--color-ink)] transition-colors" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-mono font-medium text-[var(--color-ink)]">
                {topicCount}
              </div>
              <div className="mt-1 text-xs text-[var(--color-ink-dim)] font-mono">
                Live interactive matcher
              </div>
            </div>
          </Link>
        </div>

        {/* Two-Column Workspace Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Inbound Leads */}
          <div className="lg:col-span-8 card-surface overflow-hidden flex flex-col">
            <div className="p-6 border-b hairline flex items-center justify-between bg-[var(--color-card)]">
              <div>
                <span className="eyebrow block">Intake Stream</span>
                <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] mt-1">
                  Recent Inbound Inquiries
                </h3>
              </div>
              <Link
                href="/leads"
                className="btn-ghost h-8 px-3 inline-flex items-center gap-1.5 text-[10px]"
              >
                <span>View All Leads</span>
                <ArrowUpRight size={11} />
              </Link>
            </div>

            <div className="divide-y hairline">
              {leads.length === 0 ? (
                <div className="p-8 text-center text-sm text-[var(--color-ink-dim)] font-mono">
                  No submissions recorded yet.
                </div>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-5 hover:bg-[var(--color-surface-hover)] transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-[var(--color-ink)]">
                          {lead.name}
                        </span>
                        {lead.organization && (
                          <span className="text-xs text-[var(--color-ink-dim)] font-mono">
                            · {lead.organization}
                          </span>
                        )}
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[3px] border hairline bg-[var(--color-card)] text-[var(--color-ink-muted)]">
                          {lead.engagementTier}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-ink-muted)] line-clamp-1">
                        {lead.message}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--color-ink-dim)]">
                        <span>{lead.email}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`font-mono text-[9px] uppercase tracking-[0.14em] px-2 py-1 rounded-[3px] border ${
                          lead.status === "new"
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                            : lead.status === "contacted"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                            : "bg-[var(--color-card)] border-hairline text-[var(--color-ink-dim)]"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts & Preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="card-surface p-6">
              <span className="eyebrow block mb-3">Quick Navigation</span>
              <div className="space-y-2">
                <Link
                  href="/preview"
                  className="flex items-center justify-between p-3 rounded-[4px] border hairline hover:border-[var(--color-line-strong)] bg-[var(--color-card)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Monitor size={14} className="text-[var(--color-accent)]" />
                    <span className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink)] font-medium">
                      Live Website Preview
                    </span>
                  </div>
                  <ArrowUpRight size={12} className="text-[var(--color-ink-dim)]" />
                </Link>

                <Link
                  href="/content"
                  className="flex items-center justify-between p-3 rounded-[4px] border hairline hover:border-[var(--color-line-strong)] bg-[var(--color-card)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Layers size={14} className="text-[var(--color-accent)]" />
                    <span className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink)]">
                      Edit Hero & Sections
                    </span>
                  </div>
                  <ArrowUpRight size={12} className="text-[var(--color-ink-dim)]" />
                </Link>

                <Link
                  href="/platform"
                  className="flex items-center justify-between p-3 rounded-[4px] border hairline hover:border-[var(--color-line-strong)] bg-[var(--color-card)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Cpu size={14} className="text-[var(--color-accent)]" />
                    <span className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink)]">
                      Platform Modules (7)
                    </span>
                  </div>
                  <ArrowUpRight size={12} className="text-[var(--color-ink-dim)]" />
                </Link>

                <Link
                  href="/cli-knowledge"
                  className="flex items-center justify-between p-3 rounded-[4px] border hairline hover:border-[var(--color-line-strong)] bg-[var(--color-card)] hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Terminal size={14} className="text-[var(--color-accent)]" />
                    <span className="font-mono text-xs uppercase tracking-[0.1em] text-[var(--color-ink)]">
                      Test AI CLI Matcher
                    </span>
                  </div>
                  <ArrowUpRight size={12} className="text-[var(--color-ink-dim)]" />
                </Link>
              </div>
            </div>

            {/* Delivery & Revalidation Status */}
            <div className="card-surface p-6">
              <span className="eyebrow block mb-3">Live Cache & Status</span>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between py-1 border-b hairline">
                  <span className="text-[var(--color-ink-dim)]">Public API</span>
                  <span className="text-[var(--color-ink)] truncate max-w-[150px]">
                    /api/v1/content
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b hairline">
                  <span className="text-[var(--color-ink-dim)]">Theme System</span>
                  <span className="text-[var(--color-ink)]">Dark + Light (Paper Cream)</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[var(--color-ink-dim)]">Delivery</span>
                  <span className="text-emerald-500 flex items-center gap-1 text-[11px] font-semibold">
                    <CheckCircle2 size={11} /> Ready
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
