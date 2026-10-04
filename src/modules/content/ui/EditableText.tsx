"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/core/lib/cn";

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

  // Preview Mode: render completely native element without any edit wrappers
  if (!isEditMode) {
    const TagName = tag;
    return <TagName className={className}>{value || placeholder}</TagName>;
  }

  return (
    <span className="relative inline-block w-full max-w-full">
      {isEditing ? (
        <span className="relative inline-block w-full">
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
                "w-full bg-cyan-500/10 text-inherit font-inherit text-left resize-y rounded outline-none ring-2 ring-cyan-500 p-1.5 transition-all",
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
                "w-full bg-cyan-500/10 text-inherit font-inherit text-left rounded outline-none ring-2 ring-cyan-500 px-1.5 py-0.5 transition-all",
                className
              )}
            />
          )}
        </span>
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={cn(
            "cursor-text transition-all rounded px-0.5 -mx-0.5 hover:outline hover:outline-1 hover:outline-cyan-500/50 hover:bg-cyan-500/5",
            className
          )}
          title={`Click to edit ${label}`}
        >
          {currentText || (
            <span className="text-[var(--color-ink-dim)] italic opacity-60">
              {placeholder}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
