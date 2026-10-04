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
  Code2,
  Plus,
  Trash2,
  Columns,
  Maximize2,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/core/lib/cn";
import { SectionLivePreview } from "./SectionLivePreview";

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
  const [layoutMode, setLayoutMode] = useState<"split" | "editor" | "preview">("split");
  const [editorTab, setEditorTab] = useState<"form" | "json">("form");

  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
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
      {/* Top Banner Toolbar with Section Selector & View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--color-surface)] p-3.5 rounded-[4px] border hairline">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-ink)] font-semibold">
            Content Studio
          </span>
          <span className="text-[var(--color-ink-dim)]">·</span>
          <span className="font-mono text-xs text-[var(--color-ink-muted)]">
            Editing: <strong className="text-[var(--color-ink)]">{activeSection?.title || selectedKey}</strong>
          </span>
        </div>

        {/* Layout View Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[var(--color-card)] p-0.5 rounded-[4px] border hairline">
            <button
              type="button"
              onClick={() => setLayoutMode("split")}
              className={cn(
                "px-2.5 py-1 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.1em] flex items-center gap-1.5 transition-colors",
                layoutMode === "split"
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Split View (Form + Live Keystroke Preview)"
            >
              <Columns size={12} />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("editor")}
              className={cn(
                "px-2.5 py-1 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.1em] flex items-center gap-1.5 transition-colors",
                layoutMode === "editor"
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Editor Only"
            >
              <Sliders size={12} />
              <span>Editor Only</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("preview")}
              className={cn(
                "px-2.5 py-1 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.1em] flex items-center gap-1.5 transition-colors",
                layoutMode === "preview"
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold"
                  : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
              )}
              title="Full Preview Only"
            >
              <Eye size={12} />
              <span>Preview Only</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Column: Section List (Always accessible) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="card-surface p-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-dim)] mb-2 px-2 flex items-center justify-between">
              <span>Home Sections</span>
              <span>{sections.length}</span>
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
                      "w-full text-left px-3 py-2.5 rounded-[4px] font-mono text-[11px] uppercase tracking-[0.1em] flex items-center justify-between transition-all",
                      isSelected
                        ? "bg-[var(--color-card)] text-[var(--color-ink)] border hairline-strong font-semibold shadow-sm ring-1 ring-[var(--color-line-strong)]"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]"
                    )}
                  >
                    <span className="truncate">{sec.title || sec.sectionKey}</span>
                    <span className="text-[9px] font-mono text-[var(--color-ink-dim)] lowercase">
                      {sec.sectionKey}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card-surface p-4 text-xs space-y-2 border hairline">
            <span className="label-text">Editorial Hint</span>
            <p className="text-[var(--color-ink-muted)] leading-relaxed text-[11px]">
              Every edit to inputs updates the right-side visual preview keystroke-by-keystroke. Hit{" "}
              <strong className="text-[var(--color-ink)]">Save</strong> to commit to the database and revalidate Next.js cache.
            </p>
          </div>
        </div>

        {/* Center Column: Form & JSON Editor (Visible in 'split' or 'editor') */}
        {layoutMode !== "preview" && (
          <div
            className={cn(
              layoutMode === "split" ? "lg:col-span-4" : "lg:col-span-9",
              "card-surface flex flex-col min-h-[650px] overflow-hidden"
            )}
          >
            {/* Editor Action Header */}
            <div className="p-4 border-b hairline flex items-center justify-between bg-[var(--color-card)]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditorTab("form")}
                  className={cn(
                    "px-2.5 py-1 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
                    editorTab === "form"
                      ? "bg-[var(--color-surface)] text-[var(--color-ink)] font-semibold border hairline"
                      : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  )}
                >
                  Fields
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("json")}
                  className={cn(
                    "px-2.5 py-1 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.12em] flex items-center gap-1 transition-colors",
                    editorTab === "json"
                      ? "bg-[var(--color-surface)] text-[var(--color-ink)] font-semibold border hairline"
                      : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                  )}
                >
                  <Code2 size={11} />
                  <span>JSON</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                {savedStatus && (
                  <span className="badge-status-success">
                    <CheckCircle2 size={11} /> {savedStatus}
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-pill h-8 px-3 text-[10px] flex items-center gap-1.5"
                >
                  <Save size={12} />
                  <span>{saving ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </div>

            {/* Dynamic Form Content */}
            <div className="p-5 space-y-5 flex-1 overflow-y-auto">
              {editorTab === "json" ? (
                <div className="space-y-2 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="label-text">Direct JSON Payload</span>
                    <span className="font-mono text-[9px] text-[var(--color-ink-dim)]">Real-time sync</span>
                  </div>
                  <textarea
                    rows={22}
                    value={JSON.stringify(activeContent, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          [selectedKey]: parsed,
                        }));
                      } catch {
                        // Allow typing incomplete JSON
                      }
                    }}
                    className="input-text input-mono text-xs flex-1 leading-relaxed resize-y"
                  />
                </div>
              ) : (
                <div className="space-y-5">
                  {/* HERO SECTION FORM */}
                  {selectedKey === "hero" && (
                    <div className="space-y-4">
                      <div>
                        <label className="label-text">Eyebrow Badge</label>
                        <input
                          type="text"
                          value={activeContent.eyebrow || ""}
                          onChange={(e) => updateField("eyebrow", e.target.value)}
                          placeholder="e.g. AI Deployed · Embedded"
                          className="input-text input-mono"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="label-text">Main Headline</label>
                          <input
                            type="text"
                            value={activeContent.headline || ""}
                            onChange={(e) => updateField("headline", e.target.value)}
                            placeholder="e.g. Embed with your team."
                            className="input-text font-medium"
                          />
                        </div>
                        <div>
                          <label className="label-text">Headline Highlight</label>
                          <input
                            type="text"
                            value={activeContent.headlineHighlight || ""}
                            onChange={(e) =>
                              updateField("headlineHighlight", e.target.value)
                            }
                            placeholder="e.g. Architect, build, run."
                            className="input-text"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label-text">Sub-description Paragraph</label>
                        <textarea
                          rows={3}
                          value={activeContent.description || ""}
                          onChange={(e) => updateField("description", e.target.value)}
                          placeholder="Supporting paragraph..."
                          className="input-text leading-relaxed"
                        />
                      </div>

                      <div className="pt-3 border-t hairline space-y-3">
                        <span className="label-text">Primary Call to Action</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={activeContent.primaryCta?.label || ""}
                            onChange={(e) =>
                              updateField("primaryCta.label", e.target.value)
                            }
                            placeholder="Button Label"
                            className="input-text text-xs"
                          />
                          <input
                            type="text"
                            value={activeContent.primaryCta?.href || ""}
                            onChange={(e) =>
                              updateField("primaryCta.href", e.target.value)
                            }
                            placeholder="Button Link (/contact)"
                            className="input-text input-mono text-xs"
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t hairline space-y-3">
                        <span className="label-text">Secondary Call to Action</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={activeContent.secondaryCta?.label || ""}
                            onChange={(e) =>
                              updateField("secondaryCta.label", e.target.value)
                            }
                            placeholder="Secondary Label"
                            className="input-text text-xs"
                          />
                          <input
                            type="text"
                            value={activeContent.secondaryCta?.href || ""}
                            onChange={(e) =>
                              updateField("secondaryCta.href", e.target.value)
                            }
                            placeholder="Link (/how-we-work)"
                            className="input-text input-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WHY FDE SECTION FORM */}
                  {selectedKey === "why-fde" && (
                    <div className="space-y-4">
                      <div>
                        <label className="label-text">Eyebrow</label>
                        <input
                          type="text"
                          value={activeContent.eyebrow || ""}
                          onChange={(e) => updateField("eyebrow", e.target.value)}
                          className="input-text input-mono"
                        />
                      </div>
                      <div>
                        <label className="label-text">Section Title</label>
                        <input
                          type="text"
                          value={activeContent.title || ""}
                          onChange={(e) => updateField("title", e.target.value)}
                          className="input-text font-medium"
                        />
                      </div>
                      <div>
                        <label className="label-text">Title Highlight</label>
                        <input
                          type="text"
                          value={activeContent.titleHighlight || ""}
                          onChange={(e) => updateField("titleHighlight", e.target.value)}
                          className="input-text"
                        />
                      </div>
                      <div>
                        <label className="label-text">Description</label>
                        <textarea
                          rows={3}
                          value={activeContent.description || ""}
                          onChange={(e) => updateField("description", e.target.value)}
                          className="input-text"
                        />
                      </div>

                      {/* Pillars Editor */}
                      <div className="pt-3 border-t hairline space-y-3">
                        <span className="label-text">The 3 Pillars</span>
                        {(activeContent.pillars || []).map((pillar: any, idx: number) => (
                          <div key={idx} className="p-3 bg-[var(--color-surface)] rounded-[4px] border hairline space-y-2">
                            <input
                              type="text"
                              value={pillar.title || ""}
                              onChange={(e) => {
                                const newPillars = [...(activeContent.pillars || [])];
                                newPillars[idx] = { ...newPillars[idx], title: e.target.value };
                                updateField("pillars", newPillars);
                              }}
                              placeholder={`Pillar 0${idx + 1} Title`}
                              className="input-text text-xs font-semibold"
                            />
                            <textarea
                              rows={2}
                              value={pillar.desc || ""}
                              onChange={(e) => {
                                const newPillars = [...(activeContent.pillars || [])];
                                newPillars[idx] = { ...newPillars[idx], desc: e.target.value };
                                updateField("pillars", newPillars);
                              }}
                              placeholder="Description..."
                              className="input-text text-xs"
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="label-text">Bottom Tagline</label>
                        <input
                          type="text"
                          value={activeContent.bottomTagline || ""}
                          onChange={(e) => updateField("bottomTagline", e.target.value)}
                          placeholder="e.g. Embedded. Accountable. On-call."
                          className="input-text input-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* DEMO SECTION FORM */}
                  {selectedKey === "demo" && (
                    <div className="space-y-4">
                      <div>
                        <label className="label-text">Section Eyebrow</label>
                        <input
                          type="text"
                          value={activeContent.eyebrow || ""}
                          onChange={(e) => updateField("eyebrow", e.target.value)}
                          className="input-text input-mono"
                        />
                      </div>
                      <div>
                        <label className="label-text">Title</label>
                        <input
                          type="text"
                          value={activeContent.title || ""}
                          onChange={(e) => updateField("title", e.target.value)}
                          className="input-text font-medium"
                        />
                      </div>
                      <div>
                        <label className="label-text">Title Highlight</label>
                        <input
                          type="text"
                          value={activeContent.titleHighlight || ""}
                          onChange={(e) => updateField("titleHighlight", e.target.value)}
                          className="input-text"
                        />
                      </div>
                      <div>
                        <label className="label-text">Description</label>
                        <textarea
                          rows={2}
                          value={activeContent.description || ""}
                          onChange={(e) => updateField("description", e.target.value)}
                          className="input-text"
                        />
                      </div>

                      {/* 6 Phases Editor */}
                      <div className="pt-3 border-t hairline space-y-3">
                        <span className="label-text">Engagement Phases (6)</span>
                        {(activeContent.phases || []).map((p: any, idx: number) => (
                          <div key={idx} className="p-3 bg-[var(--color-surface)] rounded-[4px] border hairline space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-semibold text-[var(--color-ink)]">
                                Phase {p.phase}: {p.title}
                              </span>
                              <input
                                type="number"
                                value={p.progress || 0}
                                onChange={(e) => {
                                  const copy = [...(activeContent.phases || [])];
                                  copy[idx] = { ...copy[idx], progress: Number(e.target.value) };
                                  updateField("phases", copy);
                                }}
                                className="w-16 input-text text-xs font-mono py-1 px-2 text-right"
                              />
                            </div>
                            <input
                              type="text"
                              value={p.headline || ""}
                              onChange={(e) => {
                                const copy = [...(activeContent.phases || [])];
                                copy[idx] = { ...copy[idx], headline: e.target.value };
                                updateField("phases", copy);
                              }}
                              placeholder="Phase Headline"
                              className="input-text text-xs"
                            />
                            <textarea
                              rows={2}
                              value={p.desc || ""}
                              onChange={(e) => {
                                const copy = [...(activeContent.phases || [])];
                                copy[idx] = { ...copy[idx], desc: e.target.value };
                                updateField("phases", copy);
                              }}
                              placeholder="Phase Description"
                              className="input-text text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CAPABILITY GRID FORM */}
                  {selectedKey === "capability-grid" && (
                    <div className="space-y-4">
                      <div>
                        <label className="label-text">Section Eyebrow</label>
                        <input
                          type="text"
                          value={activeContent.eyebrow || ""}
                          onChange={(e) => updateField("eyebrow", e.target.value)}
                          className="input-text input-mono"
                        />
                      </div>
                      <div>
                        <label className="label-text">Title</label>
                        <input
                          type="text"
                          value={activeContent.title || ""}
                          onChange={(e) => updateField("title", e.target.value)}
                          className="input-text font-medium"
                        />
                      </div>
                      <div>
                        <label className="label-text">Title Highlight</label>
                        <input
                          type="text"
                          value={activeContent.titleHighlight || ""}
                          onChange={(e) => updateField("titleHighlight", e.target.value)}
                          className="input-text"
                        />
                      </div>

                      {/* People Cards */}
                      <div className="pt-3 border-t hairline space-y-3">
                        <span className="label-text">Our People Cards</span>
                        {(activeContent.peopleCards || []).map((card: any, idx: number) => (
                          <div key={idx} className="p-3 bg-[var(--color-surface)] rounded-[4px] border hairline space-y-2">
                            <input
                              type="text"
                              value={card.title || ""}
                              onChange={(e) => {
                                const copy = [...(activeContent.peopleCards || [])];
                                copy[idx] = { ...copy[idx], title: e.target.value };
                                updateField("peopleCards", copy);
                              }}
                              className="input-text text-xs font-semibold"
                            />
                            <textarea
                              rows={2}
                              value={card.desc || ""}
                              onChange={(e) => {
                                const copy = [...(activeContent.peopleCards || [])];
                                copy[idx] = { ...copy[idx], desc: e.target.value };
                                updateField("peopleCards", copy);
                              }}
                              className="input-text text-xs"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Stack Cards */}
                      <div className="pt-3 border-t hairline space-y-3">
                        <span className="label-text">Our Stack Cards</span>
                        {(activeContent.stackCards || []).map((card: any, idx: number) => (
                          <div key={idx} className="p-3 bg-[var(--color-surface)] rounded-[4px] border hairline space-y-2">
                            <input
                              type="text"
                              value={card.title || ""}
                              onChange={(e) => {
                                const copy = [...(activeContent.stackCards || [])];
                                copy[idx] = { ...copy[idx], title: e.target.value };
                                updateField("stackCards", copy);
                              }}
                              className="input-text text-xs font-semibold"
                            />
                            <textarea
                              rows={2}
                              value={card.desc || ""}
                              onChange={(e) => {
                                const copy = [...(activeContent.stackCards || [])];
                                copy[idx] = { ...copy[idx], desc: e.target.value };
                                updateField("stackCards", copy);
                              }}
                              className="input-text text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* USE CASES FORM */}
                  {selectedKey === "use-cases" && (
                    <div className="space-y-4">
                      <div>
                        <label className="label-text">Section Eyebrow</label>
                        <input
                          type="text"
                          value={activeContent.eyebrow || ""}
                          onChange={(e) => updateField("eyebrow", e.target.value)}
                          className="input-text input-mono"
                        />
                      </div>
                      <div>
                        <label className="label-text">Title</label>
                        <input
                          type="text"
                          value={activeContent.title || ""}
                          onChange={(e) => updateField("title", e.target.value)}
                          className="input-text font-medium"
                        />
                      </div>
                      <div>
                        <label className="label-text">Title Highlight</label>
                        <input
                          type="text"
                          value={activeContent.titleHighlight || ""}
                          onChange={(e) => updateField("titleHighlight", e.target.value)}
                          className="input-text"
                        />
                      </div>
                      <div>
                        <label className="label-text">Description</label>
                        <textarea
                          rows={2}
                          value={activeContent.description || ""}
                          onChange={(e) => updateField("description", e.target.value)}
                          className="input-text"
                        />
                      </div>

                      {/* Use Case Items */}
                      <div className="pt-3 border-t hairline space-y-3">
                        <span className="label-text">Use Cases (6 Cards)</span>
                        {(activeContent.cases || []).map((c: any, idx: number) => (
                          <div key={idx} className="p-3 bg-[var(--color-surface)] rounded-[4px] border hairline space-y-2">
                            <input
                              type="text"
                              value={c.title || ""}
                              onChange={(e) => {
                                const copy = [...(activeContent.cases || [])];
                                copy[idx] = { ...copy[idx], title: e.target.value };
                                updateField("cases", copy);
                              }}
                              className="input-text text-xs font-semibold"
                            />
                            <textarea
                              rows={2}
                              value={c.desc || ""}
                              onChange={(e) => {
                                const copy = [...(activeContent.cases || [])];
                                copy[idx] = { ...copy[idx], desc: e.target.value };
                                updateField("cases", copy);
                              }}
                              className="input-text text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* DIFFERENTIATORS FORM */}
                  {selectedKey === "differentiators" && (
                    <div className="space-y-4">
                      <div>
                        <label className="label-text">Section Eyebrow</label>
                        <input
                          type="text"
                          value={activeContent.eyebrow || ""}
                          onChange={(e) => updateField("eyebrow", e.target.value)}
                          className="input-text input-mono"
                        />
                      </div>
                      <div>
                        <label className="label-text">Title</label>
                        <input
                          type="text"
                          value={activeContent.title || ""}
                          onChange={(e) => updateField("title", e.target.value)}
                          className="input-text font-medium"
                        />
                      </div>

                      <div className="pt-3 border-t hairline space-y-3">
                        <span className="label-text">Differentiator Items</span>
                        {(activeContent.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="p-3 bg-[var(--color-surface)] rounded-[4px] border hairline space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-[var(--color-accent)]">
                                {item.num || `0${idx + 1}`}
                              </span>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => {
                                  const copy = [...(activeContent.items || [])];
                                  copy[idx] = { ...copy[idx], title: e.target.value };
                                  updateField("items", copy);
                                }}
                                className="input-text text-xs font-semibold flex-1"
                              />
                            </div>
                            <textarea
                              rows={3}
                              value={item.desc || ""}
                              onChange={(e) => {
                                const copy = [...(activeContent.items || [])];
                                copy[idx] = { ...copy[idx], desc: e.target.value };
                                updateField("items", copy);
                              }}
                              className="input-text text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ENGAGEMENT STEPS FORM */}
                  {selectedKey === "engagement-steps" && (
                    <div className="space-y-4">
                      <div>
                        <label className="label-text">Eyebrow</label>
                        <input
                          type="text"
                          value={activeContent.eyebrow || ""}
                          onChange={(e) => updateField("eyebrow", e.target.value)}
                          className="input-text input-mono"
                        />
                      </div>
                      <div>
                        <label className="label-text">Title</label>
                        <input
                          type="text"
                          value={activeContent.title || ""}
                          onChange={(e) => updateField("title", e.target.value)}
                          className="input-text font-medium"
                        />
                      </div>
                      <div>
                        <label className="label-text">Description</label>
                        <textarea
                          rows={2}
                          value={activeContent.description || ""}
                          onChange={(e) => updateField("description", e.target.value)}
                          className="input-text"
                        />
                      </div>

                      <div className="pt-3 border-t hairline space-y-3">
                        <span className="label-text">Timeline Steps (4)</span>
                        {(activeContent.steps || []).map((step: any, idx: number) => (
                          <div key={idx} className="p-3 bg-[var(--color-surface)] rounded-[4px] border hairline space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-[var(--color-ink-dim)]">
                                {step.num || `0${idx + 1}`}
                              </span>
                              <input
                                type="text"
                                value={step.title || ""}
                                onChange={(e) => {
                                  const copy = [...(activeContent.steps || [])];
                                  copy[idx] = { ...copy[idx], title: e.target.value };
                                  updateField("steps", copy);
                                }}
                                className="input-text text-xs font-semibold flex-1"
                              />
                              <input
                                type="text"
                                value={step.badge || ""}
                                onChange={(e) => {
                                  const copy = [...(activeContent.steps || [])];
                                  copy[idx] = { ...copy[idx], badge: e.target.value };
                                  updateField("steps", copy);
                                }}
                                placeholder="Badge"
                                className="input-text input-mono text-xs w-20"
                              />
                            </div>
                            <textarea
                              rows={2}
                              value={step.desc || ""}
                              onChange={(e) => {
                                const copy = [...(activeContent.steps || [])];
                                copy[idx] = { ...copy[idx], desc: e.target.value };
                                updateField("steps", copy);
                              }}
                              className="input-text text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* COMMITMENTS FORM */}
                  {selectedKey === "commitments" && (
                    <div className="space-y-4">
                      <div>
                        <label className="label-text">Eyebrow</label>
                        <input
                          type="text"
                          value={activeContent.eyebrow || ""}
                          onChange={(e) => updateField("eyebrow", e.target.value)}
                          className="input-text input-mono"
                        />
                      </div>
                      <div>
                        <label className="label-text">Title</label>
                        <input
                          type="text"
                          value={activeContent.title || ""}
                          onChange={(e) => updateField("title", e.target.value)}
                          className="input-text font-medium"
                        />
                      </div>

                      <div className="pt-3 border-t hairline space-y-3">
                        <span className="label-text">Guarantees (3)</span>
                        {(activeContent.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="p-3 bg-[var(--color-surface)] rounded-[4px] border hairline space-y-2">
                            <input
                              type="text"
                              value={item.title || ""}
                              onChange={(e) => {
                                const copy = [...(activeContent.items || [])];
                                copy[idx] = { ...copy[idx], title: e.target.value };
                                updateField("items", copy);
                              }}
                              className="input-text text-xs font-semibold"
                            />
                            <textarea
                              rows={2}
                              value={item.desc || ""}
                              onChange={(e) => {
                                const copy = [...(activeContent.items || [])];
                                copy[idx] = { ...copy[idx], desc: e.target.value };
                                updateField("items", copy);
                              }}
                              className="input-text text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FINAL CTA FORM */}
                  {selectedKey === "final-cta" && (
                    <div className="space-y-4">
                      <div>
                        <label className="label-text">Headline Title</label>
                        <input
                          type="text"
                          value={activeContent.title || ""}
                          onChange={(e) => updateField("title", e.target.value)}
                          className="input-text font-medium"
                        />
                      </div>
                      <div>
                        <label className="label-text">Description</label>
                        <textarea
                          rows={3}
                          value={activeContent.description || ""}
                          onChange={(e) => updateField("description", e.target.value)}
                          className="input-text"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t hairline">
                        <div>
                          <label className="label-text">Button Label</label>
                          <input
                            type="text"
                            value={activeContent.buttonLabel || ""}
                            onChange={(e) => updateField("buttonLabel", e.target.value)}
                            className="input-text text-xs"
                          />
                        </div>
                        <div>
                          <label className="label-text">Button Href</label>
                          <input
                            type="text"
                            value={activeContent.buttonHref || ""}
                            onChange={(e) => updateField("buttonHref", e.target.value)}
                            className="input-text input-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Split Column: Real-Time Interactive Live Preview */}
        {layoutMode !== "editor" && (
          <div
            className={cn(
              layoutMode === "split" ? "lg:col-span-5" : "lg:col-span-9",
              "flex flex-col h-[750px] shadow-lg rounded-[6px]"
            )}
          >
            <SectionLivePreview
              sectionKey={selectedKey}
              data={activeContent}
              allSectionsData={formData}
              onSelectSection={(key) => setSelectedKey(key)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
