import { NextRequest, NextResponse } from "next/server";
import { updateCliTopic } from "@/modules/cli-knowledge";
import { triggerRevalidation } from "@/modules/revalidation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId, ...data } = body;

    if (!topicId) {
      return NextResponse.json({ error: "topicId is required" }, { status: 400 });
    }

    const updated = await updateCliTopic(topicId, data);
    await triggerRevalidation("cli-knowledge");

    return NextResponse.json({ success: true, topic: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
