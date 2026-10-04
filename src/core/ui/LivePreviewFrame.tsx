"use client";

import { useState } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Maximize2,
} from "lucide-react";
import { cn } from "@/core/lib/cn";

type DeviceMode = "desktop" | "tablet" | "mobile";

const PREVIEW_ROUTES = [
  { label: "Home", path: "/" },
  { label: "Platform", path: "/platform" },
  { label: "Governance", path: "/governance" },
  { label: "How it works", path: "/how-we-work" },
  { label: "About", path: "/about" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
];

export function LivePreviewFrame({
  initialRoute = "/",
  defaultUrl = "https://www.aideployed.io",
}: {
  initialRoute?: string;
  defaultUrl?: string;
}) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [baseUrl, setBaseUrl] = useState(defaultUrl);
  const [currentPath, setCurrentPath] = useState(initialRoute);
  const [refreshKey, setRefreshKey] = useState(0);
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fullUrl = `${baseUrl.replace(/\/$/, "")}${currentPath}`;

  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "max-w-[390px]";
      case "tablet":
        return "max-w-[768px]";
      case "desktop":
      default:
        return "w-full";
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div
      className={cn(
        "flex flex-col border hairline rounded-[6px] overflow-hidden bg-[var(--color-surface)] transition-all",
        isFullscreen
          ? "fixed inset-4 z-50 shadow-2xl bg-[var(--color-bg)]"
          : "h-[calc(100vh-140px)] min-h-[700px]"
      )}
    >
      {/* Top Preview Control Bar */}
      <div className="h-14 border-b hairline px-4 flex flex-wrap items-center justify-between gap-3 bg-[var(--color-card)] select-none">
        {/* Left: Device Switcher */}
        <div className="flex items-center gap-1 bg-[var(--color-surface)] p-1 rounded-[4px] border hairline">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={cn(
              "px-2.5 py-1 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.14em] flex items-center gap-1.5 transition-colors",
              device === "desktop"
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
            title="Desktop (100%)"
          >
            <Monitor size={12} />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={cn(
              "px-2.5 py-1 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.14em] flex items-center gap-1.5 transition-colors",
              device === "tablet"
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
            title="Tablet (768px)"
          >
            <Tablet size={12} />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={cn(
              "px-2.5 py-1 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.14em] flex items-center gap-1.5 transition-colors",
              device === "mobile"
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
            title="Mobile (390px)"
          >
            <Smartphone size={12} />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Center: Route Switcher & URL Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-xl mx-2">
          {/* Quick Route Selector */}
          <select
            value={currentPath}
            onChange={(e) => setCurrentPath(e.target.value)}
            className="bg-[var(--color-surface)] border hairline rounded-[4px] px-2.5 py-1.5 font-mono text-[11px] text-[var(--color-ink)] outline-none"
          >
            {PREVIEW_ROUTES.map((r) => (
              <option key={r.path} value={r.path}>
                {r.label} ({r.path})
              </option>
            ))}
          </select>

          {/* Interactive URL Bar */}
          <div className="flex-1 flex items-center bg-[var(--color-surface)] border hairline rounded-[4px] px-3 py-1 font-mono text-[11px] text-[var(--color-ink)] overflow-hidden">
            <span className="text-[var(--color-ink-dim)] truncate max-w-[130px] hidden md:inline">
              {baseUrl}
            </span>
            <span className="text-[var(--color-accent)] font-semibold truncate">
              {currentPath}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] rounded-[4px] transition-colors"
            title="Refresh Preview"
          >
            <RotateCw size={14} />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] rounded-[4px] transition-colors hidden sm:inline-block"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={14} />
          </button>

          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost h-8 px-2.5 text-[10px] inline-flex items-center gap-1"
            title="Open in new window"
          >
            <span>External</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Target Host Settings Strip */}
      <div className="px-4 py-1.5 bg-[var(--color-surface)] border-b hairline flex items-center justify-between text-[10px] font-mono text-[var(--color-ink-dim)]">
        <div className="flex items-center gap-2">
          <span>Target Host:</span>
          <button
            type="button"
            onClick={() => setBaseUrl("https://www.aideployed.io")}
            className={cn(
              "px-1.5 py-0.5 rounded-[2px] transition-colors",
              baseUrl === "https://www.aideployed.io"
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-medium"
                : "hover:text-[var(--color-ink)]"
            )}
          >
            Live (aideployed.io)
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => setBaseUrl("http://localhost:3000")}
            className={cn(
              "px-1.5 py-0.5 rounded-[2px] transition-colors",
              baseUrl === "http://localhost:3000"
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-medium"
                : "hover:text-[var(--color-ink)]"
            )}
          >
            Local (localhost:3000)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">Viewport:</span>
          <span className="text-[var(--color-ink)] uppercase">
            {device === "desktop"
              ? "1440px Fluid"
              : device === "tablet"
              ? "768px iPad"
              : "390px iPhone"}
          </span>
        </div>
      </div>

      {/* Iframe Viewport Container */}
      <div className="flex-1 bg-[var(--color-bg)] p-4 overflow-auto flex items-center justify-center">
        <div
          className={cn(
            "h-full w-full mx-auto transition-all duration-300 rounded-[6px] overflow-hidden shadow-2xl border hairline",
            getDeviceWidth()
          )}
        >
          <iframe
            key={refreshKey}
            src={fullUrl}
            title="AI Deployed Live Website Preview"
            className="w-full h-full bg-black border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
