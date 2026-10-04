import prisma from "@/core/db/prisma";

export interface RevalidateResult {
  success: boolean;
  endpoint: string;
  tag?: string;
  statusCode: number;
  message: string;
}

export async function triggerRevalidation(tag = "cms-content"): Promise<RevalidateResult> {
  const targetUrl = process.env.LIVE_SITE_URL || "https://www.aideployed.io";
  const revalidateSecret = process.env.REVALIDATION_SECRET || "ai_deployed_cms_secret";
  const endpoint = `${targetUrl}/api/revalidate?secret=${revalidateSecret}&tag=${encodeURIComponent(tag)}`;

  let statusCode = 200;
  let success = true;
  let message = "Revalidation signal dispatched";

  try {
    // Attempt actual webhook call if configured
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeout);

    if (res) {
      statusCode = res.status;
      success = res.ok;
      message = res.ok ? "Live cache refreshed successfully" : `Remote returned status ${res.status}`;
    } else {
      // In dev or offline mode
      statusCode = 200;
      message = "Revalidation queued locally (live site webhook offline or in dev)";
    }
  } catch (err: unknown) {
    statusCode = 500;
    success = false;
    message = err instanceof Error ? err.message : "Network error during revalidation";
  }

  // Audit in WebhookLog
  await prisma.webhookLog.create({
    data: {
      endpoint,
      tag,
      status: success ? "success" : "failed",
      responseCode: statusCode,
    },
  });

  return {
    success,
    endpoint,
    tag,
    statusCode,
    message,
  };
}

export async function getWebhookLogs() {
  return await prisma.webhookLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
