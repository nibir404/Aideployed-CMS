"use client";

import { useState } from "react";
import { HelpCircle, Plus, Edit2, Trash2, CheckCircle2, X } from "lucide-react";
import type { FaqEntity } from "../types";

export function FaqManager({ initialFaqs }: { initialFaqs: FaqEntity[] }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [categoryFilter, setCategoryFilter] = useState("all");
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

  const filteredFaqs =
    categoryFilter === "all"
      ? faqs
      : faqs.filter((f) => f.category === categoryFilter);

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
    <div className="space-y-6">
      {/* Top Filter and Actions */}
      <div className="card-surface p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 mr-2">
            Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-[4px] font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                categoryFilter === cat
                  ? "bg-white text-neutral-900 font-semibold"
                  : "bg-[#161616] text-neutral-400 hover:text-white border hairline"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {toast && (
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-2 py-1 rounded-[3px]">
              <CheckCircle2 size={11} /> {toast}
            </span>
          )}
          <button
            onClick={openCreateModal}
            className="btn-pill h-8 px-3 text-[10px] inline-flex items-center gap-1.5"
          >
            <Plus size={12} />
            <span>New FAQ Item</span>
          </button>
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => (
          <div
            key={faq.id}
            className="card-surface p-6 flex items-start justify-between gap-6 group hover:border-neutral-500/40 transition-colors"
          >
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-[0.14em]">
                  #{idx + 1}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-[3px] border border-neutral-700 bg-neutral-800 text-neutral-300">
                  {faq.category}
                </span>
              </div>
              <h4 className="font-medium text-base text-white">{faq.question}</h4>
              <p
                className="text-xs text-neutral-400 leading-relaxed max-w-3xl"
                dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(faq)}
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-[4px] transition-colors"
                title="Edit FAQ"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(faq.id)}
                className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-[4px] transition-colors"
                title="Delete FAQ"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="card-surface max-w-xl w-full p-6 space-y-5 bg-[#121212] border border-neutral-700">
            <div className="flex items-center justify-between border-b hairline pb-3">
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-white">
                {editingFaq ? "Edit FAQ Item" : "Create New FAQ"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. What does AI Deployed actually do?"
                  className="w-full bg-[#181818] border hairline rounded-[4px] px-3.5 py-2 text-xs text-white focus:border-neutral-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. general, business, governance"
                  className="w-full bg-[#181818] border hairline rounded-[4px] px-3.5 py-2 text-xs font-mono text-white focus:border-neutral-400 outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-neutral-400 mb-1">
                  Answer (HTML / Rich text allowed)
                </label>
                <textarea
                  rows={5}
                  required
                  value={answerHtml}
                  onChange={(e) => setAnswerHtml(e.target.value)}
                  placeholder="Detailed answer text..."
                  className="w-full bg-[#181818] border hairline rounded-[4px] px-3.5 py-2 text-xs text-neutral-300 focus:border-neutral-400 outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t hairline">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-ghost h-8 px-3 text-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-pill h-8 px-4 text-[10px]"
                >
                  {saving ? "Saving..." : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
