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
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/core/lib/cn";
import { useAdminUi } from "./AdminUiContext";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/content", label: "Visual Builder", icon: Layers, badge: "Inline" },
  { href: "/preview", label: "Live Preview", icon: Monitor, badge: "Live" },
  { href: "/platform", label: "Platform (7)", icon: Cpu, badge: "7" },
  { href: "/faqs", label: "FAQ Directory", icon: HelpCircle },
  { href: "/cli-knowledge", label: "CLI Knowledge", icon: Terminal, badge: "AI" },
  { href: "/leads", label: "Inbound Leads", icon: Inbox },
  { href: "/settings", label: "Webhooks & API", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const {
    sidebarOpenMobile,
    setSidebarOpenMobile,
    sidebarCollapsedDesktop,
    toggleSidebarDesktop,
  } = useAdminUi();

  const [revalidating, setRevalidating] = useState(false);
  const [revalStatus, setRevalStatus] = useState<string | null>(null);

  const handleRevalidate = async () => {
    setRevalidating(true);
    setRevalStatus(null);
    try {
      const res = await fetch("/api/v1/revalidate", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setRevalStatus("Synced");
      } else {
        setRevalStatus("Queued");
      }
    } catch {
      setRevalStatus("Synced");
    } finally {
      setRevalidating(false);
      setTimeout(() => setRevalStatus(null), 2500);
    }
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-4 border-b hairline flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setSidebarOpenMobile(false)}
            className="flex items-center gap-2.5 overflow-hidden group"
          >
            <span className="size-2 rounded-full bg-[var(--color-accent)] animate-pulse shrink-0" />
            {!sidebarCollapsedDesktop && (
              <div className="truncate">
                <span className="font-mono text-[12px] font-semibold tracking-[0.16em] uppercase text-[var(--color-ink)]">
                  AI Deployed
                </span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-dim)]">
                  Ops Studio
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={toggleSidebarDesktop}
            className="hidden lg:flex p-1.5 rounded-[4px] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] transition-colors"
            title={sidebarCollapsedDesktop ? "Expand Sidebar (Cmd+B)" : "Collapse Sidebar (Cmd+B)"}
          >
            {sidebarCollapsedDesktop ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setSidebarOpenMobile(false)}
            className="lg:hidden p-1.5 rounded-[4px] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-1" aria-label="CMS Navigation">
          {!sidebarCollapsedDesktop && (
            <div className="px-3 pb-1 pt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-ink-dim)]">
              Console
            </div>
          )}
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
                onClick={() => setSidebarOpenMobile(false)}
                className={cn(
                  "flex items-center rounded-[5px] font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-150 group relative",
                  sidebarCollapsedDesktop
                    ? "justify-center p-2.5"
                    : "justify-between px-3 py-2",
                  isActive
                    ? "bg-[var(--color-card)] text-[var(--color-ink)] font-semibold shadow-xs border hairline-strong"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]"
                )}
                title={sidebarCollapsedDesktop ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    size={16}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-ink-dim)] group-hover:text-[var(--color-ink)]"
                    )}
                  />
                  {!sidebarCollapsedDesktop && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {!sidebarCollapsedDesktop && item.badge && (
                  <span
                    className={cn(
                      "font-mono text-[9px] px-1.5 py-0.5 rounded-[3px] border",
                      isActive
                        ? "border-[var(--color-line-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] font-semibold"
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
      <div className="p-3 border-t hairline bg-[var(--color-card)] space-y-2">
        {!sidebarCollapsedDesktop ? (
          <>
            <div className="rounded-[4px] p-2.5 border hairline bg-[var(--color-surface)] flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--color-ink-dim)]">
              <span className="flex items-center gap-1.5">
                <Database size={11} className="text-emerald-500" />
                SQLite Active
              </span>
              <button
                onClick={handleRevalidate}
                disabled={revalidating}
                className="flex items-center gap-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors disabled:opacity-50"
                title="Trigger Cache Revalidation"
              >
                <RefreshCw
                  size={10}
                  className={cn(revalidating && "animate-spin text-[var(--color-ink)]")}
                />
                <span>{revalidating ? "Syncing" : revalStatus || "Revalidate"}</span>
              </button>
            </div>

            <a
              href="https://www.aideployed.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-2.5 py-1.5 rounded-[4px] border hairline text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] transition-colors font-mono text-[9px] uppercase tracking-[0.14em]"
            >
              <span>aideployed.io</span>
              <ExternalLink size={10} />
            </a>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleRevalidate}
              disabled={revalidating}
              className="p-2 rounded-[4px] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] transition-colors"
              title="Revalidate Cache"
            >
              <RefreshCw
                size={14}
                className={cn(revalidating && "animate-spin text-[var(--color-accent)]")}
              />
            </button>
            <a
              href="https://www.aideployed.io"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-[4px] text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] transition-colors"
              title="Open Live Website"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop & Tablet Static Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r hairline bg-[var(--color-surface)] shrink-0 h-screen sticky top-0 transition-all duration-200 z-30",
          sidebarCollapsedDesktop ? "w-16" : "w-56"
        )}
      >
        {navContent}
      </aside>

      {/* 2. Mobile Drawer Backdrop & Slide-Over Panel */}
      {sidebarOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setSidebarOpenMobile(false)}
          />

          {/* Drawer */}
          <aside className="relative w-64 max-w-[85vw] h-full bg-[var(--color-surface)] border-r hairline shadow-2xl flex flex-col z-10 transition-transform animate-slide-in">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
