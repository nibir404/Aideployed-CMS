export interface CliTopicEntity {
  id: string;
  topicId: string;
  keywordsJson: string;
  title: string;
  summary: string;
  factsJson: string;
  linksJson?: string | null;
  updatedAt: Date;
}

export interface CliTopicInput {
  topicId: string;
  keywords: string[];
  title: string;
  summary: string;
  facts: string[];
  links?: Array<{ label: string; href: string }>;
}

export interface SimulationResult {
  matchedTopic: CliTopicInput | null;
  score: number;
  composedOutput: string;
  query: string;
  tokens: string[];
}
