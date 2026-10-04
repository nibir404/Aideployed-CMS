import { AdminLayout } from "@/core/ui/AdminLayout";
import { getWebhookLogs } from "@/modules/revalidation";
import {
  Settings,
  Code,
  Globe,
  Database,
  CheckCircle2,
  RefreshCw,
  Terminal,
  ShieldCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const logs = await getWebhookLogs();

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <span className="eyebrow block">Configuration // Integrations</span>
          <h2 className="text-xl font-mono uppercase tracking-[0.08em] font-semibold text-[var(--color-ink)] mt-1">
            System Settings & Delivery APIs
          </h2>
          <p className="text-xs text-[var(--color-ink-muted)] mt-1 font-mono">
            Headless API endpoints, cache revalidation logs, and integration guides
            for aideployed.io
          </p>
        </div>

        {/* API Endpoints Catalog */}
        <div className="card-surface p-6 space-y-4 border hairline">
          <div className="flex items-center justify-between border-b hairline pb-3">
            <div className="flex items-center gap-2">
              <Code size={16} className="text-[var(--color-accent)]" />
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink)] font-semibold">
                Public Content Delivery APIs
              </h3>
            </div>
            <span className="badge-status-success">
              Active · Next.js 15 Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-[var(--color-surface)] p-4 rounded-[4px] border hairline space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-emerald-500 font-bold">GET</span>
                <span className="text-[var(--color-ink-dim)]">Cache Tag: cms-content</span>
              </div>
              <code className="block text-xs font-mono text-[var(--color-ink)] code-container p-2.5">
                /api/v1/content?page=home
              </code>
              <p className="text-[11px] text-[var(--color-ink-muted)] leading-relaxed">
                Returns the complete parsed JSON map for all home sections.
              </p>
            </div>

            <div className="bg-[var(--color-surface)] p-4 rounded-[4px] border hairline space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-emerald-500 font-bold">GET</span>
                <span className="text-[var(--color-ink-dim)]">Cache Tag: platform-modules</span>
              </div>
              <code className="block text-xs font-mono text-[var(--color-ink)] code-container p-2.5">
                /api/v1/platform
              </code>
              <p className="text-[11px] text-[var(--color-ink-muted)] leading-relaxed">
                Returns the 7 anchored platform modules with mock cards and bullets.
              </p>
            </div>

            <div className="bg-[var(--color-surface)] p-4 rounded-[4px] border hairline space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-emerald-500 font-bold">GET</span>
                <span className="text-[var(--color-ink-dim)]">Cache Tag: faqs</span>
              </div>
              <code className="block text-xs font-mono text-[var(--color-ink)] code-container p-2.5">
                /api/v1/faqs
              </code>
              <p className="text-[11px] text-[var(--color-ink-muted)] leading-relaxed">
                Returns published FAQ questions, categories, and HTML answers.
              </p>
            </div>

            <div className="bg-[var(--color-surface)] p-4 rounded-[4px] border hairline space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-emerald-500 font-bold">GET</span>
                <span className="text-[var(--color-ink-dim)]">Cache Tag: cli-knowledge</span>
              </div>
              <code className="block text-xs font-mono text-[var(--color-ink)] code-container p-2.5">
                /api/v1/cli-knowledge
              </code>
              <p className="text-[11px] text-[var(--color-ink-muted)] leading-relaxed">
                Returns structured topics in SITE_DATA format for the CLI assistant.
              </p>
            </div>

            <div className="bg-[var(--color-surface)] p-4 rounded-[4px] border hairline space-y-2 md:col-span-2">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-sky-500 font-bold">POST</span>
                <span className="text-[var(--color-ink-dim)]">CORS: Allow-Origin *</span>
              </div>
              <code className="block text-xs font-mono text-[var(--color-ink)] code-container p-2.5">
                /api/v1/leads
              </code>
              <p className="text-[11px] text-[var(--color-ink-muted)] leading-relaxed">
                Inbound contact form webhook from aideployed.io/contact with bot
                honeypot validation.
              </p>
            </div>
          </div>
        </div>

        {/* Webhook & Revalidation Audit Trail */}
        <div className="card-surface p-6 space-y-4 border hairline">
          <div className="flex items-center justify-between border-b hairline pb-3">
            <div className="flex items-center gap-2">
              <RefreshCw size={15} className="text-[var(--color-accent)]" />
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink)] font-semibold">
                Recent Revalidation Webhook Logs
              </h3>
            </div>
            <span className="font-mono text-[10px] text-[var(--color-ink-dim)]">
              Total Recorded: {logs.length}
            </span>
          </div>

          <div className="divide-y hairline">
            {logs.length === 0 ? (
              <div className="py-6 text-center text-xs font-mono text-[var(--color-ink-dim)]">
                No revalidation events recorded yet.
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="py-3 flex items-center justify-between text-xs font-mono"
                >
                  <div className="space-y-0.5">
                    <div className="text-[var(--color-ink)] truncate max-w-md font-medium">
                      {log.endpoint}
                    </div>
                    <div className="text-[10px] text-[var(--color-ink-dim)]">
                      Tag: {log.tag || "general"} ·{" "}
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-[3px] text-[10px] uppercase border font-semibold ${
                      log.status === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                        : "bg-red-500/10 border-red-500/30 text-red-500"
                    }`}
                  >
                    HTTP {log.responseCode} ({log.status})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Database & Runtime Info */}
        <div className="card-surface p-6 border hairline">
          <span className="eyebrow block mb-3">Runtime Architecture</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 font-mono text-xs">
            <div>
              <div className="text-[var(--color-ink-dim)] text-[10px] uppercase">
                Architecture
              </div>
              <div className="mt-1 text-[var(--color-ink)] font-semibold">
                Next.js 16 Micro-Monolith
              </div>
            </div>
            <div>
              <div className="text-[var(--color-ink-dim)] text-[10px] uppercase">
                Persistence Layer
              </div>
              <div className="mt-1 text-[var(--color-ink)] font-semibold">
                SQLite + Prisma 6 LTS
              </div>
            </div>
            <div>
              <div className="text-[var(--color-ink-dim)] text-[10px] uppercase">
                Delivery Target
              </div>
              <div className="mt-1 text-[var(--color-ink)] font-semibold">
                aideployed.io (Next.js 15)
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
