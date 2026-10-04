"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  Save,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Code2,
  Plus,
  Trash2,
  Sun,
  Moon,
  PanelLeft,
  PanelRight,
  Edit3,
  MousePointer,
  Compass,
} from "lucide-react";
import { cn } from "@/core/lib/cn";
import { VisualPageCanvas } from "./VisualPageCanvas";

export interface PageRecord {
  id: string;
  slug: string;
  title: string;
  seoTitle?: string | null;
  seoDesc?: string | null;
  sections: {
    id: string;
    sectionKey: string;
    title?: string | null;
    contentJson: string;
    orderIndex: number;
    updatedAt: string | Date;
  }[];
}

export function VisualPageBuilder({
  initialPages,
  initialPageSlug = "home",
}: {
  initialPages: PageRecord[];
  initialPageSlug?: string;
}) {
  const [pages] = useState<PageRecord[]>(initialPages);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>(initialPageSlug);

  // Active page object
  const activePage = pages.find((p) => p.slug === selectedPageSlug) || pages[0];

  // Selected section within the active page
  const [selectedSectionKey, setSelectedSectionKey] = useState<string>(
    activePage?.sections[0]?.sectionKey || "hero"
  );

  // Master Draft Data State: keyed by pageSlug -> sectionKey -> content object
  const [pageDrafts, setPageDrafts] = useState<Record<string, Record<string, any>>>(() => {
    const initial: Record<string, Record<string, any>> = {};
    for (const p of initialPages) {
      initial[p.slug] = {};
      for (const s of p.sections) {
        try {
          initial[p.slug][s.sectionKey] = JSON.parse(s.contentJson);
        } catch {
          initial[p.slug][s.sectionKey] = {};
        }
      }
    }
    return initial;
  });

  // Track if changes are unsaved
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Builder Controls
  const [isEditMode, setIsEditMode] = useState(true);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [canvasTheme, setCanvasTheme] = useState<"dark" | "light">("dark");
  const [showNavigator, setShowNavigator] = useState(true);
  const [showInspector, setShowInspector] = useState(true);

  // Sync selectedSectionKey when switching pages
  useEffect(() => {
    if (activePage?.sections && activePage.sections.length > 0) {
      setSelectedSectionKey(activePage.sections[0].sectionKey);
    }
  }, [selectedPageSlug, activePage]);

  // Keyboard shortcut: Cmd+S / Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSavePage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // Update a specific field in the draft
  const handleUpdateField = (
    sectionKey: string,
    fieldPath: string,
    newValue: unknown
  ) => {
    setIsDirty(true);
    setPageDrafts((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!copy[selectedPageSlug]) copy[selectedPageSlug] = {};
      if (!copy[selectedPageSlug][sectionKey]) copy[selectedPageSlug][sectionKey] = {};

      const currentSection = copy[selectedPageSlug][sectionKey];
      const keys = fieldPath.split(".");
      let target = currentSection;

      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (target[k] === undefined || target[k] === null) {
          target[k] = {};
        }
        target = target[k];
      }
      target[keys[keys.length - 1]] = newValue;

      return copy;
    });
  };

  // Scroll smoothly to section on the canvas
  const handleScrollToSection = (sectionKey: string) => {
    setSelectedSectionKey(sectionKey);
    const el = document.getElementById(sectionKey);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Save all modified sections of the current page
  const handleSavePage = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const sectionsMap = pageDrafts[selectedPageSlug] || {};
      const sectionKeys = Object.keys(sectionsMap);

      // Save all sections sequentially or in parallel
      await Promise.all(
        sectionKeys.map((secKey) =>
          fetch("/api/admin/sections/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pageSlug: selectedPageSlug,
              sectionKey: secKey,
              content: sectionsMap[secKey],
            }),
          })
        )
      );

      // Trigger cache revalidation
      await fetch("/api/v1/revalidate", { method: "POST" });

      setIsDirty(false);
      setSaveStatus("Saved & Revalidated");
    } catch {
      setSaveStatus("Error saving changes");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const currentSectionsData = pageDrafts[selectedPageSlug] || {};
  const currentActiveSectionData = currentSectionsData[selectedSectionKey] || {};

  const getViewportWidth = () => {
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

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] min-h-[750px] rounded-[6px] overflow-hidden border hairline bg-[var(--color-surface)]">
      {/* 1. TOP BUILDER TOOLBAR (Webflow / WordPress Style) */}
      <header className="h-14 border-b hairline px-4 flex flex-wrap items-center justify-between gap-3 bg-[var(--color-card)] select-none z-30">
        {/* Left: Page Selector & Section Dropdown */}
        <div className="flex items-center gap-2">
          {/* Navigator toggle */}
          <button
            type="button"
            onClick={() => setShowNavigator(!showNavigator)}
            className={cn(
              "p-1.5 rounded-[4px] border hairline transition-colors",
              showNavigator
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
            title="Toggle Section Navigator Tree (Left Dock)"
          >
            <PanelLeft size={13} />
          </button>

          {/* Page Selector Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)]">
              Page:
            </span>
            <select
              value={selectedPageSlug}
              onChange={(e) => setSelectedPageSlug(e.target.value)}
              className="input-text w-auto py-1 font-mono text-xs font-semibold"
            >
              {pages.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.slug === "home" ? "Homepage (/)" : `${p.title} (/${p.slug})`}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[var(--color-ink-dim)] hidden sm:inline">·</span>

          {/* Quick Section Selector */}
          <div className="hidden md:flex items-center gap-1.5">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)]">
              Section:
            </span>
            <select
              value={selectedSectionKey}
              onChange={(e) => handleScrollToSection(e.target.value)}
              className="input-text w-auto py-1 font-mono text-xs"
            >
              {(activePage?.sections || []).map((s) => (
                <option key={s.sectionKey} value={s.sectionKey}>
                  {s.title || s.sectionKey}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Mode & Viewport Controls */}
        <div className="flex items-center gap-2">
          {/* Edit vs Preview Mode */}
          <div className="flex items-center bg-[var(--color-surface)] p-0.5 rounded-[4px] border hairline">
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className={cn(
                "px-2.5 py-1 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.12em] flex items-center gap-1.5 transition-colors",
                isEditMode
                  ? "bg-cyan-600 text-white font-semibold shadow-sm"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Visual Inline Edit Mode (Click to edit text directly on page)"
            >
              <Edit3 size={11} />
              <span>Inline Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className={cn(
                "px-2.5 py-1 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.12em] flex items-center gap-1.5 transition-colors",
                !isEditMode
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold shadow-sm"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Live Browse Preview Mode (Inspect without edit highlights)"
            >
              <Eye size={11} />
              <span>Preview</span>
            </button>
          </div>

          {/* Device Viewports */}
          <div className="hidden sm:flex items-center bg-[var(--color-surface)] p-0.5 rounded-[4px] border hairline">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={cn(
                "p-1.5 rounded-[3px] transition-colors",
                device === "desktop"
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Desktop (100% Fluid)"
            >
              <Monitor size={12} />
            </button>
            <button
              type="button"
              onClick={() => setDevice("tablet")}
              className={cn(
                "p-1.5 rounded-[3px] transition-colors",
                device === "tablet"
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Tablet (768px)"
            >
              <Tablet size={12} />
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={cn(
                "p-1.5 rounded-[3px] transition-colors",
                device === "mobile"
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Mobile (390px)"
            >
              <Smartphone size={12} />
            </button>
          </div>

          {/* Canvas Theme Switcher */}
          <div className="flex items-center bg-[var(--color-surface)] p-0.5 rounded-[4px] border hairline">
            <button
              type="button"
              onClick={() => setCanvasTheme("dark")}
              className={cn(
                "p-1.5 rounded-[3px] transition-colors",
                canvasTheme === "dark"
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Preview Dark Theme"
            >
              <Moon size={12} />
            </button>
            <button
              type="button"
              onClick={() => setCanvasTheme("light")}
              className={cn(
                "p-1.5 rounded-[3px] transition-colors",
                canvasTheme === "light"
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Preview Light Theme (Paper Cream)"
            >
              <Sun size={12} />
            </button>
          </div>
        </div>

        {/* Right: Save & Actions */}
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="badge-status-success animate-fade-in">
              <CheckCircle2 size={11} /> {saveStatus}
            </span>
          )}

          {isDirty && !saveStatus && (
            <span className="badge-status-new animate-pulse">
              Draft Modified
            </span>
          )}

          <button
            onClick={handleSavePage}
            disabled={saving}
            className="btn-pill h-8 px-3.5 text-[10px] flex items-center gap-1.5"
            title="Save all modified sections (Cmd+S / Ctrl+S)"
          >
            <Save size={12} className={saving ? "animate-spin" : ""} />
            <span>{saving ? "Saving..." : "Save Page"}</span>
          </button>

          {/* Inspector Dock Toggle */}
          <button
            type="button"
            onClick={() => setShowInspector(!showInspector)}
            className={cn(
              "p-1.5 rounded-[4px] border hairline transition-colors",
              showInspector
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
            title="Toggle Webflow Inspector Panel (Right Dock)"
          >
            <PanelRight size={13} />
          </button>

          <a
            href={
              selectedPageSlug === "home"
                ? "https://www.aideployed.io"
                : `https://www.aideployed.io/${selectedPageSlug}`
            }
            target="_blank"
            rel="noreferrer"
            className="btn-ghost h-8 px-2 text-[10px] inline-flex items-center"
            title="Open Live Deployed Site"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      </header>

      {/* 2. MAIN 3-PANE WORKSPACE: [NAVIGATOR] | [VISUAL CANVAS] | [INSPECTOR] */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT DOCK: Webflow-style Navigator Tree */}
        {showNavigator && (
          <aside className="w-64 border-r hairline bg-[var(--color-surface)] flex flex-col shrink-0 select-none overflow-y-auto">
            <div className="p-3 border-b hairline flex items-center justify-between">
              <span className="eyebrow block">Page Navigator</span>
              <span className="font-mono text-[9px] text-[var(--color-ink-dim)]">
                {activePage?.sections.length || 0} sections
              </span>
            </div>

            <div className="p-2 space-y-1">
              {(activePage?.sections || []).map((sec, idx) => {
                const isSelected = sec.sectionKey === selectedSectionKey;
                return (
                  <button
                    key={sec.sectionKey}
                    type="button"
                    onClick={() => handleScrollToSection(sec.sectionKey)}
                    className={cn(
                      "w-full text-left px-2.5 py-2 rounded-[4px] font-mono text-[11px] uppercase tracking-[0.1em] flex items-center justify-between transition-all group",
                      isSelected
                        ? "bg-[var(--color-card)] text-[var(--color-ink)] font-semibold shadow-sm border hairline-strong ring-1 ring-[var(--color-line-strong)]"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[9px] text-[var(--color-ink-dim)] font-mono">
                        0{idx + 1}
                      </span>
                      <span className="truncate">{sec.title || sec.sectionKey}</span>
                    </div>
                    <span className="text-[8px] font-mono text-[var(--color-ink-dim)] lowercase opacity-60 group-hover:opacity-100">
                      {sec.sectionKey}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto p-3 border-t hairline text-[11px] text-[var(--color-ink-dim)] leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-ink-muted)]">
                <Compass size={11} />
                <span>Webflow Navigation</span>
              </div>
              <p className="text-[10px]">
                Click any section above to jump right to it. Hover over text on the page to edit inline.
              </p>
            </div>
          </aside>
        )}

        {/* CENTER PANE: The Visual Website Canvas */}
        <main className="flex-1 bg-[var(--color-bg)] overflow-y-auto p-4 flex flex-col items-center">
          <div
            className={cn(
              "w-full transition-all duration-300 rounded-[6px] overflow-hidden border hairline shadow-2xl relative",
              canvasTheme === "light"
                ? "light bg-[#f6f1e7] text-[#111111]"
                : "bg-[#0a0a0a] text-[#ffffff]",
              getViewportWidth()
            )}
          >
            {/* Visual Page Canvas */}
            <VisualPageCanvas
              pageSlug={selectedPageSlug}
              sectionsData={currentSectionsData}
              onUpdateField={handleUpdateField}
              isEditMode={isEditMode}
              selectedSectionKey={selectedSectionKey}
              onSelectSection={(key) => setSelectedSectionKey(key)}
            />
          </div>
        </main>

        {/* RIGHT DOCK: Webflow-style Element & Section Property Inspector */}
        {showInspector && (
          <aside className="w-80 border-l hairline bg-[var(--color-surface)] flex flex-col shrink-0 overflow-y-auto">
            <div className="p-3 border-b hairline flex items-center justify-between bg-[var(--color-card)]">
              <div>
                <span className="eyebrow block">Inspector Dock</span>
                <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-ink)] mt-0.5">
                  {selectedSectionKey}
                </h4>
              </div>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[2px] border hairline bg-[var(--color-surface)] text-[var(--color-ink-dim)]">
                Active
              </span>
            </div>

            {/* Quick Properties Editor for the currently focused section */}
            <div className="p-4 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="label-text">Section Identifier</span>
                <div className="font-mono text-xs text-[var(--color-ink)] bg-[var(--color-card)] p-2 rounded-[3px] border hairline">
                  {selectedPageSlug} / {selectedSectionKey}
                </div>
              </div>

              {/* Dynamic Property Inputs */}
              {currentActiveSectionData.eyebrow !== undefined && (
                <div>
                  <label className="label-text">Eyebrow</label>
                  <input
                    type="text"
                    value={currentActiveSectionData.eyebrow || ""}
                    onChange={(e) =>
                      handleUpdateField(selectedSectionKey, "eyebrow", e.target.value)
                    }
                    className="input-text text-xs input-mono"
                  />
                </div>
              )}

              {(currentActiveSectionData.headline !== undefined ||
                currentActiveSectionData.title !== undefined) && (
                <div>
                  <label className="label-text">Headline / Title</label>
                  <input
                    type="text"
                    value={
                      currentActiveSectionData.headline ||
                      currentActiveSectionData.title ||
                      ""
                    }
                    onChange={(e) =>
                      handleUpdateField(
                        selectedSectionKey,
                        currentActiveSectionData.headline !== undefined
                          ? "headline"
                          : "title",
                        e.target.value
                      )
                    }
                    className="input-text text-xs font-semibold"
                  />
                </div>
              )}

              {(currentActiveSectionData.headlineHighlight !== undefined ||
                currentActiveSectionData.titleHighlight !== undefined) && (
                <div>
                  <label className="label-text">Headline Highlight</label>
                  <input
                    type="text"
                    value={
                      currentActiveSectionData.headlineHighlight ||
                      currentActiveSectionData.titleHighlight ||
                      ""
                    }
                    onChange={(e) =>
                      handleUpdateField(
                        selectedSectionKey,
                        currentActiveSectionData.headlineHighlight !== undefined
                          ? "headlineHighlight"
                          : "titleHighlight",
                        e.target.value
                      )
                    }
                    className="input-text text-xs"
                  />
                </div>
              )}

              {currentActiveSectionData.description !== undefined && (
                <div>
                  <label className="label-text">Description</label>
                  <textarea
                    rows={4}
                    value={currentActiveSectionData.description || ""}
                    onChange={(e) =>
                      handleUpdateField(
                        selectedSectionKey,
                        "description",
                        e.target.value
                      )
                    }
                    className="input-text text-xs leading-relaxed"
                  />
                </div>
              )}

              {currentActiveSectionData.primaryCta !== undefined && (
                <div className="pt-2 border-t hairline space-y-2">
                  <span className="label-text">Primary CTA</span>
                  <input
                    type="text"
                    value={currentActiveSectionData.primaryCta?.label || ""}
                    onChange={(e) =>
                      handleUpdateField(
                        selectedSectionKey,
                        "primaryCta.label",
                        e.target.value
                      )
                    }
                    placeholder="Button Label"
                    className="input-text text-xs"
                  />
                  <input
                    type="text"
                    value={currentActiveSectionData.primaryCta?.href || ""}
                    onChange={(e) =>
                      handleUpdateField(
                        selectedSectionKey,
                        "primaryCta.href",
                        e.target.value
                      )
                    }
                    placeholder="Button Link"
                    className="input-text text-xs input-mono"
                  />
                </div>
              )}

              {/* JSON Direct Payload View */}
              <div className="pt-3 border-t hairline space-y-2">
                <span className="label-text">Raw JSON Schema</span>
                <textarea
                  rows={8}
                  value={JSON.stringify(currentActiveSectionData, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setIsDirty(true);
                      setPageDrafts((prev) => ({
                        ...prev,
                        [selectedPageSlug]: {
                          ...prev[selectedPageSlug],
                          [selectedSectionKey]: parsed,
                        },
                      }));
                    } catch {}
                  }}
                  className="input-text input-mono text-[10px] leading-relaxed resize-y"
                />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
