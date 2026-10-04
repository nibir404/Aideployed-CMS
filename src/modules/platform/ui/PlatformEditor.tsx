"use client";

import { useState } from "react";
import { Cpu, Save, CheckCircle2, Plus, Trash2, Sun, Moon } from "lucide-react";
import { cn } from "@/core/lib/cn";
import type { PlatformModuleEntity } from "../types";

export function PlatformEditor({
  modules: initialModules,
}: {
  modules: PlatformModuleEntity[];
}) {
  const [modules, setModules] = useState(initialModules);
  const [selectedKey, setSelectedKey] = useState(
    initialModules[0]?.key || "build"
  );
  const [saving, setSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");

  const activeModule = modules.find((m) => m.key === selectedKey) || modules[0];

  const [bullets, setBullets] = useState<string[]>(() => {
    try {
      return JSON.parse(activeModule.bulletsJson || "[]");
    } catch {
      return [];
    }
  });

  const [mockFields, setMockFields] = useState<
    Array<{ label: string; value: string; chip?: string }>
  >(() => {
    try {
      return JSON.parse(activeModule.mockFieldsJson || "[]");
    } catch {
      return [];
    }
  });

  // Switch active module
  const handleSelectModule = (key: string) => {
    setSelectedKey(key);
    const m = modules.find((mod) => mod.key === key);
    if (m) {
      try {
        setBullets(JSON.parse(m.bulletsJson || "[]"));
      } catch {
        setBullets([]);
      }
      try {
        setMockFields(JSON.parse(m.mockFieldsJson || "[]"));
      } catch {
        setMockFields([]);
      }
    }
  };

  const updateActiveModuleField = (field: keyof PlatformModuleEntity, value: any) => {
    setModules((prev) =>
      prev.map((m) => (m.key === selectedKey ? { ...m, [field]: value } : m))
    );
  };

  const handleSave = async () => {
    if (!activeModule) return;
    setSaving(true);
    setSavedStatus(null);

    try {
      const res = await fetch("/api/admin/platform/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: activeModule.key,
          eyebrow: activeModule.eyebrow,
          title: activeModule.title,
          bodyText: activeModule.bodyText,
          mockCardTitle: activeModule.mockCardTitle,
          mockCardUrl: activeModule.mockCardUrl,
          bullets,
          mockFields,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSavedStatus("Saved & Revalidated");
      } else {
        setSavedStatus("Saved");
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
      {/* Module Selector Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="card-surface p-3 border hairline">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-dim)] mb-2 px-2">
            The 7 Platform Anchors
          </div>
          <div className="space-y-1">
            {modules.map((m) => {
              const isSelected = m.key === selectedKey;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => handleSelectModule(m.key)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-[4px] font-mono text-xs uppercase tracking-[0.12em] flex items-center justify-between transition-all",
                    isSelected
                      ? "bg-[var(--color-card)] text-[var(--color-ink)] border hairline-strong font-semibold shadow-sm ring-1 ring-[var(--color-line-strong)]"
                      : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]"
                  )}
                >
                  <span className="truncate">{m.eyebrow}</span>
                  <span className="font-mono text-[9px] text-[var(--color-ink-dim)] uppercase">
                    {m.key}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Mock Card Preview */}
        <div className="card-surface p-4 space-y-3 border hairline">
          <div className="flex items-center justify-between">
            <span className="label-text mb-0">Card Output Preview</span>
            <div className="flex items-center gap-1 bg-[var(--color-surface)] p-0.5 rounded-[4px] border hairline">
              <button
                type="button"
                onClick={() => setPreviewTheme("dark")}
                className={cn(
                  "p-1 rounded-[2px] transition-colors",
                  previewTheme === "dark"
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                )}
                title="Preview dark"
              >
                <Moon size={11} />
              </button>
              <button
                type="button"
                onClick={() => setPreviewTheme("light")}
                className={cn(
                  "p-1 rounded-[2px] transition-colors",
                  previewTheme === "light"
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)]"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                )}
                title="Preview light"
              >
                <Sun size={11} />
              </button>
            </div>
          </div>

          <div
            className={cn(
              "rounded-[4px] overflow-hidden border hairline transition-all shadow-md",
              previewTheme === "light"
                ? "bg-[#ffffff] text-[#111111]"
                : "bg-[#111111] text-[#ffffff]"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 border-b hairline px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em]",
                previewTheme === "light" ? "bg-[#f4efe5] text-[#595245]" : "bg-[#161616] text-[#a3a3a3]"
              )}
            >
              <span className="inline-block size-1.5 bg-emerald-500 rounded-full" />
              <span className="truncate">{activeModule.mockCardUrl}</span>
              {activeModule.mockCardTitle && (
                <span className="ml-auto text-[9px] font-semibold">
                  {activeModule.mockCardTitle}
                </span>
              )}
            </div>

            <div className="p-4 space-y-2.5">
              {mockFields.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1 border-b hairline last:border-b-0"
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] uppercase",
                      previewTheme === "light" ? "text-[#595245]" : "text-[#a3a3a3]"
                    )}
                  >
                    {f.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs">{f.value}</span>
                    {f.chip && (
                      <span
                        className={cn(
                          "font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[2px] border hairline font-semibold",
                          previewTheme === "light"
                            ? "bg-[#ede5d5] text-[#3c352a]"
                            : "bg-[#222222] text-[#e5e5e5]"
                        )}
                      >
                        {f.chip}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Module Edit Form */}
      <div className="lg:col-span-8 card-surface flex flex-col min-h-[600px] border hairline overflow-hidden">
        <div className="p-5 border-b hairline flex items-center justify-between bg-[var(--color-card)]">
          <div>
            <span className="eyebrow block">Platform Architecture</span>
            <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] mt-0.5">
              {activeModule.eyebrow} — {activeModule.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {savedStatus && (
              <span className="badge-status-success">
                <CheckCircle2 size={11} /> {savedStatus}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-pill h-8 px-3.5 text-[10px] flex items-center gap-1.5"
            >
              <Save size={12} />
              <span>{saving ? "Saving..." : "Save Module"}</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Eyebrow</label>
              <input
                type="text"
                value={activeModule.eyebrow}
                onChange={(e) =>
                  updateActiveModuleField("eyebrow", e.target.value)
                }
                className="input-text input-mono"
              />
            </div>
            <div>
              <label className="label-text">Headline Title</label>
              <input
                type="text"
                value={activeModule.title}
                onChange={(e) => updateActiveModuleField("title", e.target.value)}
                className="input-text font-medium"
              />
            </div>
          </div>

          <div>
            <label className="label-text">Body Copy</label>
            <textarea
              rows={3}
              value={activeModule.bodyText}
              onChange={(e) =>
                updateActiveModuleField("bodyText", e.target.value)
              }
              className="input-text leading-relaxed"
            />
          </div>

          {/* Bullet Points */}
          <div className="space-y-3 pt-3 border-t hairline">
            <div className="flex items-center justify-between">
              <span className="label-text mb-0">
                Key Bullets ({bullets.length})
              </span>
              <button
                type="button"
                onClick={() => setBullets([...bullets, ""])}
                className="btn-ghost h-7 px-2.5 text-[10px] inline-flex items-center gap-1"
              >
                <Plus size={11} /> Add Bullet
              </button>
            </div>
            <div className="space-y-2">
              {bullets.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={b}
                    onChange={(e) => {
                      const next = [...bullets];
                      next[i] = e.target.value;
                      setBullets(next);
                    }}
                    placeholder={`Bullet item #${i + 1}`}
                    className="input-text text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => setBullets(bullets.filter((_, idx) => idx !== i))}
                    className="p-2 text-[var(--color-ink-dim)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Card Settings */}
          <div className="space-y-3 pt-3 border-t hairline">
            <div className="label-text">
              Mock Interactive Card Parameters
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-text">Card URL</label>
                <input
                  type="text"
                  value={activeModule.mockCardUrl}
                  onChange={(e) =>
                    updateActiveModuleField("mockCardUrl", e.target.value)
                  }
                  className="input-text input-mono text-xs"
                />
              </div>
              <div>
                <label className="label-text">Card Title Tag (Optional)</label>
                <input
                  type="text"
                  value={activeModule.mockCardTitle || ""}
                  onChange={(e) =>
                    updateActiveModuleField("mockCardTitle", e.target.value)
                  }
                  className="input-text input-mono text-xs"
                />
              </div>
            </div>

            {/* Mock Fields Editor */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="label-text mb-0">Row Items</span>
                <button
                  type="button"
                  onClick={() =>
                    setMockFields([...mockFields, { label: "", value: "" }])
                  }
                  className="btn-ghost h-6 px-2 text-[9px] inline-flex items-center gap-1"
                >
                  <Plus size={10} /> Add Row
                </button>
              </div>
              {mockFields.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={f.label}
                    onChange={(e) => {
                      const next = [...mockFields];
                      next[i] = { ...next[i], label: e.target.value };
                      setMockFields(next);
                    }}
                    placeholder="Label (e.g. Target)"
                    className="w-1/3 input-text input-mono text-xs"
                  />
                  <input
                    type="text"
                    value={f.value}
                    onChange={(e) => {
                      const next = [...mockFields];
                      next[i] = { ...next[i], value: e.target.value };
                      setMockFields(next);
                    }}
                    placeholder="Value (e.g. Ops triage)"
                    className="flex-1 input-text text-xs"
                  />
                  <input
                    type="text"
                    value={f.chip || ""}
                    onChange={(e) => {
                      const next = [...mockFields];
                      next[i] = { ...next[i], chip: e.target.value };
                      setMockFields(next);
                    }}
                    placeholder="Chip (Optional)"
                    className="w-24 input-text input-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setMockFields(mockFields.filter((_, idx) => idx !== i))
                    }
                    className="p-1.5 text-[var(--color-ink-dim)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
