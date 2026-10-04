import { AdminLayout } from "@/core/ui/AdminLayout";
import { getCliTopics } from "@/modules/cli-knowledge";
import { CliKnowledgeStudio } from "@/modules/cli-knowledge/ui/CliKnowledgeStudio";

export const dynamic = "force-dynamic";

export default async function CliKnowledgeAdminPage() {
  const topics = await getCliTopics();

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <span className="eyebrow block">AI Terminal System</span>
          <h2 className="text-xl font-mono uppercase tracking-[0.08em] font-semibold text-white mt-1">
            CLI Assistant Knowledge Base
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Configure topics, keywords, and editorial bullet facts with real-time
            simulation testing
          </p>
        </div>

        <CliKnowledgeStudio initialTopics={topics} />
      </div>
    </AdminLayout>
  );
}
