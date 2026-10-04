"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/core/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add("light");
      localStorage.setItem("aid-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("aid-theme", "dark");
    }
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)] inline-flex items-center gap-2 h-8 px-2.5",
          className
        )}
      >
        <span className="inline-block size-1.5 bg-current" />
        Theme
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors inline-flex items-center gap-2 h-8 px-2.5 rounded-[4px] border hairline hover:border-[var(--color-line-strong)]",
        className
      )}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
    >
      {isLight ? (
        <>
          <Sun size={12} className="text-amber-600" />
          <span>Light</span>
        </>
      ) : (
        <>
          <Moon size={12} className="text-neutral-400" />
          <span>Dark</span>
        </>
      )}
    </button>
  );
}
