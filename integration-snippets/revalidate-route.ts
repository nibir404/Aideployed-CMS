import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

/**
 * On-demand ISR revalidation endpoint for the marketing site.
 * Save this file at `src/app/api/revalidate/route.ts` in your Ai-deployed project.
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const tag = searchParams.get("tag");
    const path = searchParams.get("path");

    const expectedSecret =
      process.env.REVALIDATION_SECRET || "ai_deployed_cms_secret";

    if (secret !== expectedSecret) {
      return NextResponse.json({ message: "Invalid secret token" }, { status: 401 });
    }

    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, tag, now: Date.now() });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path, now: Date.now() });
    }

    // Default revalidate home
    revalidatePath("/");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Revalidation error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
