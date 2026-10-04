import { NextRequest, NextResponse } from "next/server";
import { createFaq } from "@/modules/faqs";
import { triggerRevalidation } from "@/modules/revalidation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const faq = await createFaq(body);
    await triggerRevalidation("faqs");

    return NextResponse.json({ success: true, faq }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
