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
      <div className="max-w-7xl mx-auto">
        <VisualPageBuilder initialPages={serializablePages} initialPageSlug="home" />
      </div>
    </AdminLayout>
  );
}
