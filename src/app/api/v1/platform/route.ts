import { NextResponse } from "next/server";
import { getPlatformModules } from "@/modules/platform";

export async function GET() {
  try {
    const modules = await getPlatformModules();

    const formatted = modules
      .filter((m) => m.isPublished)
      .map((m) => ({
        key: m.key,
        eyebrow: m.eyebrow,
        title: m.title,
        bodyText: m.bodyText,
        bullets: JSON.parse(m.bulletsJson || "[]"),
        mockCard: {
          title: m.mockCardTitle,
          url: m.mockCardUrl,
          fields: JSON.parse(m.mockFieldsJson || "[]"),
        },
        orderIndex: m.orderIndex,
        updatedAt: m.updatedAt,
      }));

    return NextResponse.json({ modules: formatted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
