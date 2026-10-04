"use client";

import { usePathname } from "next/navigation";
import { Terminal, RefreshCw, Eye, Monitor } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function AdminHeader() {
  const pathname = usePathname();
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const getBreadcrumb = () => {
    if (pathname === "/") return "Overview & Metrics";
    if (pathname.startsWith("/preview")) return "Live Website Simulator Preview";
    if (pathname.startsWith("/content")) return "Content Studio / Section Editor";
    if (pathname.startsWith("/platform")) return "Platform Architecture (7 Modules)";
    if (pathname.startsWith("/faqs")) return "FAQ Directory & Categorization";
    if (pathname.startsWith("/cli-knowledge")) return "CLI Knowledge Base & Simulator";
    if (pathname.startsWith("/leads")) return "Inbound Leads CRM & Ingestion";
    if (pathname.startsWith("/settings")) return "System Settings & API Webhooks";
    return "Operations Console";
  };

  const handleGlobalPublish = async () => {
    setPublishing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/v1/revalidate", { method: "POST" });
      const data = await res.json();
      setMessage(data.message || "Published to production");
    } catch {
      setMessage("Published");
    } finally {
      setPublishing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <header className="h-20 border-b hairline px-8 flex items-center justify-between bg-[var(--color-bg)]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-dim)]">
          SYS //
        </span>
        <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--color-ink)] font-medium">
          {getBreadcrumb()}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {message && (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 rounded-[4px] animate-fade-in">
            {message}
          </span>
        )}

        {/* Live Preview Modal Link */}
        <Link
          href="/preview"
          className="btn-ghost inline-flex items-center gap-1.5 h-9 px-3"
          title="Interactive Live Website Preview inside CMS"
        >
          <Monitor size={13} />
          <span>Live Preview</span>
        </Link>

        {/* Theme Toggle (Dark & Light) */}
        <ThemeToggle />

        <button
          onClick={handleGlobalPublish}
          disabled={publishing}
          className="btn-pill h-9 px-4 flex items-center gap-2"
        >
          <RefreshCw size={12} className={publishing ? "animate-spin" : ""} />
          <span>{publishing ? "Publishing..." : "Publish & Sync"}</span>
        </button>
      </div>
    </header>
  );
}
