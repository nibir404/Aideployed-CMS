import { AdminLayout } from "@/core/ui/AdminLayout";
import { getPlatformModules } from "@/modules/platform";
import { PlatformEditor } from "@/modules/platform/ui/PlatformEditor";

export const dynamic = "force-dynamic";

export default async function PlatformAdminPage() {
  const modules = await getPlatformModules();

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <span className="eyebrow block">Platform Architecture</span>
          <h2 className="text-xl font-mono uppercase tracking-[0.08em] font-semibold text-[var(--color-ink)] mt-1">
            The 7 Anchored Modules
          </h2>
          <p className="text-xs text-[var(--color-ink-muted)] mt-1 font-mono">
            Manage Build, Approve, Govern, Audit, Integrate, Operate, and Measure
            for aideployed.io/platform
          </p>
        </div>

        <PlatformEditor modules={modules} />
      </div>
    </AdminLayout>
  );
}
