"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/core/lib/cn";
import { Edit3 } from "lucide-react";

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  label?: string;
  isEditMode?: boolean;
  multiline?: boolean;
  className?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  placeholder?: string;
}

export function EditableText({
  value,
  onChange,
  label = "Text",
  isEditMode = true,
  multiline = false,
  className = "",
  tag = "div",
  placeholder = "Click to type...",
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(value || "");
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Sync state if prop changes externally
  useEffect(() => {
    setCurrentText(value || "");
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (currentText !== value) {
      onChange(currentText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setCurrentText(value);
      setIsEditing(false);
    }
  };

  // When not in edit mode (Preview Mode), render clean native element
  if (!isEditMode) {
    const TagName = tag;
    return <TagName className={className}>{value || placeholder}</TagName>;
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group/edit inline-block w-full max-w-full"
    >
      {/* Webflow-style floating element pill badge */}
      {isHovered && !isEditing && (
        <span className="absolute -top-5 left-0 z-30 font-mono text-[9px] uppercase tracking-[0.14em] bg-cyan-600 text-white px-1.5 py-0.5 rounded-[2px] shadow-md flex items-center gap-1 pointer-events-none whitespace-nowrap animate-fade-in">
          <Edit3 size={9} />
          <span>{label}</span>
        </span>
      )}

      {isEditing ? (
        <div className="relative z-20">
          <span className="absolute -top-5 left-0 z-30 font-mono text-[9px] uppercase tracking-[0.14em] bg-emerald-600 text-white px-1.5 py-0.5 rounded-[2px] shadow-md flex items-center gap-1 pointer-events-none whitespace-nowrap">
            <span>Editing · Enter to finish</span>
          </span>
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={currentText}
              onChange={(e) => {
                setCurrentText(e.target.value);
                onChange(e.target.value);
              }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              rows={Math.max(2, currentText.split("\n").length)}
              className={cn(
                "w-full bg-cyan-500/10 text-inherit font-inherit text-left resize-y rounded ring-2 ring-cyan-500 outline-none p-1",
                className
              )}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={currentText}
              onChange={(e) => {
                setCurrentText(e.target.value);
                onChange(e.target.value);
              }}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={cn(
                "w-full bg-cyan-500/10 text-inherit font-inherit text-left rounded ring-2 ring-cyan-500 outline-none p-1",
                className
              )}
            />
          )}
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className={cn(
            "cursor-text transition-all rounded px-0.5 -mx-0.5",
            isHovered && "ring-1 ring-cyan-500/50 bg-cyan-500/5",
            className
          )}
          title={`Click to edit ${label} inline (Webflow style)`}
        >
          {currentText || (
            <span className="text-[var(--color-ink-dim)] italic">
              {placeholder}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
