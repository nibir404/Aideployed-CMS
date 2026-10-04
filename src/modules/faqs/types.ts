export interface FaqEntity {
  id: string;
  question: string;
  answerHtml: string;
  category: string;
  orderIndex: number;
  isPublished: boolean;
  updatedAt: Date;
}

export interface FaqInput {
  question: string;
  answerHtml: string;
  category?: string;
  orderIndex?: number;
  isPublished?: boolean;
}
