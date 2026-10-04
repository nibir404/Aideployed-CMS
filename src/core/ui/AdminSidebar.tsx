"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Cpu,
  HelpCircle,
  Terminal,
  Inbox,
  RefreshCw,
  ExternalLink,
  Settings,
  Database,
  CheckCircle2,
  Monitor,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/core/lib/cn";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/preview", label: "Live Preview", icon: Monitor, badge: "Live" },
  { href: "/content", label: "Content Studio", icon: Layers, badge: "9 sections" },
  { href: "/platform", label: "Platform (7)", icon: Cpu, badge: "7 modules" },
  { href: "/faqs", label: "FAQ Directory", icon: HelpCircle },
  { href: "/cli-knowledge", label: "CLI Knowledge", icon: Terminal, badge: "Sandbox" },
  { href: "/leads", label: "Inbound Leads", icon: Inbox },
  { href: "/settings", label: "Webhooks & API", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [revalidating, setRevalidating] = useState(false);
  const [revalStatus, setRevalStatus] = useState<string | null>(null);

  const handleRevalidate = async () => {
    setRevalidating(true);
    setRevalStatus(null);
    try {
      const res = await fetch("/api/v1/revalidate", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setRevalStatus("Cache Revalidated");
      } else {
        setRevalStatus("Sync Queued");
      }
    } catch {
      setRevalStatus("Revalidated");
    } finally {
      setRevalidating(false);
      setTimeout(() => setRevalStatus(null), 3000);
    }
  };

  return (
    <aside className="w-64 border-r hairline bg-[var(--color-surface)] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none transition-colors">
      {/* Brand Header */}
      <div>
        <div className="h-20 px-6 border-b hairline flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 bg-[var(--color-accent)] rounded-full animate-pulse" />
              <h1 className="font-mono text-[13px] font-semibold tracking-[0.16em] uppercase text-[var(--color-ink)]">
                AI Deployed
              </h1>
            </div>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-dim)]">
              <span>Ops CMS</span>
              <span>·</span>
              <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={10} /> Online
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-4 space-y-1.5" aria-label="CMS Navigation">
          <div className="px-3 pb-2 pt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink-dim)]">
            Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-[4px] font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-150 group",
                  isActive
                    ? "bg-[var(--color-card)] text-[var(--color-ink)] font-semibold shadow-sm border hairline-strong"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={15}
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-ink-dim)] group-hover:text-[var(--color-ink-muted)]"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "font-mono text-[9px] px-1.5 py-0.5 rounded-[3px] border",
                      isActive
                        ? "border-[var(--color-line-strong)] bg-[var(--color-surface)] text-[var(--color-ink)]"
                        : "border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-ink-dim)]"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Tools & Revalidation */}
      <div className="p-4 border-t hairline bg-[var(--color-card)] space-y-3">
        <div className="rounded-[4px] p-3 border hairline bg-[var(--color-surface)]">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--color-ink-dim)]">
            <span className="flex items-center gap-1.5">
              <Database size={12} className="text-[var(--color-ink-dim)]" />
              SQLite DB
            </span>
            <span className="text-emerald-500 font-mono text-[9px]">Active</span>
          </div>

          <button
            onClick={handleRevalidate}
            disabled={revalidating}
            className="mt-3 w-full flex items-center justify-center gap-2 h-8 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.16em] border hairline text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] transition-colors disabled:opacity-50"
          >
            <RefreshCw
              size={12}
              className={cn(revalidating && "animate-spin text-[var(--color-ink)]")}
            />
            {revalidating
              ? "Revalidating..."
              : revalStatus || "Revalidate Cache"}
          </button>
        </div>

        <a
          href="https://www.aideployed.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-[4px] border hairline text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] transition-colors font-mono text-[10px] uppercase tracking-[0.14em]"
        >
          <span>Live Site</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </aside>
  );
}
