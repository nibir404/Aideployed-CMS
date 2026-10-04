"use client";

import { useState } from "react";
import { Cpu, Save, CheckCircle2, Plus, Trash2, Eye } from "lucide-react";
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
      <div className="lg:col-span-4 space-y-3">
        <div className="card-surface p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400 mb-3 px-2">
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
                    "w-full text-left px-3.5 py-3 rounded-[4px] font-mono text-xs uppercase tracking-[0.12em] flex items-center justify-between transition-all",
                    isSelected
                      ? "bg-[#222222] text-white border border-neutral-600 font-medium"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-[#151515]"
                  )}
                >
                  <span className="truncate">{m.eyebrow}</span>
                  <span className="font-mono text-[9px] text-neutral-400 uppercase">
                    {m.key}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Mock Card Preview */}
        <div className="card-surface p-5 space-y-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
            Card Output Preview
          </div>
          <div className="bg-[#161616] border hairline rounded-[4px] overflow-hidden">
            <div className="flex items-center gap-2 border-b hairline px-3 py-2 bg-[#121212]">
              <span className="inline-block size-1.5 bg-[var(--color-accent)]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 truncate">
                {activeModule.mockCardUrl}
              </span>
              {activeModule.mockCardTitle && (
                <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">
                  {activeModule.mockCardTitle}
                </span>
              )}
            </div>
            <div className="p-4 space-y-2">
              {mockFields.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1 border-b hairline last:border-b-0"
                >
                  <span className="font-mono text-[10px] uppercase text-neutral-400">
                    {f.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs">{f.value}</span>
                    {f.chip && (
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[2px] border border-neutral-700 bg-neutral-800 text-neutral-300">
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
      <div className="lg:col-span-8 card-surface flex flex-col min-h-[600px]">
        <div className="p-6 border-b hairline flex items-center justify-between bg-[#131313]">
          <div>
            <span className="eyebrow block">Platform Architecture</span>
            <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-white mt-1">
              {activeModule.eyebrow} — {activeModule.title}
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
              <span>{saving ? "Saving..." : "Save Module"}</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                Eyebrow
              </label>
              <input
                type="text"
                value={activeModule.eyebrow}
                onChange={(e) =>
                  updateActiveModuleField("eyebrow", e.target.value)
                }
                className="w-full bg-[#161616] border hairline rounded-[4px] px-3.5 py-2 text-sm text-white font-mono focus:border-neutral-400 outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
                Headline Title
              </label>
              <input
                type="text"
                value={activeModule.title}
                onChange={(e) => updateActiveModuleField("title", e.target.value)}
                className="w-full bg-[#161616] border hairline rounded-[4px] px-3.5 py-2 text-sm text-white focus:border-neutral-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1.5">
              Body Copy
            </label>
            <textarea
              rows={3}
              value={activeModule.bodyText}
              onChange={(e) =>
                updateActiveModuleField("bodyText", e.target.value)
              }
              className="w-full bg-[#161616] border hairline rounded-[4px] px-3.5 py-2 text-sm text-neutral-300 focus:border-neutral-400 outline-none"
            />
          </div>

          {/* Bullet Points */}
          <div className="space-y-3 pt-3 border-t hairline">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-300">
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
                    className="flex-1 bg-[#161616] border hairline rounded-[4px] px-3 py-1.5 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setBullets(bullets.filter((_, idx) => idx !== i))}
                    className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Card Settings */}
          <div className="space-y-3 pt-3 border-t hairline">
            <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-300">
              Mock Interactive Card Parameters
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1">
                  Card URL
                </label>
                <input
                  type="text"
                  value={activeModule.mockCardUrl}
                  onChange={(e) =>
                    updateActiveModuleField("mockCardUrl", e.target.value)
                  }
                  className="w-full bg-[#161616] border hairline rounded-[4px] px-3 py-1.5 text-xs font-mono text-white outline-none"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mb-1">
                  Card Title Tag (Optional)
                </label>
                <input
                  type="text"
                  value={activeModule.mockCardTitle || ""}
                  onChange={(e) =>
                    updateActiveModuleField("mockCardTitle", e.target.value)
                  }
                  className="w-full bg-[#161616] border hairline rounded-[4px] px-3 py-1.5 text-xs font-mono text-white outline-none"
                />
              </div>
            </div>

            {/* Mock Fields Editor */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-neutral-400">
                <span>Row Items</span>
                <button
                  type="button"
                  onClick={() =>
                    setMockFields([...mockFields, { label: "", value: "" }])
                  }
                  className="text-neutral-300 hover:text-white flex items-center gap-1"
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
                    className="w-1/3 bg-[#161616] border hairline rounded-[4px] px-2.5 py-1.5 text-xs font-mono text-neutral-300 outline-none"
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
                    className="flex-1 bg-[#161616] border hairline rounded-[4px] px-2.5 py-1.5 text-xs text-white outline-none"
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
                    className="w-24 bg-[#161616] border hairline rounded-[4px] px-2 py-1.5 text-xs font-mono text-neutral-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setMockFields(mockFields.filter((_, idx) => idx !== i))
                    }
                    className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
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
