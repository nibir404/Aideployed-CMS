"use client";

import { useState } from "react";
import {
  Layers,
  Save,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders,
  Sparkles,
  Monitor,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/core/lib/cn";

interface SectionRecord {
  id: string;
  sectionKey: string;
  title?: string | null;
  contentJson: string;
  orderIndex: number;
  updatedAt: string | Date;
}

export function ContentStudio({
  sections,
  pageSlug = "home",
}: {
  sections: SectionRecord[];
  pageSlug?: string;
}) {
  const [selectedKey, setSelectedKey] = useState<string>(
    sections[0]?.sectionKey || "hero"
  );
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("https://www.aideployed.io");
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);

  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const s of sections) {
      try {
        initial[s.sectionKey] = JSON.parse(s.contentJson);
      } catch {
        initial[s.sectionKey] = {};
      }
    }
    return initial;
  });

  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  const activeSection = sections.find((s) => s.sectionKey === selectedKey);
  const activeContent = (formData[selectedKey] || {}) as Record<string, any>;

  const updateField = (path: string, value: unknown) => {
    setFormData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const sectionObj = copy[selectedKey] || {};

      const keys = path.split(".");
      let current = sectionObj;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      copy[selectedKey] = sectionObj;
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedStatus(null);
    try {
      const res = await fetch("/api/admin/sections/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageSlug,
          sectionKey: selectedKey,
          content: formData[selectedKey],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedStatus("Saved & Revalidated");
        setPreviewRefreshKey((k) => k + 1);
      } else {
        setSavedStatus("Saved locally");
      }
    } catch {
      setSavedStatus("Error saving");
    } finally {
      setSaving(false);
      setTimeout(() => setSavedStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Preview Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--color-surface)] p-4 rounded-[4px] border hairline">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink)] font-semibold">
            Section Selector
          </span>
          <span className="text-[var(--color-ink-dim)]">·</span>
          <span className="font-mono text-xs text-[var(--color-ink-muted)]">
            Active: <strong className="text-[var(--color-ink)]">{activeSection?.title || selectedKey}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={cn(
              "btn-ghost h-8 px-3 text-[10px] inline-flex items-center gap-1.5",
              showLivePreview && "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold border-transparent"
            )}
          >
            <Monitor size={12} />
            <span>{showLivePreview ? "Hide Live Preview" : "Split Live Preview"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Column: Section List */}
        <div className={cn(showLivePreview ? "lg:col-span-2" : "lg:col-span-3", "space-y-3")}>
          <div className="card-surface p-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-dim)] mb-2 px-2">
              Sections
            </div>
            <div className="space-y-1">
              {sections.map((sec) => {
                const isSelected = sec.sectionKey === selectedKey;
                return (
                  <button
                    key={sec.sectionKey}
                    type="button"
                    onClick={() => setSelectedKey(sec.sectionKey)}
                    className={cn(
                      "w-full text-left px-2.5 py-2 rounded-[4px] font-mono text-[11px] uppercase tracking-[0.1em] flex items-center justify-between transition-all",
                      isSelected
                        ? "bg-[var(--color-card)] text-[var(--color-ink)] border hairline-strong font-semibold shadow-sm"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]"
                    )}
                  >
                    <span className="truncate">{sec.title || sec.sectionKey}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Column: Tailored Editor Forms */}
        <div className={cn(showLivePreview ? "lg:col-span-5" : "lg:col-span-9", "card-surface flex flex-col min-h-[600px]")}>
          {/* Editor Action Header */}
          <div className="p-5 border-b hairline flex items-center justify-between bg-[var(--color-card)]">
            <div>
              <span className="eyebrow block">Section Studio</span>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] mt-0.5">
                {activeSection?.title || selectedKey}
              </h3>
            </div>

            <div className="flex items-center gap-2.5">
              {savedStatus && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-[3px]">
                  <CheckCircle2 size={11} /> {savedStatus}
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-pill h-8 px-3.5 text-[10px] flex items-center gap-1.5"
              >
                <Save size={12} />
                <span>{saving ? "Saving..." : "Save"}</span>
              </button>
            </div>
          </div>

          {/* Dynamic Form Fields */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Hero Form */}
            {selectedKey === "hero" && (
              <div className="space-y-5">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)] mb-1.5">
                    Eyebrow Label
                  </label>
                  <input
                    type="text"
                    value={activeContent.eyebrow || ""}
                    onChange={(e) => updateField("eyebrow", e.target.value)}
                    className="w-full bg-[var(--color-card)] border hairline rounded-[4px] px-3.5 py-2 text-sm text-[var(--color-ink)] font-mono focus:border-[var(--color-accent)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)] mb-1.5">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={activeContent.headline || ""}
                      onChange={(e) => updateField("headline", e.target.value)}
                      className="w-full bg-[var(--color-card)] border hairline rounded-[4px] px-3.5 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)] mb-1.5">
                      Headline Highlight
                    </label>
                    <input
                      type="text"
                      value={activeContent.headlineHighlight || ""}
                      onChange={(e) =>
                        updateField("headlineHighlight", e.target.value)
                      }
                      className="w-full bg-[var(--color-card)] border hairline rounded-[4px] px-3.5 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)] mb-1.5">
                    Sub-description Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={activeContent.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="w-full bg-[var(--color-card)] border hairline rounded-[4px] px-3.5 py-2 text-sm text-[var(--color-ink-muted)] focus:border-[var(--color-accent)] outline-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t hairline">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)] mb-1.5">
                      Primary CTA Label
                    </label>
                    <input
                      type="text"
                      value={activeContent.primaryCta?.label || ""}
                      onChange={(e) =>
                        updateField("primaryCta.label", e.target.value)
                      }
                      className="w-full bg-[var(--color-card)] border hairline rounded-[4px] px-3.5 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)] mb-1.5">
                      Primary CTA Link
                    </label>
                    <input
                      type="text"
                      value={activeContent.primaryCta?.href || ""}
                      onChange={(e) =>
                        updateField("primaryCta.href", e.target.value)
                      }
                      className="w-full bg-[var(--color-card)] border hairline rounded-[4px] px-3.5 py-2 text-sm text-[var(--color-ink)] font-mono focus:border-[var(--color-accent)] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Why FDE Form */}
            {selectedKey === "why-fde" && (
              <div className="space-y-5">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)] mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={activeContent.title || ""}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full bg-[var(--color-card)] border hairline rounded-[4px] px-3.5 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)] mb-1.5">
                    Title Highlight
                  </label>
                  <input
                    type="text"
                    value={activeContent.titleHighlight || ""}
                    onChange={(e) =>
                      updateField("titleHighlight", e.target.value)
                    }
                    className="w-full bg-[var(--color-card)] border hairline rounded-[4px] px-3.5 py-2 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-dim)] mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={activeContent.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="w-full bg-[var(--color-card)] border hairline rounded-[4px] px-3.5 py-2 text-sm text-[var(--color-ink-muted)] focus:border-[var(--color-accent)] outline-none"
                  />
                </div>
              </div>
            )}

            {/* General JSON Editor */}
            {selectedKey !== "hero" && selectedKey !== "why-fde" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink)]">
                    Structured Section Schema
                  </span>
                  <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-[3px] border hairline text-[var(--color-ink-dim)]">
                    Live JSON
                  </span>
                </div>
                <textarea
                  rows={16}
                  value={JSON.stringify(activeContent, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        [selectedKey]: parsed,
                      }));
                    } catch {
                      // Allow typing
                    }
                  }}
                  className="w-full bg-[var(--color-card)] border hairline rounded-[4px] p-4 text-xs font-mono text-[var(--color-ink)] focus:border-[var(--color-accent)] outline-none leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Split Column: Live Preview Panel */}
        {showLivePreview && (
          <div className="lg:col-span-5 card-surface flex flex-col h-[700px] overflow-hidden border border-neutral-700/80 shadow-2xl">
            <div className="p-3 border-b hairline flex items-center justify-between bg-[var(--color-card)]">
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink)] font-semibold">
                  Live Viewport
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPreviewRefreshKey((k) => k + 1)}
                  className="p-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  title="Reload Preview"
                >
                  <RefreshCw size={12} />
                </button>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  title="Open in new window"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="p-2 border-b hairline bg-[var(--color-surface)] flex items-center gap-2 text-[10px] font-mono text-[var(--color-ink-dim)]">
              <span className="truncate">URL: {previewUrl}</span>
            </div>

            <div className="flex-1 bg-black">
              <iframe
                key={previewRefreshKey}
                src={previewUrl}
                title="Live Website Preview"
                className="w-full h-full border-0 bg-black"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
