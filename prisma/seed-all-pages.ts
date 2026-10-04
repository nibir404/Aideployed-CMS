import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding all pages and sections for AI Deployed CMS...");

  // 1. Platform Page
  const platformPage = await prisma.page.upsert({
    where: { slug: "platform" },
    update: {},
    create: {
      slug: "platform",
      title: "Platform — AI Deployed",
      seoTitle: "Platform Architecture — AI Deployed",
      seoDesc: "7 integrated modules. Zero black boxes. Run AI agents with guaranteed compliance and auditability in your cloud.",
      isPublished: true,
    },
  });

  const platformSections = [
    {
      sectionKey: "platform-hero",
      title: "Platform Hero",
      orderIndex: 0,
      content: {
        eyebrow: "Platform Architecture",
        headline: "7 integrated modules.",
        headlineHighlight: "Zero black boxes.",
        description: "From architecture to continuous operations — every module built to run inside your private cloud perimeter under your governance.",
        primaryCta: { label: "Explore the stack", href: "#modules" },
        secondaryCta: { label: "Schedule architectural review", href: "/contact" },
      },
    },
    {
      sectionKey: "platform-modules",
      title: "The 7 Anchored Modules",
      orderIndex: 1,
      content: {
        eyebrow: "Architecture",
        title: "The operational loop.",
        titleHighlight: "Build to Measure.",
        description: "Seven interlocking capabilities that take an AI agent from raw specification to steady production.",
        modules: [
          { key: "build", num: "01", name: "Build", desc: "Scoped to the work. Goal, tools, guardrails, policy." },
          { key: "approve", num: "02", name: "Approve", desc: "The approval queue is yours. Human sign-off before action." },
          { key: "govern", num: "03", name: "Govern", desc: "Five checks at generation time. Fail-closed architecture." },
          { key: "audit", num: "04", name: "Audit", desc: "Immutable log of every prompt, tool call, and decision." },
          { key: "integrate", num: "05", name: "Integrate", desc: "Wire into your stack. Databases, APIs, messaging." },
          { key: "operate", num: "06", name: "Operate", desc: "Forward Deployed Engineers on call. Pager duty included." },
          { key: "measure", num: "07", name: "Measure", desc: "Track latency, cost, drift, and business outcomes live." },
        ],
      },
    },
    {
      sectionKey: "platform-cta",
      title: "Platform Call to Action",
      orderIndex: 2,
      content: {
        title: "Deploy the stack in your perimeter.",
        description: "Our forward deployed engineers stand up the runtime inside your VPC in under two weeks.",
        buttonLabel: "Request Architecture Blueprint",
        buttonHref: "/contact",
      },
    },
  ];

  for (const s of platformSections) {
    await prisma.section.upsert({
      where: {
        pageId_sectionKey: { pageId: platformPage.id, sectionKey: s.sectionKey },
      },
      update: {
        title: s.title,
        contentJson: JSON.stringify(s.content),
        orderIndex: s.orderIndex,
        isPublished: true,
      },
      create: {
        pageId: platformPage.id,
        sectionKey: s.sectionKey,
        title: s.title,
        contentJson: JSON.stringify(s.content),
        orderIndex: s.orderIndex,
        isPublished: true,
      },
    });
  }

  // 2. Governance Page
  const governancePage = await prisma.page.upsert({
    where: { slug: "governance" },
    update: {},
    create: {
      slug: "governance",
      title: "Governance — AI Deployed",
      seoTitle: "Governance & Safety Architecture — AI Deployed",
      seoDesc: "Every output checked, every action logged. The fail-closed governance layer behind every enterprise agent.",
      isPublished: true,
    },
  });

  const governanceSections = [
    {
      sectionKey: "gov-hero",
      title: "Governance Hero",
      orderIndex: 0,
      content: {
        eyebrow: "Governance",
        headline: "Every output checked,",
        headlineHighlight: "every action logged.",
        description: "The governance layer behind every agent we run — what gets checked, how it fails closed, where the audit trail lives.",
      },
    },
    {
      sectionKey: "gov-checks",
      title: "Pre-execution Checks",
      orderIndex: 1,
      content: {
        eyebrow: "What gets checked",
        title: "Checks run before the draft is queued.",
        description: "The policy stack runs at generation time, not after. Five checks, configurable per agent.",
        checks: [
          { title: "Voice match", desc: "Output reads as your voice. Tuned to your tone, register, vocabulary." },
          { title: "Claim verification", desc: "Any factual claim is checked against the linked source before queuing." },
          { title: "Policy compliance", desc: "Per-agent rules — read, write, trigger — enforced before generation." },
          { title: "Confidentiality", desc: "Sensitive fields stripped before model invocation. PII never sent out." },
          { title: "Brand consistency", desc: "Approved terminology and prohibited language enforced strictly." },
        ],
      },
    },
    {
      sectionKey: "gov-queue",
      title: "Approval Queue Model",
      orderIndex: 2,
      content: {
        eyebrow: "Approval queue",
        title: "The queue is yours, not ours.",
        description: "Drafts land in your existing ticketing, email, or chat tools. Agents never bypass human authorization on sensitive actions.",
      },
    },
    {
      sectionKey: "gov-audit",
      title: "Immutable Audit Trail",
      orderIndex: 3,
      content: {
        eyebrow: "Auditability",
        title: "Cryptographic logging and full provenance.",
        description: "Every model call, temperature, token count, and reviewer edit is signed and stored in your private log sink.",
      },
    },
  ];

  for (const s of governanceSections) {
    await prisma.section.upsert({
      where: {
        pageId_sectionKey: { pageId: governancePage.id, sectionKey: s.sectionKey },
      },
      update: {
        title: s.title,
        contentJson: JSON.stringify(s.content),
        orderIndex: s.orderIndex,
        isPublished: true,
      },
      create: {
        pageId: governancePage.id,
        sectionKey: s.sectionKey,
        title: s.title,
        contentJson: JSON.stringify(s.content),
        orderIndex: s.orderIndex,
        isPublished: true,
      },
    });
  }

  // 3. How We Work Page
  const hwwPage = await prisma.page.upsert({
    where: { slug: "how-we-work" },
    update: {},
    create: {
      slug: "how-we-work",
      title: "How We Work — AI Deployed",
      seoTitle: "How We Work — AI Deployed",
      seoDesc: "How an embedded Forward Deployed Engineer engagement actually runs from first diagnosis to production handoff.",
      isPublished: true,
    },
  });

  const hwwSections = [
    {
      sectionKey: "hww-hero",
      title: "How We Work Hero",
      orderIndex: 0,
      content: {
        eyebrow: "Engagement Process",
        headline: "How we work.",
        headlineHighlight: "How the engagement runs.",
        description: "Six phases. One embedded team. From diagnosis to steady-state operations.",
      },
    },
    {
      sectionKey: "hww-timeline",
      title: "Engagement Timeline",
      orderIndex: 1,
      content: {
        eyebrow: "Timeline",
        title: "Four weeks to production.",
        description: "A predictable, disciplined sprint cadence that eliminates the gap between model prototyping and real business impact.",
        stages: [
          { num: "01", title: "Sprint 1: Shadow & Diagnose", desc: "Join standups, map internal data flows, deliver diagnosis one-pager." },
          { num: "02", title: "Sprint 2: Architecture & VPC", desc: "Provision runtime, set guardrails, connect tools behind approval queue." },
          { num: "03", title: "Sprint 3: Production Pilot", desc: "Route live traffic slice with human approval. Measure throughput and error rates." },
          { num: "04", title: "Sprint 4: Handoff & Runbook", desc: "Train your engineers, deliver eval suites and transfer pager duty." },
        ],
      },
    },
  ];

  for (const s of hwwSections) {
    await prisma.section.upsert({
      where: {
        pageId_sectionKey: { pageId: hwwPage.id, sectionKey: s.sectionKey },
      },
      update: {
        title: s.title,
        contentJson: JSON.stringify(s.content),
        orderIndex: s.orderIndex,
        isPublished: true,
      },
      create: {
        pageId: hwwPage.id,
        sectionKey: s.sectionKey,
        title: s.title,
        contentJson: JSON.stringify(s.content),
        orderIndex: s.orderIndex,
        isPublished: true,
      },
    });
  }

  // 4. About Page
  const aboutPage = await prisma.page.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      slug: "about",
      title: "About — AI Deployed",
      seoTitle: "About AI Deployed — Engineering Ethos",
      seoDesc: "Senior forward deployed engineers who embed with your team to ship accountable production systems.",
      isPublished: true,
    },
  });

  const aboutSections = [
    {
      sectionKey: "about-hero",
      title: "About Hero",
      orderIndex: 0,
      content: {
        eyebrow: "About Us",
        headline: "Senior engineers,",
        headlineHighlight: "embedded where the work is.",
        description: "We founded AI Deployed because enterprise AI doesn't fail at the model — it fails in the last mile of production integration.",
      },
    },
    {
      sectionKey: "about-principles",
      title: "Core Operating Principles",
      orderIndex: 1,
      content: {
        eyebrow: "Principles",
        title: "What we believe.",
        items: [
          { title: "Code in your repo", desc: "Everything we build belongs to you. Zero proprietary lock-in, zero external dependencies." },
          { title: "Accountable on-call", desc: "We carry the pager for the systems we ship until your team is confident running them." },
          { title: "Diagnosis before code", desc: "We identify the true business constraint before writing a single line of prompt logic." },
        ],
      },
    },
  ];

  for (const s of aboutSections) {
    await prisma.section.upsert({
      where: {
        pageId_sectionKey: { pageId: aboutPage.id, sectionKey: s.sectionKey },
      },
      update: {
        title: s.title,
        contentJson: JSON.stringify(s.content),
        orderIndex: s.orderIndex,
        isPublished: true,
      },
      create: {
        pageId: aboutPage.id,
        sectionKey: s.sectionKey,
        title: s.title,
        contentJson: JSON.stringify(s.content),
        orderIndex: s.orderIndex,
        isPublished: true,
      },
    });
  }

  // 5. Contact Page
  const contactPage = await prisma.page.upsert({
    where: { slug: "contact" },
    update: {},
    create: {
      slug: "contact",
      title: "Contact — AI Deployed",
      seoTitle: "Start a Conversation — AI Deployed",
      seoDesc: "Talk directly with a senior Forward Deployed Engineer. One business day response guaranteed.",
      isPublished: true,
    },
  });

  const contactSections = [
    {
      sectionKey: "contact-hero",
      title: "Contact Header",
      orderIndex: 0,
      content: {
        eyebrow: "Direct Contact",
        headline: "Start the conversation.",
        headlineHighlight: "Talk with an engineer.",
        description: "Tell us about your team, your systems, and what you need deployed. We reply within one business day.",
      },
    },
    {
      sectionKey: "contact-options",
      title: "Engagement Tiers",
      orderIndex: 1,
      content: {
        eyebrow: "Engagement Tiers",
        title: "Choose the mode that fits your stage.",
        tiers: [
          { name: "Foundation", desc: "2-week diagnosis sprint and architectural feasibility prototype." },
          { name: "Embedded", desc: "Full-time senior FDE embedded with your team for 3-6 months." },
          { name: "Scaled", desc: "Multi-engineer squad deploying multiple agents across business units." },
        ],
      },
    },
  ];

  for (const s of contactSections) {
    await prisma.section.upsert({
      where: {
        pageId_sectionKey: { pageId: contactPage.id, sectionKey: s.sectionKey },
      },
      update: {
        title: s.title,
        contentJson: JSON.stringify(s.content),
        orderIndex: s.orderIndex,
        isPublished: true,
      },
      create: {
        pageId: contactPage.id,
        sectionKey: s.sectionKey,
        title: s.title,
        contentJson: JSON.stringify(s.content),
        orderIndex: s.orderIndex,
        isPublished: true,
      },
    });
  }

  console.log("Successfully seeded all 6 additional pages with sections!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
