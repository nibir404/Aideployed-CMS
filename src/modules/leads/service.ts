import prisma from "@/core/db/prisma";
import type { CreateLeadInput, LeadEntity, LeadFilter, LeadStatus } from "./types";

export async function getLeads(filter?: LeadFilter): Promise<LeadEntity[]> {
  const where: Record<string, unknown> = {};

  if (filter?.status && filter.status !== "all") {
    where.status = filter.status;
  }

  if (filter?.engagementTier && filter.engagementTier !== "all") {
    where.engagementTier = filter.engagementTier;
  }

  if (filter?.search) {
    const s = filter.search.trim();
    where.OR = [
      { name: { contains: s } },
      { email: { contains: s } },
      { organization: { contains: s } },
      { message: { contains: s } },
    ];
  }

  return await prisma.leadSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getLeadById(id: string): Promise<LeadEntity | null> {
  return await prisma.leadSubmission.findUnique({
    where: { id },
  });
}

export async function createLead(input: CreateLeadInput): Promise<LeadEntity> {
  // Honeypot check: bots fill hidden inputs
  if (input.honeypot && input.honeypot.trim().length > 0) {
    throw new Error("Spam detected");
  }

  if (!input.name.trim() || !input.email.trim() || !input.message.trim()) {
    throw new Error("Name, email, and message are required fields");
  }

  return await prisma.leadSubmission.create({
    data: {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      organization: input.organization?.trim() || null,
      engagementTier: input.engagementTier || "embedded",
      message: input.message.trim(),
      status: "new",
      ipAddress: input.ipAddress || null,
    },
  });
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  notes?: string
): Promise<LeadEntity> {
  return await prisma.leadSubmission.update({
    where: { id },
    data: {
      status,
      notes: notes !== undefined ? notes : undefined,
      updatedAt: new Date(),
    },
  });
}

export async function deleteLead(id: string): Promise<LeadEntity> {
  return await prisma.leadSubmission.delete({
    where: { id },
  });
}

export async function exportLeadsToCsv(): Promise<string> {
  const leads = await prisma.leadSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = ["ID", "Date", "Name", "Email", "Organization", "Tier", "Status", "Message", "Notes"];
  const rows = leads.map((l) => [
    `"${l.id}"`,
    `"${l.createdAt.toISOString()}"`,
    `"${l.name.replace(/"/g, '""')}"`,
    `"${l.email.replace(/"/g, '""')}"`,
    `"${(l.organization || "").replace(/"/g, '""')}"`,
    `"${l.engagementTier}"`,
    `"${l.status}"`,
    `"${l.message.replace(/"/g, '""').replace(/\n/g, " ")}"`,
    `"${(l.notes || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
  ]);

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
