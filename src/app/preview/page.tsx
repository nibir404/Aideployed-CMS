import { AdminLayout } from "@/core/ui/AdminLayout";
import { LivePreviewFrame } from "@/core/ui/LivePreviewFrame";

export const dynamic = "force-dynamic";

export default function PreviewPage() {
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow block">Live Simulator</span>
            <h2 className="text-xl font-mono uppercase tracking-[0.08em] font-semibold text-[var(--color-ink)] mt-1">
              Website Live Preview Frame
            </h2>
            <p className="text-xs text-[var(--color-ink-muted)] mt-1 font-mono">
              Inspect how published CMS content, platform modules, and themes look
              across Desktop, Tablet, and Mobile viewports
            </p>
          </div>
        </div>

        <LivePreviewFrame />
      </div>
    </AdminLayout>
  );
}
