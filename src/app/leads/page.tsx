import { AdminLayout } from "@/core/ui/AdminLayout";
import { getLeads } from "@/modules/leads";
import { LeadsInbox } from "@/modules/leads/ui/LeadsInbox";

export const dynamic = "force-dynamic";

export default async function LeadsAdminPage() {
  const leads = await getLeads();

  const serializedLeads = leads.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString() as unknown as Date,
    updatedAt: l.updatedAt.toISOString() as unknown as Date,
  }));

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <span className="eyebrow block">Enterprise Pipeline</span>
          <h2 className="text-xl font-mono uppercase tracking-[0.08em] font-semibold text-white mt-1">
            Inbound Leads CRM
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Direct intake from aideployed.io/contact with engagement classification
            and status workflow
          </p>
        </div>

        <LeadsInbox initialLeads={serializedLeads} />
      </div>
    </AdminLayout>
  );
}
