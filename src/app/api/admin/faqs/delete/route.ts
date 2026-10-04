import { NextRequest, NextResponse } from "next/server";
import { deleteFaq } from "@/modules/faqs";
import { triggerRevalidation } from "@/modules/revalidation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "FAQ ID is required" }, { status: 400 });
    }

    await deleteFaq(id);
    await triggerRevalidation("faqs");

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
