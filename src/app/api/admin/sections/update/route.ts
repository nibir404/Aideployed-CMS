import { NextRequest, NextResponse } from "next/server";
import { updateSection } from "@/modules/content";
import { triggerRevalidation } from "@/modules/revalidation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageSlug, sectionKey, content } = body;

    if (!pageSlug || !sectionKey || !content) {
      return NextResponse.json(
        { error: "pageSlug, sectionKey, and content are required" },
        { status: 400 }
      );
    }

    const updated = await updateSection(pageSlug, sectionKey, content);

    // Auto-trigger revalidation
    await triggerRevalidation(`page-${pageSlug}`);

    return NextResponse.json({
      success: true,
      section: updated,
      message: "Section updated and revalidated",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
