export interface PlatformModuleField {
  label: string;
  value: string;
  chip?: string;
}

export interface PlatformModuleEntity {
  id: string;
  key: string;
  eyebrow: string;
  title: string;
  bodyText: string;
  bulletsJson: string;
  mockCardTitle?: string | null;
  mockCardUrl: string;
  mockFieldsJson: string;
  orderIndex: number;
  isPublished: boolean;
  updatedAt: Date;
}

export interface PlatformModuleFormData {
  eyebrow: string;
  title: string;
  bodyText: string;
  bullets: string[];
  mockCardTitle?: string;
  mockCardUrl: string;
  mockFields: PlatformModuleField[];
  isPublished?: boolean;
}
