import { NextRequest, NextResponse } from "next/server";
import { updateLeadStatus } from "@/modules/leads";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const updated = await updateLeadStatus(id, status, notes);
    return NextResponse.json({ success: true, lead: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
