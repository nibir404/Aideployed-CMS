"use client";

import { useState, useEffect } from "react";
import {
  Layers,
  Save,
  CheckCircle2,
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
  PanelLeftClose,
  PanelRightClose,
  Edit3,
  MousePointer,
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  SlidersHorizontal,
  FileCode,
  Type,
  X,
  ArrowRight,
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

type MobileTab = "navigator" | "canvas" | "inspector";
type InspectorTab = "content" | "style" | "json";

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

  // Builder Controls & Panel States
  const [isEditMode, setIsEditMode] = useState(true);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [canvasTheme, setCanvasTheme] = useState<"dark" | "light">("dark");
  const [showNavigator, setShowNavigator] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Mobile active tab view (for screens < 1024px)
  const [mobileTab, setMobileTab] = useState<MobileTab>("canvas");

  // Inspector tab
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("content");

  // Sync selectedSectionKey when switching pages
  useEffect(() => {
    if (activePage?.sections && activePage.sections.length > 0) {
      setSelectedSectionKey(activePage.sections[0].sectionKey);
    }
  }, [selectedPageSlug, activePage]);

  // Keyboard shortcuts: Cmd+S (Save), Cmd+B (Toggle zen)
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
    // On mobile, automatically return to canvas tab when section is selected
    if (window.innerWidth < 1024) {
      setMobileTab("canvas");
    }
    const el = document.getElementById(sectionKey);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Toggle Zen / Focus mode (hides both side panels)
  const toggleZenMode = () => {
    if (showNavigator || showInspector) {
      setShowNavigator(false);
      setShowInspector(false);
    } else {
      setShowNavigator(true);
      setShowInspector(true);
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
      setSaveStatus("Saved & Synced");
    } catch {
      setSaveStatus("Error saving");
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

  const isZenMode = !showNavigator && !showInspector;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] min-h-[640px] rounded-[6px] overflow-hidden border hairline bg-[var(--color-surface)] shadow-xs relative">
      {/* 1. TOP BUILDER TOOLBAR (Webflow / WordPress Minimalist Chrome) */}
      <header className="h-12 border-b hairline px-3 sm:px-4 flex items-center justify-between gap-2 bg-[var(--color-card)] select-none z-30 shrink-0">
        {/* Left: Navigator toggle & Page Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Navigator toggle (Desktop) */}
          <button
            type="button"
            onClick={() => setShowNavigator(!showNavigator)}
            className={cn(
              "hidden lg:flex p-1.5 rounded-[4px] border hairline transition-all",
              showNavigator
                ? "bg-[var(--color-surface-hover)] text-[var(--color-ink)] border-[var(--color-line-strong)]"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
            )}
            title={showNavigator ? "Hide Navigator (Cmd+1)" : "Show Navigator (Cmd+1)"}
          >
            {showNavigator ? <PanelLeftClose size={13} /> : <PanelLeft size={13} />}
          </button>

          {/* Page Selector Dropdown */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)] hidden sm:inline">
              Page:
            </span>
            <select
              value={selectedPageSlug}
              onChange={(e) => setSelectedPageSlug(e.target.value)}
              className="input-text w-auto py-1 px-2 font-mono text-[11px] font-semibold bg-[var(--color-surface)] border hairline rounded-[4px]"
            >
              {pages.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.slug === "home" ? "Home (/)" : `${p.title} (/${p.slug})`}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[var(--color-ink-dim)] hidden md:inline">·</span>

          {/* Quick Section Selector */}
          <div className="hidden xl:flex items-center gap-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)]">
              Section:
            </span>
            <select
              value={selectedSectionKey}
              onChange={(e) => handleScrollToSection(e.target.value)}
              className="input-text w-auto py-1 px-2 font-mono text-[11px] bg-[var(--color-surface)] border hairline rounded-[4px]"
            >
              {(activePage?.sections || []).map((s) => (
                <option key={s.sectionKey} value={s.sectionKey}>
                  {s.title || s.sectionKey}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Mode, Viewport & Zoom Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Edit vs Preview Mode */}
          <div className="flex items-center bg-[var(--color-surface)] p-0.5 rounded-[4px] border hairline">
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className={cn(
                "px-2 py-1 rounded-[3px] font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.12em] flex items-center gap-1 transition-colors",
                isEditMode
                  ? "bg-cyan-600 text-white font-semibold shadow-xs"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Inline WYSIWYG Editing"
            >
              <Edit3 size={10} />
              <span className="hidden sm:inline">Inline Edit</span>
              <span className="sm:hidden">Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className={cn(
                "px-2 py-1 rounded-[3px] font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.12em] flex items-center gap-1 transition-colors",
                !isEditMode
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold shadow-xs"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Browse Preview Mode"
            >
              <Eye size={10} />
              <span className="hidden sm:inline">Preview</span>
              <span className="sm:hidden">View</span>
            </button>
          </div>

          {/* Device Viewports (Desktop / Tablet / Mobile) */}
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
              title="Desktop Fluid (100%)"
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

          {/* Theme Switcher on Canvas */}
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
              title="Canvas Dark Mode"
            >
              <Moon size={11} />
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
              title="Canvas Light Mode"
            >
              <Sun size={11} />
            </button>
          </div>

          {/* Zen / Focus Toggle (Desktop) */}
          <button
            type="button"
            onClick={toggleZenMode}
            className={cn(
              "hidden md:flex p-1.5 rounded-[4px] border hairline transition-all",
              isZenMode
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
            )}
            title={isZenMode ? "Exit Zen Mode (Show Panels)" : "Zen Focus Mode (Hide Panels)"}
          >
            {isZenMode ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>

        {/* Right: Save & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {saveStatus && (
            <span className="badge-status-success animate-fade-in hidden sm:inline-flex text-[9px] py-0.5">
              <CheckCircle2 size={10} /> {saveStatus}
            </span>
          )}

          {isDirty && !saveStatus && (
            <span className="badge-status-new animate-pulse hidden sm:inline-flex text-[9px] py-0.5">
              Draft
            </span>
          )}

          <button
            onClick={handleSavePage}
            disabled={saving}
            className="btn-pill h-7 sm:h-8 px-2.5 sm:px-3 text-[9px] sm:text-[10px] flex items-center gap-1.5"
            title="Save Page (Cmd+S / Ctrl+S)"
          >
            <Save size={11} className={saving ? "animate-spin" : ""} />
            <span>{saving ? "Saving" : "Save"}</span>
          </button>

          {/* Inspector Dock Toggle (Desktop) */}
          <button
            type="button"
            onClick={() => setShowInspector(!showInspector)}
            className={cn(
              "hidden lg:flex p-1.5 rounded-[4px] border hairline transition-all",
              showInspector
                ? "bg-[var(--color-surface-hover)] text-[var(--color-ink)] border-[var(--color-line-strong)]"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)]"
            )}
            title={showInspector ? "Hide Inspector (Cmd+2)" : "Show Inspector (Cmd+2)"}
          >
            {showInspector ? <PanelRightClose size={13} /> : <PanelRight size={13} />}
          </button>

          <a
            href={
              selectedPageSlug === "home"
                ? "https://www.aideployed.io"
                : `https://www.aideployed.io/${selectedPageSlug}`
            }
            target="_blank"
            rel="noreferrer"
            className="btn-ghost h-7 sm:h-8 px-2 text-[10px] inline-flex items-center"
            title="Open Live Marketing Site"
          >
            <ExternalLink size={11} />
          </a>
        </div>
      </header>

      {/* 2. RESPONSIVE MOBILE/TABLET SEGMENTED TAB SWITCHER (< 1024px) */}
      <div className="lg:hidden h-10 border-b hairline px-3 flex items-center justify-between bg-[var(--color-surface)] z-20 shrink-0">
        <div className="flex items-center bg-[var(--color-card)] p-0.5 rounded-[4px] border hairline w-full">
          <button
            type="button"
            onClick={() => setMobileTab("navigator")}
            className={cn(
              "flex-1 py-1 text-center font-mono text-[10px] uppercase tracking-[0.1em] rounded-[3px] transition-colors flex items-center justify-center gap-1",
              mobileTab === "navigator"
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold shadow-xs"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
          >
            <Compass size={11} />
            <span>Navigator ({activePage?.sections.length || 0})</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("canvas")}
            className={cn(
              "flex-1 py-1 text-center font-mono text-[10px] uppercase tracking-[0.1em] rounded-[3px] transition-colors flex items-center justify-center gap-1",
              mobileTab === "canvas"
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold shadow-xs"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
          >
            <Eye size={11} />
            <span>Canvas</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("inspector")}
            className={cn(
              "flex-1 py-1 text-center font-mono text-[10px] uppercase tracking-[0.1em] rounded-[3px] transition-colors flex items-center justify-center gap-1",
              mobileTab === "inspector"
                ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold shadow-xs"
                : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            )}
          >
            <Sliders size={11} />
            <span>Inspector</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ======================================================== */}
        {/* LEFT DOCK: Webflow-Style Section Navigator               */}
        {/* ======================================================== */}
        <aside
          className={cn(
            "border-r hairline bg-[var(--color-surface)] flex flex-col shrink-0 select-none overflow-y-auto transition-all duration-200 z-10",
            // Desktop visibility
            showNavigator ? "lg:w-60" : "lg:w-0 lg:overflow-hidden lg:border-r-0",
            // Mobile visibility
            mobileTab === "navigator" ? "w-full flex" : "hidden lg:flex"
          )}
        >
          <div className="p-3 border-b hairline flex items-center justify-between bg-[var(--color-card)]/50">
            <div className="flex items-center gap-1.5">
              <Compass size={12} className="text-[var(--color-ink-dim)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink)] font-semibold">
                Page Navigator
              </span>
            </div>
            <span className="font-mono text-[9px] text-[var(--color-ink-dim)] px-1.5 py-0.5 rounded-[2px] bg-[var(--color-surface)] border hairline">
              {activePage?.sections.length || 0}
            </span>
          </div>

          {/* Section Tree List */}
          <div className="p-2 space-y-1 flex-1 overflow-y-auto">
            {(activePage?.sections || []).map((sec, idx) => {
              const isSelected = sec.sectionKey === selectedSectionKey;
              return (
                <button
                  key={sec.sectionKey}
                  type="button"
                  onClick={() => handleScrollToSection(sec.sectionKey)}
                  className={cn(
                    "w-full text-left px-2.5 py-2 rounded-[4px] font-mono text-[11px] uppercase tracking-[0.08em] flex items-center justify-between transition-all group",
                    isSelected
                      ? "bg-[var(--color-card)] text-[var(--color-ink)] font-semibold shadow-xs border hairline-strong ring-1 ring-[var(--color-line-strong)]"
                      : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[9px] text-[var(--color-ink-dim)] font-mono">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate">{sec.title || sec.sectionKey}</span>
                  </div>
                  <span className="text-[8px] font-mono text-[var(--color-ink-dim)] lowercase opacity-60 group-hover:opacity-100 shrink-0">
                    #{sec.sectionKey}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer Guide in Navigator */}
          <div className="p-3 border-t hairline bg-[var(--color-card)]/30 text-[10px] text-[var(--color-ink-dim)] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                Interaction Tip
              </span>
              <kbd className="font-mono text-[9px] px-1 bg-[var(--color-surface)] border hairline rounded-[2px]">
                Click
              </kbd>
            </div>
            <p className="text-[10px] leading-relaxed">
              Click any element in canvas to edit text inline. Select a section above to focus properties.
            </p>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* CENTER WORKSPACE: The Interactive Website Canvas         */}
        {/* ======================================================== */}
        <main
          className={cn(
            "flex-1 bg-[var(--color-bg)] overflow-y-auto p-2 sm:p-4 md:p-6 flex flex-col items-center min-w-0 transition-all",
            // Mobile visibility: hide when mobile tab is navigator or inspector
            mobileTab !== "canvas" && "hidden lg:flex"
          )}
        >
          {/* Quick Floating Restore Buttons if panels are collapsed on desktop */}
          <div className="w-full flex items-center justify-between mb-2 text-xs select-none">
            {!showNavigator && (
              <button
                type="button"
                onClick={() => setShowNavigator(true)}
                className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-[4px] border hairline bg-[var(--color-card)] hover:bg-[var(--color-surface-hover)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] font-mono text-[10px] transition-colors"
                title="Expand Navigator Tree"
              >
                <PanelLeft size={11} />
                <span>Show Navigator</span>
              </button>
            )}
            <div className="flex-1" />
            {!showInspector && (
              <button
                type="button"
                onClick={() => setShowInspector(true)}
                className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-[4px] border hairline bg-[var(--color-card)] hover:bg-[var(--color-surface-hover)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] font-mono text-[10px] transition-colors"
                title="Expand Inspector Dock"
              >
                <PanelRight size={11} />
                <span>Show Inspector</span>
              </button>
            )}
          </div>

          {/* The Page Canvas Wrapper with Viewport Constraint */}
          <div
            className={cn(
              "w-full transition-all duration-300 rounded-[6px] overflow-hidden border hairline shadow-xl relative",
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

        {/* ======================================================== */}
        {/* RIGHT DOCK: Webflow-Style Property Inspector             */}
        {/* ======================================================== */}
        <aside
          className={cn(
            "border-l hairline bg-[var(--color-surface)] flex flex-col shrink-0 overflow-y-auto transition-all duration-200 z-10",
            // Desktop visibility
            showInspector ? "lg:w-80" : "lg:w-0 lg:overflow-hidden lg:border-l-0",
            // Mobile visibility
            mobileTab === "inspector" ? "w-full flex" : "hidden lg:flex"
          )}
        >
          {/* Inspector Header with Section Key and Tab Switcher */}
          <div className="p-3 border-b hairline bg-[var(--color-card)]/50 space-y-2 select-none">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)]">
                  Inspector //
                </span>
                <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-ink)]">
                  {selectedSectionKey || "No Section Selected"}
                </h4>
              </div>

              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[2px] border hairline bg-[var(--color-surface)] text-[var(--color-ink-dim)]">
                {selectedPageSlug}
              </span>
            </div>

            {/* Inspector Inner Tabs: [Content] [Style/Attributes] [JSON] */}
            <div className="flex items-center bg-[var(--color-surface)] p-0.5 rounded-[4px] border hairline">
              <button
                type="button"
                onClick={() => setInspectorTab("content")}
                className={cn(
                  "flex-1 py-1 font-mono text-[10px] uppercase tracking-[0.1em] rounded-[3px] transition-colors flex items-center justify-center gap-1",
                  inspectorTab === "content"
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold shadow-xs"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                )}
              >
                <Type size={10} />
                <span>Content</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab("style")}
                className={cn(
                  "flex-1 py-1 font-mono text-[10px] uppercase tracking-[0.1em] rounded-[3px] transition-colors flex items-center justify-center gap-1",
                  inspectorTab === "style"
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold shadow-xs"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                )}
              >
                <SlidersHorizontal size={10} />
                <span>Props</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab("json")}
                className={cn(
                  "flex-1 py-1 font-mono text-[10px] uppercase tracking-[0.1em] rounded-[3px] transition-colors flex items-center justify-center gap-1",
                  inspectorTab === "json"
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold shadow-xs"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                )}
              >
                <FileCode size={10} />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Inspector Body based on Active Inspector Tab */}
          <div className="p-3 sm:p-4 space-y-4 text-xs flex-1 overflow-y-auto">
            {/* EMPTY STATE HANDLING: when currentActiveSectionData is empty */}
            {Object.keys(currentActiveSectionData).length === 0 ? (
              <div className="p-6 text-center border hairline rounded-[4px] bg-[var(--color-card)] space-y-2">
                <Compass size={20} className="mx-auto text-[var(--color-ink-dim)]" />
                <div className="font-mono text-xs font-medium text-[var(--color-ink)]">
                  Section Empty or Initializing
                </div>
                <p className="text-[11px] text-[var(--color-ink-muted)] leading-relaxed">
                  Select a section from the Navigator to view and tweak its schema properties.
                </p>
              </div>
            ) : (
              <>
                {/* TAB 1: CONTENT */}
                {inspectorTab === "content" && (
                  <div className="space-y-3.5">
                    {/* Eyebrow */}
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

                    {/* Headline / Title */}
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

                    {/* Headline Highlight */}
                    {(currentActiveSectionData.headlineHighlight !== undefined ||
                      currentActiveSectionData.titleHighlight !== undefined) && (
                      <div>
                        <label className="label-text">Headline Highlight Accent</label>
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

                    {/* Subtitle */}
                    {currentActiveSectionData.subtitle !== undefined && (
                      <div>
                        <label className="label-text">Subtitle</label>
                        <input
                          type="text"
                          value={currentActiveSectionData.subtitle || ""}
                          onChange={(e) =>
                            handleUpdateField(selectedSectionKey, "subtitle", e.target.value)
                          }
                          className="input-text text-xs"
                        />
                      </div>
                    )}

                    {/* Description */}
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

                    {/* Primary CTA */}
                    {currentActiveSectionData.primaryCta !== undefined && (
                      <div className="pt-2 border-t hairline space-y-2">
                        <span className="label-text">Primary CTA Button</span>
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
                          placeholder="Label (e.g. Schedule Briefing)"
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
                          placeholder="Href (e.g. /contact)"
                          className="input-text text-xs input-mono"
                        />
                      </div>
                    )}

                    {/* Secondary CTA */}
                    {currentActiveSectionData.secondaryCta !== undefined && (
                      <div className="pt-2 border-t hairline space-y-2">
                        <span className="label-text">Secondary CTA Button</span>
                        <input
                          type="text"
                          value={currentActiveSectionData.secondaryCta?.label || ""}
                          onChange={(e) =>
                            handleUpdateField(
                              selectedSectionKey,
                              "secondaryCta.label",
                              e.target.value
                            )
                          }
                          placeholder="Label (e.g. Explore Platform)"
                          className="input-text text-xs"
                        />
                        <input
                          type="text"
                          value={currentActiveSectionData.secondaryCta?.href || ""}
                          onChange={(e) =>
                            handleUpdateField(
                              selectedSectionKey,
                              "secondaryCta.href",
                              e.target.value
                            )
                          }
                          placeholder="Href (e.g. /platform)"
                          className="input-text text-xs input-mono"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: PROPS & ATTRIBUTES */}
                {inspectorTab === "style" && (
                  <div className="space-y-3.5">
                    <div className="p-3 bg-[var(--color-card)] rounded-[4px] border hairline space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="label-text mb-0">Identifier</span>
                        <span className="font-mono text-[10px] text-[var(--color-ink)] font-semibold">
                          #{selectedSectionKey}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="label-text mb-0">Parent Page</span>
                        <span className="font-mono text-[10px] text-[var(--color-ink)]">
                          /{selectedPageSlug}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="label-text mb-0">Live Status</span>
                        <span className="text-emerald-500 font-mono text-[9px] uppercase font-semibold">
                          Online
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="label-text">WYSIWYG Editing</span>
                      <p className="text-[11px] text-[var(--color-ink-muted)] leading-relaxed">
                        Inline click-to-edit is active on the canvas. Hover over any text element on the canvas to see its element tag and click to edit.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleScrollToSection(selectedSectionKey)}
                      className="btn-ghost w-full h-8 text-[10px] flex items-center justify-center gap-1.5"
                    >
                      <Compass size={11} />
                      <span>Scroll to Section</span>
                    </button>
                  </div>
                )}

                {/* TAB 3: RAW JSON SCHEMA */}
                {inspectorTab === "json" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="label-text mb-0">JSON Payload</span>
                      <span className="font-mono text-[9px] text-[var(--color-ink-dim)]">
                        Live Sync
                      </span>
                    </div>
                    <textarea
                      rows={14}
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
                      className="input-text input-mono text-[10px] leading-relaxed resize-y w-full"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
