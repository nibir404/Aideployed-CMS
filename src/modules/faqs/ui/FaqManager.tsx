"use client";

import { useState } from "react";
import { HelpCircle, Plus, Edit2, Trash2, CheckCircle2, X, Search, ChevronDown } from "lucide-react";
import type { FaqEntity } from "../types";
import { cn } from "@/core/lib/cn";

export function FaqManager({ initialFaqs }: { initialFaqs: FaqEntity[] }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqEntity | null>(null);

  const [question, setQuestion] = useState("");
  const [answerHtml, setAnswerHtml] = useState("");
  const [category, setCategory] = useState("general");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const categories = [
    "all",
    ...Array.from(new Set(faqs.map((f) => f.category))),
  ];

  const filteredFaqs = faqs.filter((f) => {
    const matchesCat = categoryFilter === "all" || f.category === categoryFilter;
    const matchesSearch =
      search.trim() === "" ||
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answerHtml.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openCreateModal = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswerHtml("");
    setCategory("general");
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FaqEntity) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswerHtml(faq.answerHtml);
    setCategory(faq.category);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answerHtml.trim()) return;

    setSaving(true);
    try {
      if (editingFaq) {
        const res = await fetch("/api/admin/faqs/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingFaq.id,
            question,
            answerHtml,
            category,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setFaqs((prev) =>
            prev.map((f) => (f.id === editingFaq.id ? data.faq : f))
          );
          setToast("FAQ updated");
        }
      } else {
        const res = await fetch("/api/admin/faqs/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, answerHtml, category }),
        });
        const data = await res.json();
        if (data.success) {
          setFaqs((prev) => [...prev, data.faq]);
          setToast("FAQ created");
        }
      }
      setIsModalOpen(false);
    } catch {
      setToast("Error saving FAQ");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ item?")) return;
    try {
      const res = await fetch("/api/admin/faqs/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        setToast("FAQ deleted");
      }
    } catch {
      setToast("Error deleting");
    } finally {
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions */}
      <div className="card-surface p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 border hairline rounded-[6px]">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-[240px]">
          {/* Quick Search */}
          <div className="relative min-w-[180px] max-w-xs flex-1">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-dim)]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="input-text pl-8 py-1.5 text-xs input-mono"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "h-8 px-3 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.1em] shrink-0 transition-colors inline-flex items-center",
                  categoryFilter === cat
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold shadow-xs"
                    : "bg-[var(--color-surface)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] border hairline"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {toast && (
            <span className="badge-status-success text-[9px] py-0.5">
              <CheckCircle2 size={10} /> {toast}
            </span>
          )}
          <button
            onClick={openCreateModal}
            className="btn-pill h-8 px-3.5 text-[10px] flex items-center gap-1.5"
          >
            <Plus size={11} />
            <span>Add FAQ</span>
          </button>
        </div>
      </div>

      {/* FAQ Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFaqs.length === 0 ? (
          <div className="md:col-span-2 p-8 sm:p-12 text-center card-surface border hairline rounded-[6px]">
            <HelpCircle size={22} className="mx-auto text-[var(--color-ink-dim)] mb-2" />
            <div className="font-mono text-xs text-[var(--color-ink-muted)]">
              No FAQs found matching filter.
            </div>
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="card-surface p-4 sm:p-5 rounded-[6px] border hairline flex flex-col justify-between space-y-3 hover:border-[var(--color-line-strong)] transition-all group shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded-[2px] border hairline bg-[var(--color-surface)] text-[var(--color-ink-dim)]">
                    {faq.category}
                  </span>
                  <span className="font-mono text-[9px] text-[var(--color-ink-dim)]">
                    #{faq.orderIndex}
                  </span>
                </div>
                <h3 className="font-medium text-xs sm:text-sm text-[var(--color-ink)] leading-snug">
                  {faq.question}
                </h3>
                <div
                  className="text-xs text-[var(--color-ink-muted)] leading-relaxed line-clamp-3 font-sans"
                  dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                />
              </div>

              <div className="pt-2.5 border-t hairline flex items-center justify-end gap-1.5">
                <button
                  onClick={() => openEditModal(faq)}
                  className="btn-icon h-8 w-8 text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] transition-colors"
                  title="Edit FAQ"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="btn-icon h-8 w-8 text-[var(--color-ink-dim)] hover:text-red-500 hover:border-red-500/30 transition-colors"
                  title="Delete FAQ"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="card-surface max-w-lg w-full p-4 sm:p-6 space-y-4 border hairline-strong shadow-2xl rounded-[6px]">
            <div className="flex items-center justify-between border-b hairline pb-2.5">
              <h3 className="font-mono text-xs uppercase tracking-[0.14em] font-semibold text-[var(--color-ink)]">
                {editingFaq ? "Edit FAQ Item" : "Create New FAQ"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] p-1 rounded"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="label-text">Question</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. What does AI Deployed actually do?"
                  className="input-text font-medium text-xs"
                />
              </div>

              <div>
                <label className="label-text">Category Tag</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. general, business, governance"
                  className="input-text input-mono text-xs"
                />
              </div>

              <div>
                <label className="label-text">Answer (HTML / Rich text allowed)</label>
                <textarea
                  rows={5}
                  required
                  value={answerHtml}
                  onChange={(e) => setAnswerHtml(e.target.value)}
                  placeholder="Detailed answer text..."
                  className="input-text leading-relaxed text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2.5 border-t hairline">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-ghost h-8 px-3.5 text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-pill h-8 px-4 text-[10px]"
                >
                  {saving ? "Saving..." : editingFaq ? "Update FAQ" : "Create FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
