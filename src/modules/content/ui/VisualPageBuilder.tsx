"use client";

import { useState, useEffect } from "react";
import {
  Save,
  CheckCircle2,
  Eye,
  Monitor,
  Smartphone,
  ExternalLink,
  Sun,
  Moon,
  Edit3,
  Sliders,
  List,
  X,
  ChevronRight,
  Code2,
  ChevronDown,
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

  // Minimal Workspace States (Canvas is Hero by default!)
  const [isEditMode, setIsEditMode] = useState(true);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [canvasTheme, setCanvasTheme] = useState<"dark" | "light">("dark");
  const [isOutlineOpen, setIsOutlineOpen] = useState(false); // Left sections drawer
  const [isInspectorOpen, setIsInspectorOpen] = useState(false); // Right properties drawer
  const [showRawJson, setShowRawJson] = useState(false);

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
      setSaveStatus("Saved");
    } catch {
      setSaveStatus("Error saving");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const currentSectionsData = pageDrafts[selectedPageSlug] || {};
  const currentActiveSectionData = currentSectionsData[selectedSectionKey] || {};

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] min-h-[640px] rounded-[8px] overflow-hidden border hairline bg-[var(--color-surface)] shadow-xs relative">
      {/* 1. CLEAN, UNCLUTTERED TOP TOOLBAR */}
      <header className="h-13 border-b hairline px-3 sm:px-5 flex items-center justify-between gap-3 bg-[var(--color-card)] select-none z-30 shrink-0">
        {/* Left: Page Switcher & Section Navigator Button */}
        <div className="flex items-center gap-2">
          {/* Outline Drawer Toggle */}
          <button
            type="button"
            onClick={() => setIsOutlineOpen(!isOutlineOpen)}
            className={cn(
              "btn-ghost h-8 px-2.5 text-xs flex items-center gap-1.5",
              isOutlineOpen
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold border-transparent"
                : "bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
            title="Toggle Sections Outline Drawer"
          >
            <List size={13} />
            <span className="hidden sm:inline">Sections</span>
            <span className="text-[10px] opacity-70">({activePage?.sections.length || 0})</span>
          </button>

          {/* Page Dropdown */}
          <div className="relative flex items-center">
            <select
              value={selectedPageSlug}
              onChange={(e) => setSelectedPageSlug(e.target.value)}
              className="appearance-none input-text h-8 pl-3 pr-7 font-mono text-xs font-semibold bg-[var(--color-surface)] cursor-pointer"
            >
              {pages.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.slug === "home" ? "Homepage (/)" : `${p.title} (/${p.slug})`}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 text-[var(--color-ink-dim)] pointer-events-none" />
          </div>

          {/* Quick Jump Selector */}
          <div className="relative hidden md:flex items-center">
            <select
              value={selectedSectionKey}
              onChange={(e) => handleScrollToSection(e.target.value)}
              className="appearance-none input-text h-8 pl-2.5 pr-6 font-mono text-[11px] bg-[var(--color-surface)] cursor-pointer text-[var(--color-ink-muted)]"
            >
              {(activePage?.sections || []).map((s) => (
                <option key={s.sectionKey} value={s.sectionKey}>
                  Jump: {s.title || s.sectionKey}
                </option>
              ))}
            </select>
            <ChevronDown size={11} className="absolute right-2 text-[var(--color-ink-dim)] pointer-events-none" />
          </div>
        </div>

        {/* Center: Device & Mode Controls */}
        <div className="flex items-center gap-2">
          {/* Edit Mode Toggle */}
          <div className="h-8 flex items-center bg-[var(--color-surface)] p-0.5 rounded-[4px] border hairline">
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className={cn(
                "h-full px-2.5 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.1em] flex items-center gap-1 transition-colors",
                isEditMode
                  ? "bg-cyan-600 text-white font-semibold shadow-xs"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Click on any text on the page to edit inline"
            >
              <Edit3 size={11} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className={cn(
                "h-full px-2.5 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.1em] flex items-center gap-1 transition-colors",
                !isEditMode
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold shadow-xs"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Preview page without edit highlights"
            >
              <Eye size={11} />
              <span>Preview</span>
            </button>
          </div>

          {/* Desktop vs Mobile Viewport */}
          <div className="hidden sm:flex h-8 items-center bg-[var(--color-surface)] p-0.5 rounded-[4px] border hairline">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={cn(
                "h-full px-2 rounded-[3px] flex items-center justify-center transition-colors",
                device === "desktop"
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Desktop View"
            >
              <Monitor size={13} />
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
              title="Mobile View"
            >
              <Smartphone size={13} />
            </button>
          </div>

          {/* Canvas Theme Toggle */}
          <button
            type="button"
            onClick={() => setCanvasTheme(canvasTheme === "dark" ? "light" : "dark")}
            className="btn-icon h-8 w-8 bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            title={`Switch preview theme (current: ${canvasTheme})`}
          >
            {canvasTheme === "dark" ? <Moon size={13} /> : <Sun size={13} />}
          </button>
        </div>

        {/* Right: Save & Properties Drawer */}
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="badge-status-success animate-fade-in text-[10px] py-0.5">
              <CheckCircle2 size={10} /> {saveStatus}
            </span>
          )}

          {isDirty && !saveStatus && (
            <span className="badge-status-new animate-pulse text-[10px] py-0.5 hidden sm:inline-flex">
              Unsaved
            </span>
          )}

          {/* Save Button */}
          <button
            onClick={handleSavePage}
            disabled={saving}
            className="btn-pill h-8 px-3.5 text-[11px] font-semibold flex items-center gap-1.5 shadow-xs"
            title="Save Page Changes (Cmd+S)"
          >
            <Save size={12} className={saving ? "animate-spin" : ""} />
            <span>{saving ? "Saving..." : "Save"}</span>
          </button>

          {/* Section Inspector Drawer Toggle */}
          <button
            type="button"
            onClick={() => setIsInspectorOpen(!isInspectorOpen)}
            className={cn(
              "btn-icon h-8 w-8 transition-all",
              isInspectorOpen
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] border-transparent"
                : "bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
            title="Section Properties Panel"
          >
            <Sliders size={13} />
          </button>

          <a
            href={
              selectedPageSlug === "home"
                ? "https://www.aideployed.io"
                : `https://www.aideployed.io/${selectedPageSlug}`
            }
            target="_blank"
            rel="noreferrer"
            className="btn-ghost h-8 px-2.5 text-[10px] inline-flex items-center"
            title="View Live Website"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      </header>

      {/* 2. THE MAIN EXPANSIVE CANVAS WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ======================================================== */}
        {/* SLIDE-OVER DRAWER: Sections Outline (Unobtrusive)        */}
        {/* ======================================================== */}
        {isOutlineOpen && (
          <>
            {/* Backdrop on small screens */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
              onClick={() => setIsOutlineOpen(false)}
            />

            <aside className="absolute lg:relative inset-y-0 left-0 w-64 bg-[var(--color-card)] border-r hairline z-40 flex flex-col shadow-xl animate-fade-in select-none">
              <div className="p-3.5 border-b hairline flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass size={13} className="text-[var(--color-ink-dim)]" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-ink)]">
                    Page Outline
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOutlineOpen(false)}
                  className="btn-icon h-8 w-8 border-0 text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                  title="Close Outline Drawer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="p-2 space-y-1 flex-1 overflow-y-auto">
                {(activePage?.sections || []).map((sec, idx) => {
                  const isSelected = sec.sectionKey === selectedSectionKey;
                  return (
                    <button
                      key={sec.sectionKey}
                      type="button"
                      onClick={() => {
                        handleScrollToSection(sec.sectionKey);
                        if (window.innerWidth < 1024) setIsOutlineOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-[5px] font-mono text-[11px] uppercase tracking-[0.06em] flex items-center justify-between transition-all group",
                        isSelected
                          ? "bg-[var(--color-surface)] text-[var(--color-ink)] font-semibold border hairline-strong shadow-xs ring-1 ring-[var(--color-line-strong)]"
                          : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]"
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] text-[var(--color-ink-dim)] font-mono">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate">{sec.title || sec.sectionKey}</span>
                      </div>
                      <ChevronRight size={11} className="text-[var(--color-ink-dim)] opacity-40 group-hover:opacity-100" />
                    </button>
                  );
                })}
              </div>

              <div className="p-3 border-t hairline bg-[var(--color-surface)] text-[10px] text-[var(--color-ink-muted)]">
                Click any section to jump directly to it on the canvas.
              </div>
            </aside>
          </>
        )}

        {/* ======================================================== */}
        {/* CENTER CANVASES: Full-Width Clean Website Preview        */}
        {/* ======================================================== */}
        <main className="flex-1 bg-[var(--color-bg)] overflow-y-auto p-3 sm:p-6 flex flex-col items-center min-w-0">
          <div
            data-testid="canvas-viewport-container"
            className={cn(
              "w-full transition-all duration-300 rounded-[8px] overflow-hidden border hairline shadow-xl relative",
              canvasTheme === "light"
                ? "light bg-[#f6f1e7] text-[#111111]"
                : "bg-[#0a0a0a] text-[#ffffff]",
              device === "mobile" ? "max-w-[390px]" : "w-full"
            )}
          >
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

        {/* ======================================================== */}
        {/* SLIDE-OVER DRAWER: Focused Section Inspector             */}
        {/* ======================================================== */}
        {isInspectorOpen && (
          <>
            {/* Backdrop on mobile */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-xs z-30 lg:hidden"
              onClick={() => setIsInspectorOpen(false)}
            />

            <aside className="absolute lg:relative inset-y-0 right-0 w-80 sm:w-88 bg-[var(--color-card)] border-l hairline z-40 flex flex-col shadow-xl animate-fade-in select-none">
              <div className="p-3.5 border-b hairline flex items-center justify-between bg-[var(--color-surface)]">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)]">
                    Section Properties
                  </span>
                  <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-[var(--color-ink)] truncate">
                    #{selectedSectionKey}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInspectorOpen(false)}
                  className="btn-icon h-8 w-8 border-0 text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                  title="Close Section Properties"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Inspector Content Fields */}
              <div className="p-4 space-y-4 text-xs flex-1 overflow-y-auto">
                {currentActiveSectionData.eyebrow !== undefined && (
                  <div>
                    <label className="label-text">Eyebrow Badge</label>
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
                      className="input-text text-xs font-medium"
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
                      rows={3}
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

                {/* Primary CTA Button */}
                {currentActiveSectionData.primaryCta !== undefined && (
                  <div className="p-3 bg-[var(--color-surface)] rounded-[6px] border hairline space-y-2">
                    <span className="label-text mb-0 font-semibold">Primary CTA Button</span>
                    <div>
                      <label className="label-text text-[9px]">Button Label</label>
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
                        className="input-text text-xs"
                      />
                    </div>
                    <div>
                      <label className="label-text text-[9px]">Target Link</label>
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
                        className="input-text text-xs input-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Advanced Raw JSON (Collapsible) */}
                <div className="pt-2 border-t hairline">
                  <button
                    type="button"
                    onClick={() => setShowRawJson(!showRawJson)}
                    className="w-full flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] py-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <Code2 size={12} />
                      <span>Advanced JSON</span>
                    </span>
                    <ChevronDown size={11} className={cn("transition-transform", showRawJson && "rotate-180")} />
                  </button>

                  {showRawJson && (
                    <textarea
                      rows={10}
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
                      className="mt-2 input-text input-mono text-[10px] leading-relaxed resize-y w-full"
                    />
                  )}
                </div>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
