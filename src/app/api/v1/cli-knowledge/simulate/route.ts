import { NextRequest, NextResponse } from "next/server";
import { simulateCliQuery } from "@/modules/cli-knowledge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = body.query || "";

    const result = await simulateCliQuery(query);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
