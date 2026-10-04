"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/site/primitives/Button";
import { ArrowUpRight, Check } from "@/components/site/icons";
import { cn } from "@/lib/cn";

const ENGAGEMENT = [
  { id: "foundation", label: "Foundation", desc: "Assessment + 1 capability" },
  { id: "embedded", label: "Embedded", desc: "Forward Deployed team" },
  { id: "scaled", label: "Scaled", desc: "Full managed operations" },
  { id: "unsure", label: "Not sure yet", desc: "Help me figure it out" },
] as const;

type EngagementId = (typeof ENGAGEMENT)[number]["id"];
type Status = "idle" | "submitting" | "sent" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [engagement, setEngagement] = useState<EngagementId>("embedded");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error");
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    try {
      const cmsUrl =
        process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3001";

      const res = await fetch(`${cmsUrl}/api/v1/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          org: org.trim() || undefined,
          engagement,
          message: message.trim(),
          honeypot: honeypot.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit inquiry.");
      }

      setStatus("sent");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Unable to deliver inquiry. Please try again."
      );
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="card-surface p-6 sm:p-8 md:p-10"
      noValidate
    >
      {status === "sent" ? (
        <div className="py-12 text-center">
          <div className="inline-flex size-12 items-center justify-center border hairline mb-6">
            <Check size={20} className="text-ink" aria-hidden />
          </div>
          <h3 className="font-display text-h3 font-medium text-ink">
            Message received.
          </h3>
          <p className="mt-3 text-sm text-ink-muted max-w-sm mx-auto">
            A senior engineer will reach out within one business day with a
            proposed time for your 30-minute conversation.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Honeypot field for bot spam protection */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="hp_field">Do not fill this field</label>
            <input
              id="hp_field"
              type="text"
              name="hp_field"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim mb-2"
              >
                Name <span className="text-[var(--color-accent)]">*</span>
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-[var(--color-surface)] border hairline rounded-[4px] px-4 py-3 text-sm text-ink placeholder-ink-dim focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim mb-2"
              >
                Work email <span className="text-[var(--color-accent)]">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full bg-[var(--color-surface)] border hairline rounded-[4px] px-4 py-3 text-sm text-ink placeholder-ink-dim focus:outline-none focus:border-ink transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="org"
              className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim mb-2"
            >
              Organization / Company
            </label>
            <input
              id="org"
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="Acme Corp"
              className="w-full bg-[var(--color-surface)] border hairline rounded-[4px] px-4 py-3 text-sm text-ink placeholder-ink-dim focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          <div>
            <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim mb-2">
              Engagement tier
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ENGAGEMENT.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setEngagement(tier.id)}
                  className={cn(
                    "p-3.5 rounded-[4px] border text-left transition-all",
                    engagement === tier.id
                      ? "border-ink bg-[var(--color-surface)] text-ink"
                      : "hairline text-ink-muted hover:text-ink hover:bg-[var(--color-surface)]"
                  )}
                >
                  <div className="font-display text-sm font-medium">
                    {tier.label}
                  </div>
                  <div className="font-mono text-[10px] text-ink-dim mt-0.5">
                    {tier.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim mb-2"
            >
              Tell us about your systems and goals{" "}
              <span className="text-[var(--color-accent)]">*</span>
            </label>
            <textarea
              id="message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What work do you need automated or governed? What data sources will the agent touch?"
              className="w-full bg-[var(--color-surface)] border hairline rounded-[4px] px-4 py-3 text-sm text-ink placeholder-ink-dim focus:outline-none focus:border-ink transition-colors leading-relaxed"
            />
          </div>

          {errorMessage && (
            <div className="font-mono text-xs text-red-400 bg-red-950/20 border border-red-900/40 p-3 rounded-[4px]">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-dim">
              Response within 1 business day
            </span>
            <Button
              type="submit"
              disabled={status === "submitting"}
              className="btn-pill"
            >
              <span className="btn-pill__label">
                {status === "submitting" ? "Sending..." : "Submit inquiry"}
              </span>
              <span className="btn-pill__icon" aria-hidden>
                <ArrowUpRight size={14} />
              </span>
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
