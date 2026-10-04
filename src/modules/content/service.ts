import prisma from "@/core/db/prisma";
import type { PageEntity, SectionEntity } from "./types";

export async function getPages(): Promise<PageEntity[]> {
  return await prisma.page.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });
}

export async function getPageBySlug(slug: string): Promise<PageEntity | null> {
  return await prisma.page.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });
}

export async function getSections(pageSlug: string): Promise<SectionEntity[]> {
  const page = await prisma.page.findUnique({
    where: { slug: pageSlug },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  return page?.sections ?? [];
}

export async function getSection(pageSlug: string, sectionKey: string): Promise<SectionEntity | null> {
  const page = await prisma.page.findUnique({
    where: { slug: pageSlug },
  });

  if (!page) return null;

  return await prisma.section.findUnique({
    where: {
      pageId_sectionKey: {
        pageId: page.id,
        sectionKey,
      },
    },
  });
}

export async function updateSection(
  pageSlug: string,
  sectionKey: string,
  content: unknown
): Promise<SectionEntity> {
  const page = await prisma.page.findUnique({
    where: { slug: pageSlug },
  });

  if (!page) {
    throw new Error(`Page with slug "${pageSlug}" not found`);
  }

  const contentJson = typeof content === "string" ? content : JSON.stringify(content);

  return await prisma.section.update({
    where: {
      pageId_sectionKey: {
        pageId: page.id,
        sectionKey,
      },
    },
    data: {
      contentJson,
      updatedAt: new Date(),
    },
  });
}

export async function updatePageMetadata(
  slug: string,
  data: {
    title?: string;
    seoTitle?: string;
    seoDesc?: string;
    ogImage?: string;
    isPublished?: boolean;
  }
) {
  return await prisma.page.update({
    where: { slug },
    data,
  });
}
