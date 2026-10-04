import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/modules/leads";

// CORS headers to allow cross-origin submissions from aideployed.io
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor ? forwardedFor.split(",")[0].trim() : undefined;

    const lead = await createLead({
      name: body.name,
      email: body.email,
      organization: body.organization || body.org,
      engagementTier: body.engagement || body.engagementTier,
      message: body.message,
      honeypot: body.honeypot || body.website, // catches bot scripts
      ipAddress,
    });

    return NextResponse.json(
      {
        success: true,
        id: lead.id,
        message: "Submission received. A senior engineer will respond within one business day.",
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 400, headers: corsHeaders });
  }
}
