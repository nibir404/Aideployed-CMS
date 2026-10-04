import { AdminLayout } from "@/core/ui/AdminLayout";
import { getFaqs } from "@/modules/faqs";
import { FaqManager } from "@/modules/faqs/ui/FaqManager";

export const dynamic = "force-dynamic";

export default async function FaqAdminPage() {
  const faqs = await getFaqs();

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <span className="eyebrow block">Knowledge Directory</span>
          <h2 className="text-xl font-mono uppercase tracking-[0.08em] font-semibold text-[var(--color-ink)] mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[var(--color-ink-muted)] mt-1 font-mono">
            Manage public FAQs displayed on aideployed.io/faq
          </p>
        </div>

        <FaqManager initialFaqs={faqs} />
      </div>
    </AdminLayout>
  );
}
