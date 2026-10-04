/**
 * AI Deployed CMS Client SDK for the marketing website.
 * Drop this file into `src/lib/cms.ts` in your Ai-deployed project.
 */

const CMS_URL = process.env.CMS_URL || process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3001";

export interface CmsResponse<T> {
  data: T | null;
  error?: string;
}

/**
 * Fetch dynamic page sections with Next.js 15 tagged caching (ISR).
 */
export async function getCmsPage(slug = "home") {
  try {
    const res = await fetch(`${CMS_URL}/api/v1/content?page=${encodeURIComponent(slug)}`, {
      next: { tags: ["cms-content", `page-${slug}`], revalidate: 3600 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`[CMS Client] Failed to fetch page "${slug}", using fallback copy`, err);
    return null;
  }
}

/**
 * Fetch the 7 platform modules.
 */
export async function getCmsPlatformModules() {
  try {
    const res = await fetch(`${CMS_URL}/api/v1/platform`, {
      next: { tags: ["platform-modules"], revalidate: 3600 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.modules;
  } catch (err) {
    console.warn("[CMS Client] Failed to fetch platform modules", err);
    return null;
  }
}

/**
 * Fetch published FAQs.
 */
export async function getCmsFaqs() {
  try {
    const res = await fetch(`${CMS_URL}/api/v1/faqs`, {
      next: { tags: ["faqs"], revalidate: 3600 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.faqs;
  } catch (err) {
    console.warn("[CMS Client] Failed to fetch FAQs", err);
    return null;
  }
}

/**
 * Fetch CLI knowledge topics.
 */
export async function getCmsCliTopics() {
  try {
    const res = await fetch(`${CMS_URL}/api/v1/cli-knowledge`, {
      next: { tags: ["cli-knowledge"], revalidate: 3600 },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.topics;
  } catch (err) {
    console.warn("[CMS Client] Failed to fetch CLI topics", err);
    return null;
  }
}

/**
 * Submit inbound contact form lead to the CMS CRM.
 */
export async function submitLead(payload: {
  name: string;
  email: string;
  org?: string;
  engagement: string;
  message: string;
  honeypot?: string;
}) {
  const res = await fetch(`${CMS_URL}/api/v1/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Submission failed");
  }

  return await res.json();
}
