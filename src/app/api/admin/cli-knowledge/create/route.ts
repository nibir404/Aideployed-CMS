import { NextRequest, NextResponse } from "next/server";
import { createCliTopic } from "@/modules/cli-knowledge";
import { triggerRevalidation } from "@/modules/revalidation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topicId, title, summary, keywords, facts, links } = body;

    if (!topicId || !title || !summary) {
      return NextResponse.json(
        { error: "topicId, title, and summary are required" },
        { status: 400 }
      );
    }

    const created = await createCliTopic({
      topicId,
      title,
      summary,
      keywords: keywords || [],
      facts: facts || [],
      links: links || [],
    });

    await triggerRevalidation("cli-knowledge");

    return NextResponse.json({ success: true, topic: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
