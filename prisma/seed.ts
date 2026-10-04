import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting AI Deployed CMS seed...");

  // 1. Create Default Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@aideployed.io" },
    update: {},
    create: {
      email: "admin@aideployed.io",
      name: "Forward Deployed Admin",
      passwordHash: "aideployed2025", // In production replace with bcrypt hash
      role: "admin",
    },
  });
  console.log(`✓ Admin user ready: ${admin.email}`);

  // 2. Seed Home Page & Sections
  const homePage = await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      slug: "home",
      title: "AI Deployed — Embedded AI and software, built and run for you",
      seoTitle: "AI Deployed — Embedded AI and software, built and run for you",
      seoDesc:
        "AI Deployed embeds with your team to architect, build, deploy, and operationalize AI and software systems across cloud, private, and tightly controlled environments.",
      ogImage: "/img/AiDeployed-og.png",
      isPublished: true,
    },
  });

  const homeSections = [
    {
      sectionKey: "hero",
      title: "Hero Section",
      orderIndex: 0,
      content: {
        eyebrow: "AI Deployed · Embedded",
        headline: "Embed with your team.",
        headlineHighlight: "Architect, build, run.",
        description:
          "AI and software systems, in your environment, under your governance.",
        primaryCta: {
          label: "Start a conversation",
          href: "/contact",
        },
        secondaryCta: {
          label: "See how it works",
          href: "/how-we-work",
        },
        asciiGridEnabled: true,
      },
    },
    {
      sectionKey: "why-fde",
      title: "Why Forward Deployed Engineers",
      orderIndex: 1,
      content: {
        eyebrow: "Embedded engineers",
        title: "The role that closes the gap.",
        titleHighlight: "Between the demo and the production system.",
        description:
          "A Forward Deployed Engineer is a senior engineer embedded with your team — owning the deployment, translating between the AI system and the operations it serves.",
        pillars: [
          {
            title: "The last mile",
            desc: "Most AI projects stall between the model and the production system. The FDE owns that distance.",
          },
          {
            title: "Embedded, not external",
            desc: "They sit inside your stack, tools, and review queues. They ship where the work is.",
          },
          {
            title: "Accountable in production",
            desc: "They carry the pager, run the rollout, and own the outcome against the business — not the demo.",
          },
        ],
        steps: [
          {
            title: "Deploy",
            desc: "Stand the agent up in your environment, against your systems, behind your approval queue.",
          },
          {
            title: "Integrate",
            desc: "Wire it into the tools your team already uses.",
          },
          {
            title: "Observe",
            desc: "Instrument the runtime, watch the outputs, catch regressions early.",
          },
          {
            title: "Govern",
            desc: "Tune the approval mode, the guardrails, the data discipline.",
          },
          {
            title: "Hand off",
            desc: "When the system is steady, transfer operation to a named owner on your team.",
          },
        ],
        bottomTagline: "Embedded. Accountable. On-call.",
      },
    },
    {
      sectionKey: "demo",
      title: "Interactive Engagement Walkthrough",
      orderIndex: 2,
      content: {
        eyebrow: "Engagement",
        title: "How an embedded engagement",
        titleHighlight: "runs.",
        description:
          "Six phases, one card. Hit play to walk through the engagement — diagnose, embed, ship, hand off, follow up, re-engage.",
        phases: [
          {
            phase: 1,
            title: "Diagnose",
            progress: 25,
            headline: "Shadow the team. Map the work. Write the diagnosis.",
            desc: "The FDE joins your standup, shadows the team for one sprint, and writes a one-page diagnosis of the actual bottleneck.",
            deliverable: "Diagnosis",
            version: "v0.3",
          },
          {
            phase: 2,
            title: "Embed",
            progress: 45,
            headline: "Sit in the stack. Set the runtime. Establish the queue.",
            desc: "The FDE stands up the runtime inside your VPC or private cloud, connects data sources, and routes outputs through the human-in-the-loop approval gate.",
            deliverable: "Runtime Spec",
            version: "v1.0",
          },
          {
            phase: 3,
            title: "Ship",
            progress: 65,
            headline: "Run the first slice in production. Measure live work.",
            desc: "The agent takes production traffic with human approval. The FDE tunes prompts, guardrails, and latency targets against real edge cases.",
            deliverable: "Pilot Report",
            version: "v1.2",
          },
          {
            phase: 4,
            title: "Hand off",
            progress: 80,
            headline:
              "Train the team. Transfer the pager. Document the edge cases.",
            desc: "Your engineers take ownership with the FDE shadowing. Runbooks, eval suites, and monitoring dashboards are delivered.",
            deliverable: "Runbook",
            version: "v2.0",
          },
          {
            phase: 5,
            title: "Follow up",
            progress: 90,
            headline: "Quarterly review. Architecture audit. Capability check.",
            desc: "Check in on drift, model upgrades, and new agent opportunities across business units.",
            deliverable: "Audit Review",
            version: "Q1",
          },
          {
            phase: 6,
            title: "Continuous",
            progress: 100,
            headline: "Ongoing operational excellence and model upgrades.",
            desc: "SLA-backed tier for mission-critical deployments with guaranteed incident response times.",
            deliverable: "Ops SLA",
            version: "Active",
          },
        ],
        workQueue: [
          {
            label: "Diagnosis one-pager",
            status: "In review",
            statusType: "neutral",
          },
          {
            label: "System map",
            status: "Pending review",
            statusType: "muted",
          },
          {
            label: "Engagement scope",
            status: "Approved",
            statusType: "accent",
          },
        ],
      },
    },
    {
      sectionKey: "capability-grid",
      title: "Capability Grid (Our People / Our Stack)",
      orderIndex: 3,
      content: {
        eyebrow: "What we bring",
        title: "What an embedded engagement",
        titleHighlight: "delivers.",
        peopleCards: [
          {
            title: "Senior engineers, embedded",
            desc: "Named senior engineers on every engagement — the same people on the call are the people doing the work.",
            icon: "Briefcase",
          },
          {
            title: "Diagnosis before code",
            desc: "The FDE shadows the team for a sprint, writes a one-page diagnosis, and only then opens a PR.",
            icon: "Target",
          },
          {
            title: "Review and handoff",
            desc: "Every PR is reviewed by your team. The engagement ends when your team runs the work without the FDE.",
            icon: "ShieldCheck",
          },
          {
            title: "Quietly opinionated",
            desc: "Strong views on the modern stack and the right amount of AI — we bring them and adjust when your team pushes back.",
            icon: "Sparkles",
          },
        ],
        stackCards: [
          {
            title: "Web and APIs",
            desc: "TypeScript end-to-end, Next.js, Go, Python. Postgres, Redis, queues, search. On the platforms your team already uses.",
            icon: "Layers",
          },
          {
            title: "Data plumbing",
            desc: "Merge legacy sources into one queryable warehouse. Fix the schema. Ship the migration. Hand off the runbook.",
            icon: "Database",
          },
          {
            title: "AI where it helps",
            desc: "Embeddings for search, LLMs for triage, agents for the queue. We bring the configuration, guardrails, and audit log.",
            icon: "Cpu",
          },
          {
            title: "Internal tools that ship",
            desc: "The lightweight admin tool the team needs but never built. Live in two weeks, in your repo, behind your auth.",
            icon: "Terminal",
          },
        ],
      },
    },
    {
      sectionKey: "use-cases",
      title: "Use Cases",
      orderIndex: 4,
      content: {
        eyebrow: "Use cases",
        title: "Built for one job.",
        titleHighlight: "Built for your environment.",
        description:
          "Six functions. Each agent scoped to the work, governed by your rules, reviewed by your team.",
        cases: [
          {
            title: "Support",
            desc: "Triage inbound. Draft replies for your team to approve.",
          },
          {
            title: "Sales",
            desc: "Personalized follow-ups after every demo. Matched to your voice.",
          },
          {
            title: "Operations",
            desc: "Reorder low-stock SKUs, route approvals, keep the ops inbox clean.",
          },
          {
            title: "Analytics",
            desc: "Weekly pipeline summaries, risk callouts, board-ready notes.",
          },
          {
            title: "Finance",
            desc: "Reconcile invoices, flag anomalies, draft approvals for the controller.",
          },
          {
            title: "Marketing",
            desc: "Newsletter drafts, subject-line tests, social scheduling.",
          },
        ],
      },
    },
    {
      sectionKey: "differentiators",
      title: "Differentiators",
      orderIndex: 5,
      content: {
        eyebrow: "Differentiators",
        title: "What makes us different.",
        items: [
          {
            num: "01",
            title: "Custom build, not a generic assistant.",
            desc: "Each agent is scoped to one job — a goal, a tool allowlist, guardrails, and an approval mode. We design the configuration with you, against your systems.",
          },
          {
            num: "02",
            title: "An approval gate you control.",
            desc: "Every agent operates under an approval queue. Drafts land there first. The agent never sends, writes, or triggers directly. We cannot bypass it from our side.",
          },
          {
            num: "03",
            title: "We architect, build, run.",
            desc: "Your team reviews the queue. We handle the runtime, monitoring, configuration drift, and model updates. If the agent does not perform, we change the configuration, the model, or the policy.",
          },
        ],
      },
    },
    {
      sectionKey: "engagement-steps",
      title: "Engagement Timeline",
      orderIndex: 6,
      content: {
        eyebrow: "Engagement",
        title: "From discovery to an agent in production.",
        description:
          "Four steps. Running in production by week four. After that, we run the agent and tune the configuration as your business changes.",
        steps: [
          {
            num: "01",
            title: "Discovery",
            desc: "We learn the work, your systems, and your governance requirements.",
            badge: "First",
          },
          {
            num: "02",
            title: "Architect and build",
            desc: "We design the agent — goal, tools, guardrails, approval mode — and build it against your systems.",
            badge: "Build",
          },
          {
            num: "03",
            title: "Review",
            desc: "Your team reviews the drafts. We tune the configuration from what your team edits.",
            badge: "Review",
          },
          {
            num: "04",
            title: "Run and improve",
            desc: "We operate the agent, tune the model, and update the policy as your business changes.",
            badge: "Operate",
          },
        ],
      },
    },
    {
      sectionKey: "commitments",
      title: "Commitments",
      orderIndex: 7,
      content: {
        eyebrow: "Commitments",
        title: "Operational guarantees.",
        items: [
          {
            title: "Response",
            desc: "We reply within one business day. No ticketing portals, no tiers — direct engineer contact.",
          },
          {
            title: "Security",
            desc: "Private deployments inside your cloud or on-prem perimeter. Zero data retention on our end.",
          },
          {
            title: "Governance",
            desc: "Fail-closed policy architecture. Human sign-off on any irreversible or high-risk action.",
          },
        ],
      },
    },
    {
      sectionKey: "final-cta",
      title: "Final Call to Action",
      orderIndex: 8,
      content: {
        title: "Start the conversation.",
        description:
          "Tell us about your context. A senior engineer responds within one business day.",
        buttonLabel: "Start a conversation",
        buttonHref: "/contact",
      },
    },
  ];

  for (const s of homeSections) {
    await prisma.section.upsert({
      where: {
        pageId_sectionKey: {
          pageId: homePage.id,
          sectionKey: s.sectionKey,
        },
      },
      update: {
        title: s.title,
        contentJson: JSON.stringify(s.content),
        orderIndex: s.orderIndex,
        isPublished: true,
      },
      create: {
        pageId: homePage.id,
        sectionKey: s.sectionKey,
        title: s.title,
        contentJson: JSON.stringify(s.content),
        orderIndex: s.orderIndex,
        isPublished: true,
      },
    });
  }
  console.log(`✓ Seeded ${homeSections.length} home sections`);

  // 3. Seed Platform Modules (7 anchored modules)
  const platformModules = [
    {
      key: "build",
      eyebrow: "01 · Build",
      title: "Scoped to the work.",
      bodyText:
        "Every agent is defined by its goal, tool allowlist, and guardrails. We design the configuration with your team, against your actual systems.",
      bulletsJson: JSON.stringify([
        "One agent, one job — no generalized assistants",
        "Deterministic inputs with guarded tool permissions",
        "Configured directly in your environment and VPC",
      ]),
      mockCardTitle: "Config",
      mockCardUrl: "aideployed.io/agent/ops-triage",
      mockFieldsJson: JSON.stringify([
        { label: "Target", value: "Ops queue triage" },
        { label: "Approval", value: "Review", chip: "Strict" },
        { label: "Sandbox", value: "VPC-East-1" },
      ]),
      orderIndex: 0,
    },
    {
      key: "approve",
      eyebrow: "02 · Approve",
      title: "The human approval gate.",
      bodyText:
        "Drafts and actions sit in the queue until approved. No silent executions, no unreviewed changes.",
      bulletsJson: JSON.stringify([
        "Visual queue for your team to review and edit",
        "Agent cannot bypass gate from the outside",
        "Adaptive approval levels: Auto, Review, or Strict",
      ]),
      mockCardTitle: "Queue",
      mockCardUrl: "aideployed.io/queue/pending",
      mockFieldsJson: JSON.stringify([
        { label: "Action", value: "Invoice reconciliation" },
        { label: "Status", value: "Pending human signoff", chip: "Requires Auth" },
      ]),
      orderIndex: 1,
    },
    {
      key: "govern",
      eyebrow: "03 · Govern",
      title: "Fail-closed policies.",
      bodyText:
        "If a safety rule or confidence boundary is violated, the action halts immediately and routes to engineering.",
      bulletsJson: JSON.stringify([
        "Automatic PII and sensitive data masking",
        "Hard-coded token limits and circuit breakers",
        "Zero data retention on external model APIs",
      ]),
      mockCardTitle: "Policies",
      mockCardUrl: "aideployed.io/policy/audit",
      mockFieldsJson: JSON.stringify([
        { label: "Rule", value: "Strict PII filtering" },
        { label: "Action", value: "Auto-redact" },
      ]),
      orderIndex: 2,
    },
    {
      key: "audit",
      eyebrow: "04 · Audit",
      title: "Two synced, append-only logs.",
      bodyText:
        "Every input, output, latency check, and approval decision is immutable and exportable for compliance.",
      bulletsJson: JSON.stringify([
        "Cryptographically signed decision trail",
        "Real-time streaming to your SIEM or Datadog",
        "Full replayability for post-incident analysis",
      ]),
      mockCardTitle: "Log Viewer",
      mockCardUrl: "aideployed.io/audit/stream",
      mockFieldsJson: JSON.stringify([
        { label: "Events", value: "14,820 recorded" },
        { label: "Retention", value: "7 years" },
      ]),
      orderIndex: 3,
    },
    {
      key: "integrate",
      eyebrow: "05 · Integrate",
      title: "Plugs into your stack.",
      bodyText:
        "Postgres, Salesforce, Slack, GitHub, internal REST APIs — we wire the connectors directly.",
      bulletsJson: JSON.stringify([
        "Native protocol support: SQL, REST, gRPC, Webhooks",
        "mTLS and private endpoint peering",
        "Maintained by Forward Deployed Engineers",
      ]),
      mockCardTitle: "Connectors",
      mockCardUrl: "aideployed.io/integrations",
      mockFieldsJson: JSON.stringify([
        { label: "Sources", value: "PostgreSQL, Slack, Zendesk" },
        { label: "Auth", value: "OAuth2 / mTLS" },
      ]),
      orderIndex: 4,
    },
    {
      key: "operate",
      eyebrow: "06 · Operate",
      title: "Run and monitored for you.",
      bodyText:
        "Our forward deployed engineers carry the pager. If an agent encounters drift or errors, we resolve it.",
      bulletsJson: JSON.stringify([
        "Dedicated senior engineers on call",
        "Proactive prompt and model drift mitigation",
        "Weekly performance reports and sync calls",
      ]),
      mockCardTitle: "Operations",
      mockCardUrl: "aideployed.io/runtime/health",
      mockFieldsJson: JSON.stringify([
        { label: "Uptime", value: "99.98%" },
        { label: "SLA", value: "<15 min response" },
      ]),
      orderIndex: 5,
    },
    {
      key: "measure",
      eyebrow: "07 · Measure",
      title: "Clear business metrics.",
      bodyText:
        "Track hours saved, error rates, throughput, and ROI weekly with board-ready analytics.",
      bulletsJson: JSON.stringify([
        "Automated weekly impact briefings",
        "Granular cost per successful transaction",
        "Human intervention frequency tracking",
      ]),
      mockCardTitle: "Metrics",
      mockCardUrl: "aideployed.io/analytics/summary",
      mockFieldsJson: JSON.stringify([
        { label: "Time saved", value: "184 hrs / mo" },
        { label: "Accuracy", value: "99.4%" },
      ]),
      orderIndex: 6,
    },
  ];

  for (const m of platformModules) {
    await prisma.platformModule.upsert({
      where: { key: m.key },
      update: m,
      create: m,
    });
  }
  console.log(`✓ Seeded ${platformModules.length} platform modules`);

  // 4. Seed FAQs
  const faqs = [
    {
      question: "What does AI Deployed actually do?",
      answerHtml:
        "We architect, build, deploy, and run AI and software systems for your business. Each agent is scoped to one job, runs against your data, and operates under an approval gate you control. You review the queue — we do the rest.",
      category: "general",
      orderIndex: 0,
    },
    {
      question: "How is this different from buying an AI tool?",
      answerHtml:
        "An AI tool gives you software. We give you an outcome — the agent is configured for your business, run by our team, and tuned as your business changes.",
      category: "general",
      orderIndex: 1,
    },
    {
      question: "What kinds of businesses do you work with?",
      answerHtml:
        "Businesses where AI is operationally important — real work for an agent every day, governance that matters.",
      category: "business",
      orderIndex: 2,
    },
    {
      question: 'What does "run" mean?',
      answerHtml:
        "We own the runtime after launch — model selection, retries, queue monitoring, configuration updates. If the model drifts, we change it. If the policy needs to evolve, we update it.",
      category: "operations",
      orderIndex: 3,
    },
    {
      question: "What does the approval gate look like?",
      answerHtml:
        "Every agent has a queue. Drafts land there first. The agent never sends, writes, or triggers directly. Your team reviews, edits, approves.",
      category: "governance",
      orderIndex: 4,
    },
    {
      question: "Can I keep using my existing tools?",
      answerHtml:
        "Yes. Agents plug into the systems you already use — email, CRM, support, internal APIs. We do the wiring. The audit log captures every call.",
      category: "integrations",
      orderIndex: 5,
    },
    {
      question: "How long does an engagement last?",
      answerHtml:
        "Ongoing by default. We tune the configuration as your business changes. The cost is structured around the work the agent does.",
      category: "business",
      orderIndex: 6,
    },
    {
      question: "How do we start?",
      answerHtml:
        "A discovery conversation. We learn the work, your systems, your governance requirements. If we're not the right fit, we'll say so.",
      category: "onboarding",
      orderIndex: 7,
    },
  ];

  await prisma.faqItem.deleteMany();
  for (const faq of faqs) {
    await prisma.faqItem.create({ data: faq });
  }
  console.log(`✓ Seeded ${faqs.length} FAQ items`);

  // 5. Seed CLI Assistant Knowledge Base
  const cliTopics = [
    {
      topicId: "what",
      keywordsJson: JSON.stringify([
        "what",
        "do",
        "company",
        "about",
        "who",
        "ai-deployed",
        "aideployed",
      ]),
      title: "What AI Deployed does",
      summary:
        "We architect, build, deploy, and run AI and software systems for businesses that need a real, governed system in production.",
      factsJson: JSON.stringify([
        "AI Deployed architects, builds, deploys, and runs AI and software systems — embedded with your team.",
        "Each agent is a configuration: a goal, a tool allowlist, guardrails, an approval mode.",
        "We run the agents in production, monitor the queue, and improve the configuration as your business changes.",
        "Delivered by named people — not a pool.",
      ]),
      linksJson: JSON.stringify([
        { label: "How it works", href: "/platform" },
        { label: "Talk to us", href: "/contact" },
      ]),
    },
    {
      topicId: "agents",
      keywordsJson: JSON.stringify([
        "agent",
        "agents",
        "ai",
        "custom",
        "build",
        "configuration",
      ]),
      title: "Custom AI agents",
      summary:
        "Each agent is scoped to one job — a goal, a tool allowlist, guardrails, an approval mode.",
      factsJson: JSON.stringify([
        "One agent, one job.",
        "Configuration is the product. If the configuration is wrong, the agent is wrong.",
        "We design the configuration with you, against your existing systems.",
        "We cannot bypass the approval gate. The governance layer enforces it.",
      ]),
      linksJson: JSON.stringify([{ label: "Platform", href: "/platform" }]),
    },
    {
      topicId: "governance",
      keywordsJson: JSON.stringify([
        "govern",
        "governance",
        "approval",
        "audit",
        "policy",
        "compliance",
        "guardrail",
      ]),
      title: "Governance",
      summary:
        "Approval queues, audit logs, and a failsafe policy layer. The agent never sends, writes, or triggers directly.",
      factsJson: JSON.stringify([
        "Every agent has an approval queue. Nothing leaves without your team.",
        "Two synced logs. Every input, output, and decision — append-only, queryable.",
        "Sensitive fields stripped before the model. PII never reaches the model.",
        "You decide the approval mode per agent — auto, review, or strict.",
        "The policy layer enforces the rules. The agent cannot override it.",
      ]),
      linksJson: JSON.stringify([{ label: "Governance", href: "/governance" }]),
    },
    {
      topicId: "platform",
      keywordsJson: JSON.stringify([
        "platform",
        "build",
        "approve",
        "operate",
        "measure",
        "integrate",
      ]),
      title: "The platform",
      summary:
        "Architect, build, approve, govern, audit, integrate, operate, and measure — in one place.",
      factsJson: JSON.stringify([
        "Build — design the configuration with us, against your existing systems.",
        "Approve — every agent operates under an approval queue.",
        "Govern — the policy layer enforces the rules.",
        "Audit — append-only logs of every input, output, and decision.",
        "Integrate — connects to the systems you already use.",
        "Operate — we run the runtime, monitor the agents, improve the configurations.",
        "Measure — weekly report and approval queue.",
      ]),
      linksJson: JSON.stringify([{ label: "Platform", href: "/platform" }]),
    },
    {
      topicId: "engagement",
      keywordsJson: JSON.stringify([
        "engagement",
        "how",
        "work",
        "process",
        "step",
        "stages",
        "discovery",
        "production",
      ]),
      title: "How an engagement works",
      summary: "Four steps. Running in production by week four.",
      factsJson: JSON.stringify([
        "Discovery — we learn the work, your systems, your governance.",
        "Architect and build — we design the agent and build it against your systems.",
        "Review — your team reviews drafts. We tune the configuration from what your team edits.",
        "Run and improve — we operate the agent and monitor the queue.",
      ]),
      linksJson: JSON.stringify([{ label: "How it works", href: "/#engagement" }]),
    },
    {
      topicId: "use-cases",
      keywordsJson: JSON.stringify([
        "use",
        "case",
        "where",
        "support",
        "sales",
        "operations",
        "analytics",
        "finance",
        "marketing",
      ]),
      title: "Use cases",
      summary:
        "Six functions. Each agent scoped to the work, governed by your rules.",
      factsJson: JSON.stringify([
        "Support — triage inbound, draft replies for team approval.",
        "Sales — personalized follow-ups after demos, matched to your voice.",
        "Operations — reorder low-stock SKUs, route approvals, clean inboxes.",
        "Analytics — weekly pipeline summaries, risk callouts, board notes.",
        "Finance — reconcile invoices, flag anomalies, draft approvals.",
        "Marketing — newsletter drafts, subject-line tests, scheduling.",
      ]),
      linksJson: JSON.stringify([{ label: "Use cases", href: "/#use-cases" }]),
    },
  ];

  for (const t of cliTopics) {
    await prisma.cliTopic.upsert({
      where: { topicId: t.topicId },
      update: t,
      create: t,
    });
  }
  console.log(`✓ Seeded ${cliTopics.length} CLI knowledge topics`);

  // 6. Seed Sample Inbound Leads
  const initialLeads = [
    {
      name: "Marcus Vance",
      email: "mvance@palisade-capital.example.com",
      organization: "Palisade Capital",
      engagementTier: "embedded",
      message:
        "We want to deploy an autonomous underwriting review agent against our internal deal flow memos and Bloomberg feeds. Need private VPC deployment and strict compliance logging.",
      status: "new",
      notes: "High priority enterprise lead. Schedule discovery call with senior FDE.",
    },
    {
      name: "Elena Rostova",
      email: "elena@vanguard-logistics.example.com",
      organization: "Vanguard Global Freight",
      engagementTier: "scaled",
      message:
        "Evaluating AI ops triage for custom clearance documentation and automated exception routing across 12 port hubs.",
      status: "in_review",
      notes: "Followed up via email regarding SOC2 compliance requirements.",
    },
    {
      name: "Julian Thorne",
      email: "julian@apexhealth.example.com",
      organization: "Apex Health Informatics",
      engagementTier: "foundation",
      message:
        "Looking for a 2-week diagnosis sprint to evaluate agent feasibility on our claims intake queue.",
      status: "contacted",
      notes: "Discovery call scheduled for Thursday 2 PM EST.",
    },
  ];

  for (const l of initialLeads) {
    const existing = await prisma.leadSubmission.findFirst({
      where: { email: l.email },
    });
    if (!existing) {
      await prisma.leadSubmission.create({ data: l });
    }
  }
  console.log(`✓ Seeded sample inbound leads`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
