import prisma from "@/core/db/prisma";
import type { PlatformModuleEntity, PlatformModuleFormData } from "./types";

export async function getPlatformModules(): Promise<PlatformModuleEntity[]> {
  return await prisma.platformModule.findMany({
    orderBy: { orderIndex: "asc" },
  });
}

export async function getPlatformModuleByKey(key: string): Promise<PlatformModuleEntity | null> {
  return await prisma.platformModule.findUnique({
    where: { key },
  });
}

export async function updatePlatformModule(
  key: string,
  data: Partial<PlatformModuleFormData>
): Promise<PlatformModuleEntity> {
  const updatePayload: Record<string, unknown> = {};

  if (data.eyebrow !== undefined) updatePayload.eyebrow = data.eyebrow;
  if (data.title !== undefined) updatePayload.title = data.title;
  if (data.bodyText !== undefined) updatePayload.bodyText = data.bodyText;
  if (data.mockCardTitle !== undefined) updatePayload.mockCardTitle = data.mockCardTitle;
  if (data.mockCardUrl !== undefined) updatePayload.mockCardUrl = data.mockCardUrl;
  if (data.isPublished !== undefined) updatePayload.isPublished = data.isPublished;

  if (data.bullets !== undefined) {
    updatePayload.bulletsJson = JSON.stringify(data.bullets);
  }

  if (data.mockFields !== undefined) {
    updatePayload.mockFieldsJson = JSON.stringify(data.mockFields);
  }

  updatePayload.updatedAt = new Date();

  return await prisma.platformModule.update({
    where: { key },
    data: updatePayload,
  });
}

export async function reorderPlatformModules(keysInOrder: string[]) {
  const operations = keysInOrder.map((key, index) =>
    prisma.platformModule.update({
      where: { key },
      data: { orderIndex: index },
    })
  );

  return await prisma.$transaction(operations);
}
