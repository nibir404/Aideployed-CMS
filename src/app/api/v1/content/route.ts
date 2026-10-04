import { NextRequest, NextResponse } from "next/server";
import { getPageBySlug, getPages } from "@/modules/content";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || searchParams.get("page");

  try {
    if (slug) {
      const page = await getPageBySlug(slug);
      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }

      // Format sections as a key-value map for convenient consumer usage
      const sectionsMap: Record<string, unknown> = {};
      if (page.sections) {
        for (const s of page.sections) {
          if (s.isPublished) {
            try {
              sectionsMap[s.sectionKey] = JSON.parse(s.contentJson);
            } catch {
              sectionsMap[s.sectionKey] = s.contentJson;
            }
          }
        }
      }

      return NextResponse.json({
        slug: page.slug,
        title: page.title,
        seo: {
          title: page.seoTitle,
          description: page.seoDesc,
          ogImage: page.ogImage,
        },
        sections: sectionsMap,
        updatedAt: page.updatedAt,
      });
    }

    const pages = await getPages();
    return NextResponse.json({ pages });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
