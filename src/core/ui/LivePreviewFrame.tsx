"use client";

import { useState, useEffect } from "react";
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
  Sparkles,
  Layers,
  Globe,
} from "lucide-react";
import { cn } from "@/core/lib/cn";
import { SectionLivePreview } from "@/modules/content/ui/SectionLivePreview";

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
  const [previewSource, setPreviewSource] = useState<"cms" | "remote">("cms");
  const [baseUrl, setBaseUrl] = useState(defaultUrl);
  const [currentPath, setCurrentPath] = useState(initialRoute);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // In-memory CMS sections for the interactive simulator
  const [cmsSections, setCmsSections] = useState<Record<string, any>>({});
  const [loadingCms, setLoadingCms] = useState(false);

  useEffect(() => {
    async function loadCmsContent() {
      setLoadingCms(true);
      try {
        const res = await fetch("/api/v1/content?page=home");
        const json = await res.json();
        if (json.success && json.data) {
          setCmsSections(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch CMS content for preview", err);
      } finally {
        setLoadingCms(false);
      }
    }
    loadCmsContent();
  }, [refreshKey]);

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
        {/* Left: Engine Mode & Device Switcher */}
        <div className="flex items-center gap-2">
          {/* Mode toggle */}
          <div className="h-8 flex items-center bg-[var(--color-surface)] p-0.5 rounded-[4px] border hairline">
            <button
              type="button"
              onClick={() => setPreviewSource("cms")}
              className={cn(
                "h-full px-2.5 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.1em] flex items-center gap-1.5 transition-colors",
                previewSource === "cms"
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
            >
              <Sparkles size={11} />
              <span>CMS Live Render</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewSource("remote")}
              className={cn(
                "h-full px-2.5 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.1em] flex items-center gap-1.5 transition-colors",
                previewSource === "remote"
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
            >
              <Globe size={11} />
              <span>Remote Site</span>
            </button>
          </div>

          {/* Device toggle (for remote iframe mode) */}
          {previewSource === "remote" && (
            <div className="h-8 flex items-center bg-[var(--color-surface)] p-0.5 rounded-[4px] border hairline">
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={cn(
                  "h-full px-2 rounded-[3px] flex items-center justify-center transition-colors",
                  device === "desktop"
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                )}
                title="Desktop"
              >
                <Monitor size={12} />
              </button>
                <button
                  type="button"
                  onClick={() => setDevice("tablet")}
                  className={cn(
                    "h-full px-2 rounded-[3px] flex items-center justify-center transition-colors",
                    device === "tablet"
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                      : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  )}
                  title="Tablet"
                >
                  <Tablet size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => setDevice("mobile")}
                  className={cn(
                    "h-full px-2 rounded-[3px] flex items-center justify-center transition-colors",
                    device === "mobile"
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                      : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  )}
                  title="Mobile"
                >
                  <Smartphone size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Center: Route Switcher & URL Bar */}
          {previewSource === "remote" && (
            <div className="flex items-center gap-2 flex-1 max-w-xl mx-2">
              <select
                value={currentPath}
                onChange={(e) => setCurrentPath(e.target.value)}
                className="input-text h-8 w-auto py-0 font-mono text-[11px]"
              >
                {PREVIEW_ROUTES.map((r) => (
                  <option key={r.path} value={r.path}>
                    {r.label} ({r.path})
                  </option>
                ))}
              </select>

              <div className="flex-1 flex items-center bg-[var(--color-surface)] border hairline rounded-[4px] px-3 h-8 font-mono text-[11px] text-[var(--color-ink)] overflow-hidden">
                <span className="text-[var(--color-ink-dim)] truncate max-w-[130px] hidden md:inline">
                  {baseUrl}
                </span>
                <span className="text-[var(--color-accent)] font-semibold truncate">
                  {currentPath}
                </span>
              </div>
            </div>
          )}

          {previewSource === "cms" && (
            <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-500 uppercase tracking-[0.14em]">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Interactive Live Content Component Stack</span>
            </div>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="btn-icon h-8 w-8 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              title="Refresh Preview"
            >
              <RotateCw size={13} className={loadingCms ? "animate-spin" : ""} />
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn-icon h-8 w-8 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hidden sm:inline-flex"
              title="Toggle Fullscreen"
            >
              <Maximize2 size={13} />
            </button>

            <a
              href={previewSource === "remote" ? fullUrl : "https://www.aideployed.io"}
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

      {/* Target Host Settings Strip (When in remote mode) */}
      {previewSource === "remote" && (
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
            <span className="text-[var(--color-ink)] uppercase font-semibold">
              {device === "desktop"
                ? "1440px Fluid"
                : device === "tablet"
                ? "768px iPad"
                : "390px iPhone"}
            </span>
          </div>
        </div>
      )}

      {/* Viewport Canvas */}
      <div className="flex-1 bg-[var(--color-bg)] overflow-auto flex items-stretch">
        {previewSource === "cms" ? (
          <div className="w-full h-full p-4 overflow-y-auto">
            <SectionLivePreview
              sectionKey="hero"
              data={cmsSections["hero"] || {}}
              allSectionsData={cmsSections}
            />
          </div>
        ) : (
          <div className="p-4 flex-1 flex items-center justify-center">
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
        )}
      </div>
    </div>
  );
}
