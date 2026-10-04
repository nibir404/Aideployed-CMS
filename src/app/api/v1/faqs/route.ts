import { NextResponse } from "next/server";
import { getFaqs } from "@/modules/faqs";

export async function GET() {
  try {
    const faqs = await getFaqs(true);
    return NextResponse.json({ faqs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
