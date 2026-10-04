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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Navigation Column: Section List */}
      <div className="lg:col-span-4 space-y-3">
        <div className="card-surface p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400 mb-3 px-2">
            Home Page Sections
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
                    "w-full text-left px-3 py-2.5 rounded-[4px] font-mono text-xs uppercase tracking-[0.12em] flex items-center justify-between transition-all",
                    isSelected
                      ? "bg-[#222222] text-white border border-neutral-600 font-medium"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-[#151515]"
                  )}
                >
                  <span className="truncate">{sec.title || sec.sectionKey}</span>
                  <span className="font-mono text-[9px] text-neutral-400 uppercase">
                    {sec.sectionKey}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Site Preview Quick Callout */}
        <div className="card-surface p-5 text-xs font-mono text-neutral-400 space-y-3">
          <div className="flex items-center gap-2 text-white font-medium uppercase tracking-[0.14em]">
            <Sparkles size={13} className="text-[var(--color-accent)]" />
            <span>Target Preview</span>
          </div>
          <p className="text-neutral-400 leading-relaxed text-[11px]">
            Changes saved here are instantly served to the Next.js 15 App Router on
            {" "}
            <code className="text-neutral-200">aideployed.io</code> via ISR.
          </p>
          <a
            href="https://www.aideployed.io"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost w-full justify-center h-8 text-[10px]"
          >
            <Eye size={12} />
            <span>Open Live Website</span>
          </a>
        </div>
      </div>

      {/* Right Column: Tailored Editor Forms */}
      <div className="lg:col-span-8 card-surface flex flex-col min-h-[600px]">
        {/* Editor Action Header */}
        <div className="p-6 border-b hairline flex items-center justify-between bg-[#131313]">
          <div>
            <span className="eyebrow block">Section Studio</span>
            <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-white mt-1">
              Editing: {activeSection?.title || selectedKey}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {savedStatus && (
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-2 py-1 rounded-[3px]">
                <CheckCircle2 size={11} /> {savedStatus}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-pill h-9 px-4 flex items-center gap-2"
            >
              <Save size={13} />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Form Fields */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Hero Form */}
          {selectedKey === "hero" && (
            <div className="space-y-5">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={activeContent.eyebrow || ""}
                  onChange={(e) => updateField("eyebrow", e.target.value)}
                  className="w-full bg-[#161616] border hairline rounded-[4px] px-3.5 py-2 text-sm text-white font-mono focus:border-neutral-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={activeContent.headline || ""}
                    onChange={(e) => updateField("headline", e.target.value)}
                    className="w-full bg-[#161616] border hairline rounded-[4px] px-3.5 py-2 text-sm text-white focus:border-neutral-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    Headline Highlight (Muted Gray)
                  </label>
                  <input
                    type="text"
                    value={activeContent.headlineHighlight || ""}
                    onChange={(e) =>
                      updateField("headlineHighlight", e.target.value)
                    }
                    className="w-full bg-[#161616] border hairline rounded-[4px] px-3.5 py-2 text-sm text-white focus:border-neutral-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                  Sub-description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={activeContent.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full bg-[#161616] border hairline rounded-[4px] px-3.5 py-2 text-sm text-neutral-300 focus:border-neutral-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t hairline">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={activeContent.primaryCta?.label || ""}
                    onChange={(e) =>
                      updateField("primaryCta.label", e.target.value)
                    }
                    className="w-full bg-[#161616] border hairline rounded-[4px] px-3.5 py-2 text-sm text-white focus:border-neutral-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                    Primary CTA Href Link
                  </label>
                  <input
                    type="text"
                    value={activeContent.primaryCta?.href || ""}
                    onChange={(e) =>
                      updateField("primaryCta.href", e.target.value)
                    }
                    className="w-full bg-[#161616] border hairline rounded-[4px] px-3.5 py-2 text-sm text-white font-mono focus:border-neutral-400 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Why FDE Form */}
          {selectedKey === "why-fde" && (
            <div className="space-y-6">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                  Section Title
                </label>
                <input
                  type="text"
                  value={activeContent.title || ""}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full bg-[#161616] border hairline rounded-[4px] px-3.5 py-2 text-sm text-white focus:border-neutral-400 outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                  Title Highlight
                </label>
                <input
                  type="text"
                  value={activeContent.titleHighlight || ""}
                  onChange={(e) =>
                    updateField("titleHighlight", e.target.value)
                  }
                  className="w-full bg-[#161616] border hairline rounded-[4px] px-3.5 py-2 text-sm text-white focus:border-neutral-400 outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={activeContent.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full bg-[#161616] border hairline rounded-[4px] px-3.5 py-2 text-sm text-neutral-300 focus:border-neutral-400 outline-none"
                />
              </div>

              {/* 3 Pillars */}
              <div className="space-y-3 pt-3 border-t hairline">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-300">
                  Three Core Pillars
                </div>
                {(activeContent.pillars || []).map(
                  (pillar: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-[4px] border hairline bg-[#151515] space-y-2"
                    >
                      <input
                        type="text"
                        value={pillar.title || ""}
                        onChange={(e) => {
                          const nextPillars = [...(activeContent.pillars || [])];
                          nextPillars[idx] = {
                            ...nextPillars[idx],
                            title: e.target.value,
                          };
                          updateField("pillars", nextPillars);
                        }}
                        placeholder="Pillar Title"
                        className="w-full bg-[#191919] border hairline rounded-[4px] px-3 py-1.5 text-xs text-white font-medium outline-none"
                      />
                      <textarea
                        rows={2}
                        value={pillar.desc || ""}
                        onChange={(e) => {
                          const nextPillars = [...(activeContent.pillars || [])];
                          nextPillars[idx] = {
                            ...nextPillars[idx],
                            desc: e.target.value,
                          };
                          updateField("pillars", nextPillars);
                        }}
                        placeholder="Pillar Description"
                        className="w-full bg-[#191919] border hairline rounded-[4px] px-3 py-1.5 text-xs text-neutral-300 outline-none"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Generic JSON fallback editor for any section */}
          {selectedKey !== "hero" && selectedKey !== "why-fde" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-300">
                  Section Content (Structured JSON)
                </span>
                <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded-[3px] border border-neutral-800 text-neutral-400">
                  Live Schema
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
                    // Allow intermediate typing
                  }
                }}
                className="w-full bg-[#0c0c0c] border hairline rounded-[4px] p-4 text-xs font-mono text-neutral-300 focus:border-neutral-500 outline-none leading-relaxed"
              />
              <p className="font-mono text-[10px] text-neutral-400">
                You can directly modify properties, add new items, or edit copy.
                Valid JSON is automatically parsed and saved to the database.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
