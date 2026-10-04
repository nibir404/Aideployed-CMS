import { NextRequest, NextResponse } from "next/server";
import { updateFaq } from "@/modules/faqs";
import { triggerRevalidation } from "@/modules/revalidation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "FAQ ID is required" }, { status: 400 });
    }

    const faq = await updateFaq(id, data);
    await triggerRevalidation("faqs");

    return NextResponse.json({ success: true, faq });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
