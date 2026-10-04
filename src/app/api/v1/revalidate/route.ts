import { NextRequest, NextResponse } from "next/server";
import { triggerRevalidation } from "@/modules/revalidation";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag") || "cms-content";

    const result = await triggerRevalidation(tag);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
