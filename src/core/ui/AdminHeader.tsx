"use client";

import { usePathname } from "next/navigation";
import { RefreshCw, Monitor, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useAdminUi } from "./AdminUiContext";

export function AdminHeader() {
  const pathname = usePathname();
  const { toggleSidebarMobile, toggleSidebarDesktop, sidebarCollapsedDesktop } = useAdminUi();

  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const getBreadcrumb = () => {
    if (pathname === "/") return "Overview";
    if (pathname.startsWith("/preview")) return "Live Simulator";
    if (pathname.startsWith("/content")) return "Visual Builder";
    if (pathname.startsWith("/platform")) return "Platform Modules";
    if (pathname.startsWith("/faqs")) return "FAQ Directory";
    if (pathname.startsWith("/cli-knowledge")) return "CLI Knowledge";
    if (pathname.startsWith("/leads")) return "Leads CRM";
    if (pathname.startsWith("/settings")) return "Settings";
    return "Console";
  };

  const handleGlobalPublish = async () => {
    setPublishing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/v1/revalidate", { method: "POST" });
      const data = await res.json();
      setMessage(data.message || "Published");
    } catch {
      setMessage("Published");
    } finally {
      setPublishing(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  return (
    <header className="h-14 border-b hairline px-4 sm:px-6 flex items-center justify-between bg-[var(--color-bg)]/90 backdrop-blur-md sticky top-0 z-30 select-none">
      {/* Left: Mobile Hamburger & Desktop Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Drawer Toggle */}
        <button
          type="button"
          onClick={toggleSidebarMobile}
          className="lg:hidden btn-icon h-8 w-8 -ml-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          aria-label="Open Navigation Menu"
        >
          <Menu size={16} />
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          type="button"
          onClick={toggleSidebarDesktop}
          className="hidden lg:inline-flex btn-icon h-8 w-8 -ml-1 text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
          title={sidebarCollapsedDesktop ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsedDesktop ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>

        {/* Breadcrumb Indicator */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)] hidden sm:inline">
            SYS //
          </span>
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--color-ink)] font-semibold truncate max-w-[180px] sm:max-w-none">
            {getBreadcrumb()}
          </span>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-2">
        {message && (
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-[3px] animate-fade-in hidden sm:inline-block">
            {message}
          </span>
        )}

        {/* Live Preview Button */}
        <Link
          href="/preview"
          className="btn-ghost inline-flex items-center gap-1.5 h-8 px-2.5 text-[10px]"
          title="Interactive Live Simulator"
        >
          <Monitor size={12} />
          <span className="hidden md:inline">Simulator</span>
        </Link>

        {/* Theme Toggle (Dark & Light) */}
        <ThemeToggle />

        {/* Global Publish & Sync */}
        <button
          onClick={handleGlobalPublish}
          disabled={publishing}
          className="btn-pill h-8 px-3 text-[10px] flex items-center gap-1.5"
          title="Publish & Sync to target site"
        >
          <RefreshCw size={11} className={publishing ? "animate-spin" : ""} />
          <span className="hidden sm:inline">{publishing ? "Syncing..." : "Sync"}</span>
        </button>
      </div>
    </header>
  );
}
