import { NextRequest, NextResponse } from "next/server";
import { updatePlatformModule } from "@/modules/platform";
import { triggerRevalidation } from "@/modules/revalidation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, ...data } = body;

    if (!key) {
      return NextResponse.json({ error: "Module key is required" }, { status: 400 });
    }

    const updated = await updatePlatformModule(key, data);
    await triggerRevalidation("platform-modules");

    return NextResponse.json({
      success: true,
      module: updated,
      message: "Platform module updated and revalidated",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
