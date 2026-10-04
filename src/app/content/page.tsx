import { AdminLayout } from "@/core/ui/AdminLayout";
import { getPages } from "@/modules/content";
import { VisualPageBuilder } from "@/modules/content/ui/VisualPageBuilder";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const rawPages = await getPages();

  const serializablePages = rawPages.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    seoTitle: p.seoTitle ?? null,
    seoDesc: p.seoDesc ?? null,
    sections: (p.sections || []).map((s) => ({
      id: s.id,
      sectionKey: s.sectionKey,
      title: s.title ?? null,
      contentJson: s.contentJson,
      orderIndex: s.orderIndex,
      updatedAt: s.updatedAt.toISOString(),
    })),
  }));

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="eyebrow block">Visual Page Builder · Webflow / WordPress Style</span>
            <h2 className="text-xl font-mono uppercase tracking-[0.08em] font-semibold text-[var(--color-ink)] mt-1">
              On-Page Content & Section Studio
            </h2>
            <p className="text-xs text-[var(--color-ink-muted)] mt-1 font-mono">
              Choose any page from aideployed.io, navigate its sections, and edit copy, cards, and buttons directly on the real website canvas.
            </p>
          </div>
        </div>

        <VisualPageBuilder initialPages={serializablePages} initialPageSlug="home" />
      </div>
    </AdminLayout>
  );
}
