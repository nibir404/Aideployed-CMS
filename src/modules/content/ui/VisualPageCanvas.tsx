"use client";

import { useState, createContext, useContext } from "react";
import {
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Cpu,
  Terminal,
  Database,
  Layers,
  Sparkles,
  HelpCircle,
  Mail,
  Building,
  Target,
  Briefcase,
} from "lucide-react";
import { cn } from "@/core/lib/cn";
import { EditableText } from "./EditableText";

interface VisualPageCanvasProps {
  pageSlug: string;
  sectionsData: Record<string, any>;
  onUpdateField: (sectionKey: string, fieldPath: string, newValue: unknown) => void;
  isEditMode: boolean;
  selectedSectionKey?: string;
  onSelectSection?: (sectionKey: string) => void;
}

const SectionContext = createContext<{
  isEditMode: boolean;
  selectedSectionKey?: string;
  onSelectSection?: (sectionKey: string) => void;
}>({
  isEditMode: true,
});

function SectionContainer({
  sectionKey,
  title,
  children,
  className = "",
}: {
  sectionKey: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { isEditMode, selectedSectionKey, onSelectSection } = useContext(SectionContext);
  const isSelected = selectedSectionKey === sectionKey;

  return (
    <section
      id={sectionKey}
      onClick={() => onSelectSection?.(sectionKey)}
      className={cn(
        "relative transition-all border-b hairline group/sec",
        isEditMode && "hover:outline hover:outline-1 hover:outline-cyan-500/30",
        isSelected && isEditMode && "outline outline-2 outline-cyan-500/70 bg-cyan-500/[0.01]",
        className
      )}
    >
      {isEditMode && (
        <div
          className={cn(
            "absolute top-2 right-4 z-20 font-mono text-[9px] uppercase tracking-[0.14em] px-2 py-0.5 rounded-[3px] backdrop-blur-md shadow-xs flex items-center gap-1.5 transition-all pointer-events-none",
            isSelected
              ? "bg-cyan-600 text-white opacity-100 font-semibold"
              : "bg-neutral-900/80 text-neutral-300 opacity-0 group-hover/sec:opacity-100"
          )}
        >
          <span>{title}</span>
        </div>
      )}
      {children}
    </section>
  );
}

export function VisualPageCanvas({
  pageSlug,
  sectionsData,
  onUpdateField,
  isEditMode,
  selectedSectionKey,
  onSelectSection,
}: VisualPageCanvasProps) {
  return (
    <SectionContext.Provider value={{ isEditMode, selectedSectionKey, onSelectSection }}>
      <VisualPageCanvasBody
        pageSlug={pageSlug}
        sectionsData={sectionsData}
        onUpdateField={onUpdateField}
        isEditMode={isEditMode}
      />
    </SectionContext.Provider>
  );
}

function VisualPageCanvasBody({
  pageSlug,
  sectionsData,
  onUpdateField,
  isEditMode,
}: Omit<VisualPageCanvasProps, "selectedSectionKey" | "onSelectSection">) {
  const [activeDemoPhase, setActiveDemoPhase] = useState(1);

  /* ------------------------------------------------------------- */
  /*                      HOMEPAGE SECTIONS                        */
  /* ------------------------------------------------------------- */
  if (pageSlug === "home") {
    const hero = sectionsData["hero"] || {};
    const whyFde = sectionsData["why-fde"] || {};
    const demo = sectionsData["demo"] || {};
    const capability = sectionsData["capability-grid"] || {};
    const useCases = sectionsData["use-cases"] || {};
    const differentiators = sectionsData["differentiators"] || {};
    const steps = sectionsData["engagement-steps"] || {};
    const commitments = sectionsData["commitments"] || {};
    const finalCta = sectionsData["final-cta"] || {};

    const phases = demo.phases || [];
    const currentPhaseObj =
      phases.find((p: any) => p.phase === activeDemoPhase) || phases[0] || {};

    return (
      <div className="space-y-0">
        {/* 1. HERO */}
        <SectionContainer sectionKey="hero" title="Hero">
          <div className="relative py-20 sm:py-28 px-6 text-center overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
            <div className="absolute inset-0 grid-bg-dots opacity-40 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border hairline font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-dim)] bg-[var(--color-surface)]/70 backdrop-blur-sm">
                <span className="size-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                <EditableText
                  value={hero.eyebrow || "AI Deployed · Embedded"}
                  onChange={(val) => onUpdateField("hero", "eyebrow", val)}
                  label="Hero Eyebrow"
                  isEditMode={isEditMode}
                />
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.04] text-[var(--color-ink)]">
                <EditableText
                  value={hero.headline || "Embed with your team."}
                  onChange={(val) => onUpdateField("hero", "headline", val)}
                  label="Headline"
                  isEditMode={isEditMode}
                />
                <span className="block sm:inline text-[var(--color-ink-muted)] font-normal mt-1 sm:mt-0">
                  <EditableText
                    value={hero.headlineHighlight || "Architect, build, run."}
                    onChange={(val) => onUpdateField("hero", "headlineHighlight", val)}
                    label="Headline Highlight"
                    isEditMode={isEditMode}
                  />
                </span>
              </h1>

              {/* Subheadline Paragraph */}
              <div className="text-base sm:text-lg text-[var(--color-ink-muted)] leading-relaxed max-w-xl mx-auto">
                <EditableText
                  value={
                    hero.description ||
                    "AI and software systems, in your environment, under your governance."
                  }
                  onChange={(val) => onUpdateField("hero", "description", val)}
                  label="Description"
                  isEditMode={isEditMode}
                  multiline
                />
              </div>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <div className="btn-pill h-11 px-6 text-xs inline-flex items-center gap-2 shadow-lg">
                  <EditableText
                    value={hero.primaryCta?.label || "Start a conversation"}
                    onChange={(val) => onUpdateField("hero", "primaryCta.label", val)}
                    label="Primary CTA Button"
                    isEditMode={isEditMode}
                  />
                  <ArrowUpRight size={14} />
                </div>
                <div className="btn-ghost h-11 px-6 text-xs inline-flex items-center gap-2">
                  <EditableText
                    value={hero.secondaryCta?.label || "See how it works"}
                    onChange={(val) => onUpdateField("hero", "secondaryCta.label", val)}
                    label="Secondary CTA Button"
                    isEditMode={isEditMode}
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* 2. WHY FDE */}
        <SectionContainer sectionKey="why-fde" title="Why Forward Deployed Engineers">
          <div className="py-16 px-6 max-w-5xl mx-auto space-y-12">
            <div className="max-w-2xl space-y-3">
              <span className="eyebrow block">
                <EditableText
                  value={whyFde.eyebrow || "Embedded engineers"}
                  onChange={(val) => onUpdateField("why-fde", "eyebrow", val)}
                  label="Eyebrow"
                  isEditMode={isEditMode}
                />
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--color-ink)] leading-snug">
                <EditableText
                  value={whyFde.title || "The role that closes the gap."}
                  onChange={(val) => onUpdateField("why-fde", "title", val)}
                  label="Section Title"
                  isEditMode={isEditMode}
                />{" "}
                <span className="text-[var(--color-ink-muted)] font-normal">
                  <EditableText
                    value={
                      whyFde.titleHighlight ||
                      "Between the demo and the production system."
                    }
                    onChange={(val) =>
                      onUpdateField("why-fde", "titleHighlight", val)
                    }
                    label="Title Highlight"
                    isEditMode={isEditMode}
                  />
                </span>
              </h2>
              <div className="text-sm text-[var(--color-ink-muted)] leading-relaxed pt-1">
                <EditableText
                  value={
                    whyFde.description ||
                    "A Forward Deployed Engineer is a senior engineer embedded with your team."
                  }
                  onChange={(val) => onUpdateField("why-fde", "description", val)}
                  label="Description"
                  isEditMode={isEditMode}
                  multiline
                />
              </div>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(whyFde.pillars || []).map((p: any, i: number) => (
                <div
                  key={i}
                  className="card-surface p-6 rounded-[4px] border hairline space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="inline-block size-2 bg-[var(--color-accent)] rounded-full" />
                    <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-ink)]">
                      <EditableText
                        value={p.title || `Pillar ${i + 1}`}
                        onChange={(val) =>
                          onUpdateField("why-fde", `pillars.${i}.title`, val)
                        }
                        label={`Pillar ${i + 1} Title`}
                        isEditMode={isEditMode}
                      />
                    </h4>
                    <div className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      <EditableText
                        value={p.desc || ""}
                        onChange={(val) =>
                          onUpdateField("why-fde", `pillars.${i}.desc`, val)
                        }
                        label={`Pillar ${i + 1} Desc`}
                        isEditMode={isEditMode}
                        multiline
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 5 Steps */}
            <div className="pt-8 border-t hairline grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4">
                <span className="eyebrow block">What they do</span>
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] font-semibold text-[var(--color-ink)] mt-1">
                  In your environment, against your systems.
                </h3>
              </div>
              <div className="md:col-span-8 space-y-4">
                {(whyFde.steps || []).map((step: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 pb-3 border-b hairline last:border-b-0"
                  >
                    <span className="font-mono text-[11px] text-[var(--color-ink-dim)] font-semibold shrink-0 pt-0.5">
                      0{i + 1}
                    </span>
                    <div className="flex-1 space-y-0.5">
                      <div className="font-mono text-xs font-medium text-[var(--color-ink)] uppercase tracking-[0.08em]">
                        <EditableText
                          value={step.title || `Step ${i + 1}`}
                          onChange={(val) =>
                            onUpdateField("why-fde", `steps.${i}.title`, val)
                          }
                          label={`Step ${i + 1} Title`}
                          isEditMode={isEditMode}
                        />
                      </div>
                      <div className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                        <EditableText
                          value={step.desc || ""}
                          onChange={(val) =>
                            onUpdateField("why-fde", `steps.${i}.desc`, val)
                          }
                          label={`Step ${i + 1} Desc`}
                          isEditMode={isEditMode}
                          multiline
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-ink-dim)] font-semibold">
                  <EditableText
                    value={whyFde.bottomTagline || "Embedded. Accountable. On-call."}
                    onChange={(val) =>
                      onUpdateField("why-fde", "bottomTagline", val)
                    }
                    label="Bottom Tagline"
                    isEditMode={isEditMode}
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* 3. ENGAGEMENT WALKTHROUGH DEMO */}
        <SectionContainer sectionKey="demo" title="Interactive Demo">
          <div className="py-16 px-6 max-w-5xl mx-auto space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="eyebrow block">
                <EditableText
                  value={demo.eyebrow || "Engagement"}
                  onChange={(val) => onUpdateField("demo", "eyebrow", val)}
                  label="Eyebrow"
                  isEditMode={isEditMode}
                />
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--color-ink)]">
                <EditableText
                  value={demo.title || "How an embedded engagement"}
                  onChange={(val) => onUpdateField("demo", "title", val)}
                  label="Demo Title"
                  isEditMode={isEditMode}
                />{" "}
                <span className="text-[var(--color-ink-muted)]">
                  <EditableText
                    value={demo.titleHighlight || "runs."}
                    onChange={(val) =>
                      onUpdateField("demo", "titleHighlight", val)
                    }
                    label="Demo Title Highlight"
                    isEditMode={isEditMode}
                  />
                </span>
              </h2>
              <div className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                <EditableText
                  value={demo.description || "Six phases, one card."}
                  onChange={(val) => onUpdateField("demo", "description", val)}
                  label="Demo Description"
                  isEditMode={isEditMode}
                  multiline
                />
              </div>
            </div>

            {/* Stepper Card */}
            <div className="card-surface rounded-[6px] border hairline overflow-hidden">
              <div className="flex border-b hairline bg-[var(--color-surface)] overflow-x-auto">
                {phases.map((p: any) => (
                  <button
                    key={p.phase}
                    type="button"
                    onClick={() => setActiveDemoPhase(p.phase)}
                    className={cn(
                      "px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] shrink-0 border-r hairline transition-colors flex items-center gap-2",
                      activeDemoPhase === p.phase
                        ? "bg-[var(--color-card)] text-[var(--color-ink)] font-semibold border-b-2 border-b-[var(--color-accent)]"
                        : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                    )}
                  >
                    <span className="size-4 rounded-full border hairline flex items-center justify-center text-[9px]">
                      {p.phase}
                    </span>
                    <span>{p.title}</span>
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase px-2.5 py-1 rounded-[3px] bg-[var(--color-surface)] border hairline text-[var(--color-ink)] font-semibold">
                    Phase {currentPhaseObj.phase}: {currentPhaseObj.title}
                  </span>
                  <div className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                    {currentPhaseObj.progress}% Complete
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-medium text-[var(--color-ink)] leading-snug">
                    <EditableText
                      value={currentPhaseObj.headline || ""}
                      onChange={(val) => {
                        const idx = phases.findIndex(
                          (p: any) => p.phase === activeDemoPhase
                        );
                        if (idx !== -1) {
                          onUpdateField("demo", `phases.${idx}.headline`, val);
                        }
                      }}
                      label={`Phase ${activeDemoPhase} Headline`}
                      isEditMode={isEditMode}
                    />
                  </h3>
                  <div className="text-xs sm:text-sm text-[var(--color-ink-muted)] leading-relaxed">
                    <EditableText
                      value={currentPhaseObj.desc || ""}
                      onChange={(val) => {
                        const idx = phases.findIndex(
                          (p: any) => p.phase === activeDemoPhase
                        );
                        if (idx !== -1) {
                          onUpdateField("demo", `phases.${idx}.desc`, val);
                        }
                      }}
                      label={`Phase ${activeDemoPhase} Description`}
                      isEditMode={isEditMode}
                      multiline
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* 4. CAPABILITY GRID */}
        <SectionContainer sectionKey="capability-grid" title="Capability Grid">
          <div className="py-16 px-6 max-w-5xl mx-auto space-y-10">
            <div className="max-w-2xl space-y-2">
              <span className="eyebrow block">
                <EditableText
                  value={capability.eyebrow || "What we bring"}
                  onChange={(val) => onUpdateField("capability-grid", "eyebrow", val)}
                  label="Eyebrow"
                  isEditMode={isEditMode}
                />
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--color-ink)]">
                <EditableText
                  value={capability.title || "What an embedded engagement"}
                  onChange={(val) => onUpdateField("capability-grid", "title", val)}
                  label="Capability Title"
                  isEditMode={isEditMode}
                />{" "}
                <span className="text-[var(--color-ink-muted)]">
                  <EditableText
                    value={capability.titleHighlight || "delivers."}
                    onChange={(val) =>
                      onUpdateField("capability-grid", "titleHighlight", val)
                    }
                    label="Highlight"
                    isEditMode={isEditMode}
                  />
                </span>
              </h2>
            </div>

            {/* People Cards */}
            <div className="space-y-4">
              <div className="font-mono text-xs uppercase tracking-[0.14em] font-semibold text-[var(--color-ink)] flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
                <span>Our People</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(capability.peopleCards || []).map((card: any, idx: number) => (
                  <div key={idx} className="card-surface p-5 rounded-[4px] border hairline space-y-2">
                    <h4 className="font-mono text-xs uppercase tracking-[0.08em] font-semibold text-[var(--color-ink)]">
                      <EditableText
                        value={card.title || `Person ${idx + 1}`}
                        onChange={(val) =>
                          onUpdateField("capability-grid", `peopleCards.${idx}.title`, val)
                        }
                        label={`People Card ${idx + 1} Title`}
                        isEditMode={isEditMode}
                      />
                    </h4>
                    <div className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      <EditableText
                        value={card.desc || ""}
                        onChange={(val) =>
                          onUpdateField("capability-grid", `peopleCards.${idx}.desc`, val)
                        }
                        label={`People Card ${idx + 1} Desc`}
                        isEditMode={isEditMode}
                        multiline
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack Cards */}
            <div className="space-y-4 pt-6 border-t hairline">
              <div className="font-mono text-xs uppercase tracking-[0.14em] font-semibold text-[var(--color-ink)] flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
                <span>Our Stack</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(capability.stackCards || []).map((card: any, idx: number) => (
                  <div key={idx} className="card-surface p-5 rounded-[4px] border hairline space-y-2">
                    <h4 className="font-mono text-xs uppercase tracking-[0.08em] font-semibold text-[var(--color-ink)]">
                      <EditableText
                        value={card.title || `Stack ${idx + 1}`}
                        onChange={(val) =>
                          onUpdateField("capability-grid", `stackCards.${idx}.title`, val)
                        }
                        label={`Stack Card ${idx + 1} Title`}
                        isEditMode={isEditMode}
                      />
                    </h4>
                    <div className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      <EditableText
                        value={card.desc || ""}
                        onChange={(val) =>
                          onUpdateField("capability-grid", `stackCards.${idx}.desc`, val)
                        }
                        label={`Stack Card ${idx + 1} Desc`}
                        isEditMode={isEditMode}
                        multiline
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionContainer>

        {/* 5. USE CASES */}
        <SectionContainer sectionKey="use-cases" title="Use Cases">
          <div className="py-16 px-6 max-w-5xl mx-auto space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="eyebrow block">
                <EditableText
                  value={useCases.eyebrow || "Use cases"}
                  onChange={(val) => onUpdateField("use-cases", "eyebrow", val)}
                  label="Eyebrow"
                  isEditMode={isEditMode}
                />
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--color-ink)]">
                <EditableText
                  value={useCases.title || "Built for one job."}
                  onChange={(val) => onUpdateField("use-cases", "title", val)}
                  label="Use Cases Title"
                  isEditMode={isEditMode}
                />{" "}
                <span className="text-[var(--color-ink-muted)]">
                  <EditableText
                    value={
                      useCases.titleHighlight || "Built for your environment."
                    }
                    onChange={(val) =>
                      onUpdateField("use-cases", "titleHighlight", val)
                    }
                    label="Highlight"
                    isEditMode={isEditMode}
                  />
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(useCases.cases || []).map((c: any, idx: number) => (
                <div key={idx} className="card-surface p-5 rounded-[4px] border hairline space-y-2">
                  <div className="font-mono text-xs uppercase tracking-[0.12em] font-semibold text-[var(--color-ink)]">
                    <EditableText
                      value={c.title || `Case ${idx + 1}`}
                      onChange={(val) =>
                        onUpdateField("use-cases", `cases.${idx}.title`, val)
                      }
                      label={`Case ${idx + 1} Title`}
                      isEditMode={isEditMode}
                    />
                  </div>
                  <div className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    <EditableText
                      value={c.desc || ""}
                      onChange={(val) =>
                        onUpdateField("use-cases", `cases.${idx}.desc`, val)
                      }
                      label={`Case ${idx + 1} Description`}
                      isEditMode={isEditMode}
                      multiline
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>

        {/* 6. DIFFERENTIATORS */}
        <SectionContainer sectionKey="differentiators" title="Differentiators">
          <div className="py-16 px-6 max-w-5xl mx-auto space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="eyebrow block">
                <EditableText
                  value={differentiators.eyebrow || "Differentiators"}
                  onChange={(val) => onUpdateField("differentiators", "eyebrow", val)}
                  label="Eyebrow"
                  isEditMode={isEditMode}
                />
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--color-ink)]">
                <EditableText
                  value={differentiators.title || "What makes us different."}
                  onChange={(val) => onUpdateField("differentiators", "title", val)}
                  label="Title"
                  isEditMode={isEditMode}
                />
              </h2>
            </div>

            <div className="space-y-4">
              {(differentiators.items || []).map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="card-surface p-6 rounded-[4px] border hairline flex items-start gap-5"
                >
                  <span className="font-mono text-lg font-semibold text-[var(--color-accent)] shrink-0 pt-0.5">
                    {item.num || `0${idx + 1}`}
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-[var(--color-ink)]">
                      <EditableText
                        value={item.title || `Item ${idx + 1}`}
                        onChange={(val) =>
                          onUpdateField("differentiators", `items.${idx}.title`, val)
                        }
                        label={`Differentiator ${idx + 1} Title`}
                        isEditMode={isEditMode}
                      />
                    </h3>
                    <div className="text-xs sm:text-sm text-[var(--color-ink-muted)] leading-relaxed">
                      <EditableText
                        value={item.desc || ""}
                        onChange={(val) =>
                          onUpdateField("differentiators", `items.${idx}.desc`, val)
                        }
                        label={`Differentiator ${idx + 1} Desc`}
                        isEditMode={isEditMode}
                        multiline
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>

        {/* 7. ENGAGEMENT STEPS */}
        <SectionContainer sectionKey="engagement-steps" title="Timeline">
          <div className="py-16 px-6 max-w-5xl mx-auto space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="eyebrow block">
                <EditableText
                  value={steps.eyebrow || "Engagement"}
                  onChange={(val) => onUpdateField("engagement-steps", "eyebrow", val)}
                  label="Eyebrow"
                  isEditMode={isEditMode}
                />
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--color-ink)]">
                <EditableText
                  value={steps.title || "From discovery to an agent in production."}
                  onChange={(val) => onUpdateField("engagement-steps", "title", val)}
                  label="Title"
                  isEditMode={isEditMode}
                />
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {(steps.steps || []).map((step: any, idx: number) => (
                <div
                  key={idx}
                  className="card-surface p-5 rounded-[4px] border hairline flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-[var(--color-ink-dim)]">
                      <span>{step.num || `0${idx + 1}`}</span>
                      {step.badge && (
                        <span className="px-1.5 py-0.5 rounded-[2px] border hairline bg-[var(--color-surface)] uppercase">
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-3 font-mono text-xs uppercase tracking-[0.08em] font-semibold text-[var(--color-ink)]">
                      <EditableText
                        value={step.title || `Step ${idx + 1}`}
                        onChange={(val) =>
                          onUpdateField("engagement-steps", `steps.${idx}.title`, val)
                        }
                        label={`Step ${idx + 1} Title`}
                        isEditMode={isEditMode}
                      />
                    </h4>
                  </div>
                  <div className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    <EditableText
                      value={step.desc || ""}
                      onChange={(val) =>
                        onUpdateField("engagement-steps", `steps.${idx}.desc`, val)
                      }
                      label={`Step ${idx + 1} Desc`}
                      isEditMode={isEditMode}
                      multiline
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>

        {/* 8. COMMITMENTS */}
        <SectionContainer sectionKey="commitments" title="Commitments">
          <div className="py-16 px-6 max-w-5xl mx-auto space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="eyebrow block">
                <EditableText
                  value={commitments.eyebrow || "Commitments"}
                  onChange={(val) => onUpdateField("commitments", "eyebrow", val)}
                  label="Eyebrow"
                  isEditMode={isEditMode}
                />
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[var(--color-ink)]">
                <EditableText
                  value={commitments.title || "Operational guarantees."}
                  onChange={(val) => onUpdateField("commitments", "title", val)}
                  label="Title"
                  isEditMode={isEditMode}
                />
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(commitments.items || []).map((item: any, idx: number) => (
                <div key={idx} className="card-surface p-6 rounded-[4px] border hairline space-y-2">
                  <h4 className="font-mono text-xs uppercase tracking-[0.1em] font-semibold text-[var(--color-ink)]">
                    <EditableText
                      value={item.title || `Guarantee ${idx + 1}`}
                      onChange={(val) =>
                        onUpdateField("commitments", `items.${idx}.title`, val)
                      }
                      label={`Guarantee ${idx + 1} Title`}
                      isEditMode={isEditMode}
                    />
                  </h4>
                  <div className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    <EditableText
                      value={item.desc || ""}
                      onChange={(val) =>
                        onUpdateField("commitments", `items.${idx}.desc`, val)
                      }
                      label={`Guarantee ${idx + 1} Desc`}
                      isEditMode={isEditMode}
                      multiline
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>

        {/* 9. FINAL CTA */}
        <SectionContainer sectionKey="final-cta" title="Final CTA">
          <div className="py-20 px-6 max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-medium tracking-tight text-[var(--color-ink)]">
              <EditableText
                value={finalCta.title || "Start the conversation."}
                onChange={(val) => onUpdateField("final-cta", "title", val)}
                label="CTA Title"
                isEditMode={isEditMode}
              />
            </h2>
            <div className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
              <EditableText
                value={
                  finalCta.description ||
                  "Tell us about your context. A senior engineer responds within one business day."
                }
                onChange={(val) => onUpdateField("final-cta", "description", val)}
                label="CTA Description"
                isEditMode={isEditMode}
                multiline
              />
            </div>
            <div className="pt-2 flex justify-center">
              <div className="btn-pill h-11 px-8 text-xs inline-flex items-center gap-2">
                <EditableText
                  value={finalCta.buttonLabel || "Start a conversation"}
                  onChange={(val) => onUpdateField("final-cta", "buttonLabel", val)}
                  label="Button Label"
                  isEditMode={isEditMode}
                />
                <ArrowUpRight size={14} />
              </div>
            </div>
          </div>
        </SectionContainer>
      </div>
    );
  }

  /* ------------------------------------------------------------- */
  /*                      PLATFORM PAGE SECTIONS                   */
  /* ------------------------------------------------------------- */
  if (pageSlug === "platform") {
    const hero = sectionsData["platform-hero"] || {};
    const modulesSec = sectionsData["platform-modules"] || {};
    const cta = sectionsData["platform-cta"] || {};

    return (
      <div className="space-y-0">
        <SectionContainer sectionKey="platform-hero" title="Platform Hero">
          <div className="py-20 px-6 text-center max-w-3xl mx-auto space-y-5">
            <span className="eyebrow block">
              <EditableText
                value={hero.eyebrow || "Platform Architecture"}
                onChange={(val) => onUpdateField("platform-hero", "eyebrow", val)}
                label="Eyebrow"
                isEditMode={isEditMode}
              />
            </span>
            <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-[var(--color-ink)]">
              <EditableText
                value={hero.headline || "7 integrated modules."}
                onChange={(val) => onUpdateField("platform-hero", "headline", val)}
                label="Headline"
                isEditMode={isEditMode}
              />{" "}
              <span className="text-[var(--color-ink-muted)]">
                <EditableText
                  value={hero.headlineHighlight || "Zero black boxes."}
                  onChange={(val) =>
                    onUpdateField("platform-hero", "headlineHighlight", val)
                  }
                  label="Highlight"
                  isEditMode={isEditMode}
                />
              </span>
            </h1>
            <div className="text-sm sm:text-base text-[var(--color-ink-muted)] leading-relaxed">
              <EditableText
                value={hero.description || ""}
                onChange={(val) => onUpdateField("platform-hero", "description", val)}
                label="Description"
                isEditMode={isEditMode}
                multiline
              />
            </div>
          </div>
        </SectionContainer>

        <SectionContainer sectionKey="platform-modules" title="The 7 Modules">
          <div className="py-16 px-6 max-w-5xl mx-auto space-y-8">
            <div className="max-w-2xl space-y-2">
              <span className="eyebrow block">
                <EditableText
                  value={modulesSec.eyebrow || "Architecture"}
                  onChange={(val) =>
                    onUpdateField("platform-modules", "eyebrow", val)
                  }
                  label="Eyebrow"
                  isEditMode={isEditMode}
                />
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium text-[var(--color-ink)]">
                <EditableText
                  value={modulesSec.title || "The operational loop."}
                  onChange={(val) => onUpdateField("platform-modules", "title", val)}
                  label="Title"
                  isEditMode={isEditMode}
                />
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(modulesSec.modules || []).map((m: any, idx: number) => (
                <div key={idx} className="card-surface p-5 rounded-[4px] border hairline space-y-2">
                  <span className="font-mono text-xs text-[var(--color-accent)] font-semibold">
                    {m.num || `0${idx + 1}`} · {m.name}
                  </span>
                  <div className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    <EditableText
                      value={m.desc || ""}
                      onChange={(val) =>
                        onUpdateField("platform-modules", `modules.${idx}.desc`, val)
                      }
                      label={`${m.name} Description`}
                      isEditMode={isEditMode}
                      multiline
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>

        <SectionContainer sectionKey="platform-cta" title="Platform CTA">
          <div className="py-16 px-6 max-w-2xl mx-auto text-center space-y-5">
            <h2 className="text-2xl font-medium text-[var(--color-ink)]">
              <EditableText
                value={cta.title || "Deploy the stack in your perimeter."}
                onChange={(val) => onUpdateField("platform-cta", "title", val)}
                label="CTA Title"
                isEditMode={isEditMode}
              />
            </h2>
            <div className="btn-pill h-10 px-6 text-xs inline-flex items-center gap-2">
              <EditableText
                value={cta.buttonLabel || "Request Blueprint"}
                onChange={(val) => onUpdateField("platform-cta", "buttonLabel", val)}
                label="CTA Button"
                isEditMode={isEditMode}
              />
              <ArrowUpRight size={13} />
            </div>
          </div>
        </SectionContainer>
      </div>
    );
  }

  /* ------------------------------------------------------------- */
  /*                      GOVERNANCE PAGE SECTIONS                 */
  /* ------------------------------------------------------------- */
  if (pageSlug === "governance") {
    const hero = sectionsData["gov-hero"] || {};
    const checks = sectionsData["gov-checks"] || {};
    const queue = sectionsData["gov-queue"] || {};

    return (
      <div className="space-y-0">
        <SectionContainer sectionKey="gov-hero" title="Governance Hero">
          <div className="py-20 px-6 text-center max-w-3xl mx-auto space-y-5">
            <span className="eyebrow block">
              <EditableText
                value={hero.eyebrow || "Governance"}
                onChange={(val) => onUpdateField("gov-hero", "eyebrow", val)}
                label="Eyebrow"
                isEditMode={isEditMode}
              />
            </span>
            <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-[var(--color-ink)]">
              <EditableText
                value={hero.headline || "Every output checked,"}
                onChange={(val) => onUpdateField("gov-hero", "headline", val)}
                label="Headline"
                isEditMode={isEditMode}
              />{" "}
              <span className="text-[var(--color-ink-muted)]">
                <EditableText
                  value={hero.headlineHighlight || "every action logged."}
                  onChange={(val) =>
                    onUpdateField("gov-hero", "headlineHighlight", val)
                  }
                  label="Highlight"
                  isEditMode={isEditMode}
                />
              </span>
            </h1>
            <div className="text-sm sm:text-base text-[var(--color-ink-muted)] leading-relaxed">
              <EditableText
                value={hero.description || ""}
                onChange={(val) => onUpdateField("gov-hero", "description", val)}
                label="Description"
                isEditMode={isEditMode}
                multiline
              />
            </div>
          </div>
        </SectionContainer>

        <SectionContainer sectionKey="gov-checks" title="Pre-execution Checks">
          <div className="py-16 px-6 max-w-5xl mx-auto space-y-6">
            <h3 className="font-mono text-sm uppercase tracking-[0.14em] font-semibold text-[var(--color-ink)]">
              <EditableText
                value={checks.title || "Checks run before the draft is queued."}
                onChange={(val) => onUpdateField("gov-checks", "title", val)}
                label="Section Title"
                isEditMode={isEditMode}
              />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(checks.checks || []).map((c: any, idx: number) => (
                <div key={idx} className="card-surface p-5 rounded-[4px] border hairline space-y-2">
                  <div className="font-mono text-xs uppercase tracking-[0.1em] font-semibold text-[var(--color-ink)] flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-emerald-500" />
                    <span>{c.title}</span>
                  </div>
                  <div className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    <EditableText
                      value={c.desc || ""}
                      onChange={(val) =>
                        onUpdateField("gov-checks", `checks.${idx}.desc`, val)
                      }
                      label={`${c.title} Description`}
                      isEditMode={isEditMode}
                      multiline
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
      </div>
    );
  }

  /* ------------------------------------------------------------- */
  /*                      OTHER PAGES FALLBACK                     */
  /* ------------------------------------------------------------- */
  const sectionKeys = Object.keys(sectionsData);
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <span className="eyebrow block">Page: {pageSlug}</span>
        <h2 className="text-2xl font-mono uppercase font-semibold text-[var(--color-ink)]">
          {pageSlug.replace("-", " ")} Page Visual Representation
        </h2>
      </div>

      <div className="space-y-6">
        {sectionKeys.map((key) => {
          const s = sectionsData[key] || {};
          return (
            <SectionContainer key={key} sectionKey={key} title={key}>
              <div className="p-6 space-y-4">
                {s.headline && (
                  <h2 className="text-2xl font-medium text-[var(--color-ink)]">
                    <EditableText
                      value={s.headline}
                      onChange={(val) => onUpdateField(key, "headline", val)}
                      label={`${key} Headline`}
                      isEditMode={isEditMode}
                    />
                  </h2>
                )}
                {s.title && (
                  <h3 className="text-xl font-medium text-[var(--color-ink)]">
                    <EditableText
                      value={s.title}
                      onChange={(val) => onUpdateField(key, "title", val)}
                      label={`${key} Title`}
                      isEditMode={isEditMode}
                    />
                  </h3>
                )}
                {s.description && (
                  <div className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                    <EditableText
                      value={s.description}
                      onChange={(val) => onUpdateField(key, "description", val)}
                      label={`${key} Description`}
                      isEditMode={isEditMode}
                      multiline
                    />
                  </div>
                )}
              </div>
            </SectionContainer>
          );
        })}
      </div>
    </div>
  );
}
