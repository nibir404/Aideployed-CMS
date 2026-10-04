import { AdminLayout } from "@/core/ui/AdminLayout";
import { getSections } from "@/modules/content";
import { ContentStudio } from "@/modules/content/ui/ContentStudio";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const rawSections = await getSections("home");

  const serializableSections = rawSections.map((s) => ({
    id: s.id,
    sectionKey: s.sectionKey,
    title: s.title ?? null,
    contentJson: s.contentJson,
    orderIndex: s.orderIndex,
    updatedAt: s.updatedAt.toISOString(),
  }));

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <span className="eyebrow block">Studio // Home Page</span>
          <h2 className="text-xl font-mono uppercase tracking-[0.08em] font-semibold text-white mt-1">
            Section Content Manager
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Directly update copy, cards, and engagement parameters for aideployed.io
          </p>
        </div>

        <ContentStudio sections={serializableSections} pageSlug="home" />
      </div>
    </AdminLayout>
  );
}
