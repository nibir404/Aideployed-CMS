# AI Deployed — CMS Integration Guide

This guide explains how to connect the public marketing website repository ([nibir404/Ai-deployed](https://github.com/nibir404/Ai-deployed)) to this bespoke **AI Deployed CMS**.

---

## 1. Overview of Architecture

This CMS runs as an independent, lightweight **Micro-Monolith** service providing:
- Structured REST APIs with Next.js App Router cache tags (`tags: ['cms-content']`)
- On-Demand Cache Revalidation webhooks (`revalidateTag` & `revalidatePath`)
- Direct Inbound Leads API (`/api/v1/leads`) with CORS support and spam honeypot
- Dynamic CLI Knowledge Base (`/api/v1/cli-knowledge`) matching the site's `SITE_DATA` format

---

## 2. Environment Setup

In the marketing site repo (`Ai-deployed`):
Add the CMS base URL to your `.env.local`:

```env
# URL where this CMS is hosted (e.g. http://localhost:3001 in dev or https://cms.aideployed.io in prod)
CMS_URL="http://localhost:3001"
NEXT_PUBLIC_CMS_URL="http://localhost:3001"
REVALIDATION_SECRET="ai_deployed_cms_secret"
```

---

## 3. Connecting the Contact Form (`src/components/forms/ContactForm.tsx`)

Currently, `ContactForm.tsx` has a mocked timeout:
```typescript
// Replace lines 34-36 in ContactForm.tsx:
const res = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3001"}/api/v1/leads`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name,
    email,
    org,
    engagement,
    message,
  }),
});

if (!res.ok) throw new Error("Failed to submit");
setStatus("sent");
```

---

## 4. Connecting the Home Page Sections (`src/app/page.tsx`)

In `src/app/page.tsx`, fetch dynamic sections using Next.js 15 tagged caching:

```typescript
async function getHomeData() {
  const cmsUrl = process.env.CMS_URL || "http://localhost:3001";
  try {
    const res = await fetch(`${cmsUrl}/api/v1/content?page=home`, {
      next: { tags: ["cms-content", "page-home"] },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("CMS unreachable, falling back to static copy", err);
    return null;
  }
}

export default async function HomePage() {
  const cmsData = await getHomeData();
  const hero = cmsData?.sections?.hero;
  const whyFde = cmsData?.sections?.["why-fde"];
  const demo = cmsData?.sections?.demo;
  // Pass to components: <Hero content={hero} />
  ...
}
```

---

## 5. Connecting the CLI Assistant Knowledge Base (`src/components/site/Cli.tsx`)

In `src/lib/site-data.ts`, fetch the latest topics from the CMS:

```typescript
export async function fetchLiveTopics() {
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3001";
  try {
    const res = await fetch(`${cmsUrl}/api/v1/cli-knowledge`, {
      next: { tags: ["cli-knowledge"] },
    });
    const data = await res.json();
    return data.topics;
  } catch {
    return SITE_DATA; // Fallback to local copy
  }
}
```

---

## 6. On-Demand Cache Revalidation Route in `Ai-deployed`

Create `src/app/api/revalidate/route.ts` on the marketing site:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag);
  } else {
    revalidatePath("/", "layout");
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
```
Whenever an editor clicks **"Save Changes"** in this CMS, it automatically calls this endpoint, refreshing the production site cache within milliseconds!
