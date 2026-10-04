import { NextResponse } from "next/server";
import { getCliTopics } from "@/modules/cli-knowledge";

export async function GET() {
  try {
    const rawTopics = await getCliTopics();

    // Format identically to SITE_DATA in Ai-deployed/src/lib/site-data.ts
    const topics = rawTopics.map((t) => ({
      id: t.topicId,
      keywords: JSON.parse(t.keywordsJson || "[]"),
      title: t.title,
      summary: t.summary,
      facts: JSON.parse(t.factsJson || "[]"),
      links: t.linksJson ? JSON.parse(t.linksJson) : [],
    }));

    return NextResponse.json({ topics });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
