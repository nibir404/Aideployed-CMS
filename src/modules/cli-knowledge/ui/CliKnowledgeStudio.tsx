"use client";

import { useState } from "react";
import {
  Terminal,
  Save,
  CheckCircle2,
  Plus,
  Play,
  Trash2,
  Sparkles,
  Search,
} from "lucide-react";
import { cn } from "@/core/lib/cn";
import type { CliTopicEntity } from "../types";

export function CliKnowledgeStudio({
  initialTopics,
}: {
  initialTopics: CliTopicEntity[];
}) {
  const [topics, setTopics] = useState(initialTopics);
  const [selectedTopicId, setSelectedTopicId] = useState(
    initialTopics[0]?.topicId || "what"
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const activeTopic =
    topics.find((t) => t.topicId === selectedTopicId) || topics[0];

  const [title, setTitle] = useState(activeTopic?.title || "");
  const [summary, setSummary] = useState(activeTopic?.summary || "");
  const [keywordsInput, setKeywordsInput] = useState(() => {
    try {
      const arr = JSON.parse(activeTopic?.keywordsJson || "[]");
      return arr.join(", ");
    } catch {
      return "";
    }
  });

  const [facts, setFacts] = useState<string[]>(() => {
    try {
      return JSON.parse(activeTopic?.factsJson || "[]");
    } catch {
      return [];
    }
  });

  // Simulator State
  const [simQuery, setSimQuery] = useState("What does AI Deployed do?");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    const t = topics.find((item) => item.topicId === id);
    if (t) {
      setTitle(t.title);
      setSummary(t.summary);
      try {
        setKeywordsInput(JSON.parse(t.keywordsJson || "[]").join(", "));
      } catch {
        setKeywordsInput("");
      }
      try {
        setFacts(JSON.parse(t.factsJson || "[]"));
      } catch {
        setFacts([]);
      }
    }
  };

  const handleSave = async () => {
    if (!activeTopic) return;
    setSaving(true);
    setToast(null);

    const keywords = keywordsInput
      .split(",")
      .map((k: string) => k.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/admin/cli-knowledge/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: activeTopic.topicId,
          title,
          summary,
          keywords,
          facts,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTopics((prev) =>
          prev.map((t) => (t.topicId === activeTopic.topicId ? data.topic : t))
        );
        setToast("Saved & Revalidated");
      }
    } catch {
      setToast("Error saving topic");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const runSimulation = async (queryText: string) => {
    setSimLoading(true);
    try {
      const res = await fetch("/api/v1/cli-knowledge/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText }),
      });
      const data = await res.json();
      setSimResult(data);
    } catch {
      setSimResult({
        matchedTopic: null,
        score: 0,
        composedOutput: "Simulation network error",
        tokens: [],
      });
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Topics List */}
      <div className="lg:col-span-3 space-y-3">
        <div className="card-surface p-3 border hairline">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--color-ink-dim)] mb-2 px-2">
            CLI Topics ({topics.length})
          </div>
          <div className="space-y-1">
            {topics.map((t) => {
              const isSelected = t.topicId === selectedTopicId;
              return (
                <button
                  key={t.topicId}
                  type="button"
                  onClick={() => handleSelectTopic(t.topicId)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-[4px] font-mono text-xs uppercase tracking-[0.12em] flex items-center justify-between transition-all",
                    isSelected
                      ? "bg-[var(--color-card)] text-[var(--color-ink)] border hairline-strong font-semibold shadow-sm ring-1 ring-[var(--color-line-strong)]"
                      : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]"
                  )}
                >
                  <span className="truncate">{t.topicId}</span>
                  <span className="text-[10px] text-[var(--color-ink-dim)] font-mono">
                    {t.title.slice(0, 14)}...
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center Column: Topic Editor */}
      <div className="lg:col-span-5 card-surface flex flex-col min-h-[600px] border hairline overflow-hidden">
        <div className="p-5 border-b hairline flex items-center justify-between bg-[var(--color-card)]">
          <div>
            <span className="eyebrow block">CLI Knowledge Topic</span>
            <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] mt-0.5">
              Editing: {activeTopic?.topicId}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {toast && (
              <span className="badge-status-success">
                <CheckCircle2 size={11} /> {toast}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-pill h-8 px-3 text-[10px] inline-flex items-center gap-1.5"
            >
              <Save size={12} />
              <span>{saving ? "Saving..." : "Save Topic"}</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          <div>
            <label className="label-text">
              Topic Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-text font-medium"
            />
          </div>

          <div>
            <label className="label-text">
              Keywords (Comma-separated aliases)
            </label>
            <input
              type="text"
              value={keywordsInput}
              onChange={(e) => setKeywordsInput(e.target.value)}
              placeholder="e.g. what, do, company, about, aideployed"
              className="input-text input-mono text-xs"
            />
            <p className="mt-1 text-[10px] text-[var(--color-ink-dim)] font-mono">
              Tokens that trigger this topic in the CLI matcher.
            </p>
          </div>

          <div>
            <label className="label-text">
              1-Line Teaser Summary
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="input-text leading-relaxed text-xs"
            />
          </div>

          <div className="space-y-3 pt-3 border-t hairline">
            <div className="flex items-center justify-between">
              <span className="label-text mb-0">
                Editorial Bullet Facts ({facts.length})
              </span>
              <button
                type="button"
                onClick={() => setFacts([...facts, ""])}
                className="btn-ghost h-6 px-2 text-[9px] inline-flex items-center gap-1"
              >
                <Plus size={10} /> Add Fact
              </button>
            </div>
            <div className="space-y-2">
              {facts.map((fact, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-[var(--color-ink-dim)] text-xs">·</span>
                  <input
                    type="text"
                    value={fact}
                    onChange={(e) => {
                      const next = [...facts];
                      next[idx] = e.target.value;
                      setFacts(next);
                    }}
                    placeholder={`Fact #${idx + 1}`}
                    className="flex-1 input-text text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setFacts(facts.filter((_, i) => i !== idx))}
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

      {/* Right Column: Interactive CLI Simulator */}
      <div className="lg:col-span-4 card-surface flex flex-col min-h-[600px] border hairline overflow-hidden shadow-lg">
        <div className="p-4 border-b hairline flex items-center justify-between bg-[var(--color-card)]">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink)] font-semibold">
              CLI Simulator Sandbox
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[2px] bg-[var(--color-surface)] text-[var(--color-ink-dim)] border hairline">
            Offline Matcher
          </span>
        </div>

        {/* Query Input Box */}
        <div className="p-4 border-b hairline bg-[var(--color-surface)] space-y-2.5">
          <label className="label-text mb-0">
            Type test user prompt
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={simQuery}
              onChange={(e) => setSimQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runSimulation(simQuery);
              }}
              placeholder="e.g. how does governance work"
              className="flex-1 input-text input-mono text-xs py-1.5"
            />
            <button
              onClick={() => runSimulation(simQuery)}
              disabled={simLoading}
              className="btn-pill h-8 px-3 text-[10px] inline-flex items-center gap-1"
            >
              <Play size={10} />
              <span>Test</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              "what does AI Deployed do",
              "how does governance work",
              "where do agents run",
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => {
                  setSimQuery(q);
                  runSimulation(q);
                }}
                className="font-mono text-[9px] px-2 py-0.5 rounded-[3px] border hairline bg-[var(--color-card)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-line-strong)] transition-colors"
              >
                ${q}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Output Screen */}
        <div className="p-4 flex-1 font-mono text-xs overflow-y-auto space-y-3 bg-[var(--color-surface)]">
          {simResult ? (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-[10px] border-b hairline pb-2 text-[var(--color-ink-dim)]">
                <span>
                  Match:{" "}
                  <strong className="text-[var(--color-ink)]">
                    {simResult.matchedTopic?.topicId || "No Match (Fallback)"}
                  </strong>
                </span>
                <span>
                  Score: <strong className="text-emerald-500 font-bold">{simResult.score}</strong>
                </span>
              </div>

              <div className="code-container p-3.5 text-xs leading-relaxed whitespace-pre-wrap">
                {simResult.composedOutput}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--color-ink-dim)] font-mono text-[11px]">
              <Terminal size={24} className="mb-2 text-[var(--color-ink-dim)]" />
              <span>Type a query and press Test to simulate the CLI</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
