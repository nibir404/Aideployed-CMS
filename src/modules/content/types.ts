export interface PageEntity {
  id: string;
  slug: string;
  title: string;
  seoTitle?: string | null;
  seoDesc?: string | null;
  ogImage?: string | null;
  isPublished: boolean;
  updatedAt: Date;
  sections?: SectionEntity[];
}

export interface SectionEntity {
  id: string;
  pageId: string;
  sectionKey: string;
  title?: string | null;
  contentJson: string;
  orderIndex: number;
  isPublished: boolean;
  updatedAt: Date;
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  headlineHighlight: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  asciiGridEnabled: boolean;
}

export interface WhyFdeContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  pillars: Array<{ title: string; desc: string }>;
  steps: Array<{ title: string; desc: string }>;
  bottomTagline: string;
}

export interface DemoContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  phases: Array<{
    phase: number;
    title: string;
    progress: number;
    headline: string;
    desc: string;
    deliverable: string;
    version: string;
  }>;
  workQueue: Array<{
    label: string;
    status: string;
    statusType: string;
  }>;
}

export interface CapabilityGridContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  peopleCards: Array<{ title: string; desc: string; icon: string }>;
  stackCards: Array<{ title: string; desc: string; icon: string }>;
}

export interface UseCasesContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  description: string;
  cases: Array<{ title: string; desc: string }>;
}

export interface DifferentiatorsContent {
  eyebrow: string;
  title: string;
  items: Array<{ num: string; title: string; desc: string }>;
}

export interface EngagementStepsContent {
  eyebrow: string;
  title: string;
  description: string;
  steps: Array<{ num: string; title: string; desc: string; badge: string }>;
}

export interface CommitmentsContent {
  eyebrow: string;
  title: string;
  items: Array<{ title: string; desc: string }>;
}

export interface FinalCtaContent {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
}
