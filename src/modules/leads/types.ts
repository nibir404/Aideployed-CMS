export type EngagementTier = "foundation" | "embedded" | "scaled" | "unsure";
export type LeadStatus = "new" | "in_review" | "contacted" | "closed";

export interface LeadEntity {
  id: string;
  name: string;
  email: string;
  organization?: string | null;
  engagementTier: string;
  message: string;
  status: string;
  notes?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  organization?: string;
  engagementTier: EngagementTier | string;
  message: string;
  honeypot?: string; // Bot protection
  ipAddress?: string;
}

export interface LeadFilter {
  status?: LeadStatus | string;
  engagementTier?: EngagementTier | string;
  search?: string;
}
