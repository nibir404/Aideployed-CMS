import prisma from "@/core/db/prisma";
import type { FaqEntity, FaqInput } from "./types";

export async function getFaqs(publishedOnly = false): Promise<FaqEntity[]> {
  return await prisma.faqItem.findMany({
    where: publishedOnly ? { isPublished: true } : undefined,
    orderBy: { orderIndex: "asc" },
  });
}

export async function getFaqById(id: string): Promise<FaqEntity | null> {
  return await prisma.faqItem.findUnique({
    where: { id },
  });
}

export async function createFaq(data: FaqInput): Promise<FaqEntity> {
  // If orderIndex not provided, put at the end
  let orderIndex = data.orderIndex;
  if (orderIndex === undefined) {
    const count = await prisma.faqItem.count();
    orderIndex = count;
  }

  return await prisma.faqItem.create({
    data: {
      question: data.question,
      answerHtml: data.answerHtml,
      category: data.category || "general",
      orderIndex,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
    },
  });
}

export async function updateFaq(id: string, data: Partial<FaqInput>): Promise<FaqEntity> {
  return await prisma.faqItem.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}

export async function deleteFaq(id: string): Promise<FaqEntity> {
  return await prisma.faqItem.delete({
    where: { id },
  });
}

export async function reorderFaqs(orderedIds: string[]): Promise<void> {
  const operations = orderedIds.map((id, index) =>
    prisma.faqItem.update({
      where: { id },
      data: { orderIndex: index },
    })
  );

  await prisma.$transaction(operations);
}
