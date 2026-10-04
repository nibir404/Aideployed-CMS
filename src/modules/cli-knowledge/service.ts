import prisma from "@/core/db/prisma";
import type { CliTopicEntity, CliTopicInput, SimulationResult } from "./types";

export async function getCliTopics(): Promise<CliTopicEntity[]> {
  return await prisma.cliTopic.findMany({
    orderBy: { topicId: "asc" },
  });
}

export async function getCliTopicById(topicId: string): Promise<CliTopicEntity | null> {
  return await prisma.cliTopic.findUnique({
    where: { topicId },
  });
}

export async function createCliTopic(input: CliTopicInput): Promise<CliTopicEntity> {
  return await prisma.cliTopic.create({
    data: {
      topicId: input.topicId.toLowerCase().replace(/\s+/g, "-"),
      title: input.title,
      summary: input.summary,
      keywordsJson: JSON.stringify(input.keywords),
      factsJson: JSON.stringify(input.facts),
      linksJson: input.links ? JSON.stringify(input.links) : null,
    },
  });
}

export async function updateCliTopic(
  topicId: string,
  input: Partial<CliTopicInput>
): Promise<CliTopicEntity> {
  const updatePayload: Record<string, unknown> = {};

  if (input.title !== undefined) updatePayload.title = input.title;
  if (input.summary !== undefined) updatePayload.summary = input.summary;
  if (input.keywords !== undefined) updatePayload.keywordsJson = JSON.stringify(input.keywords);
  if (input.facts !== undefined) updatePayload.factsJson = JSON.stringify(input.facts);
  if (input.links !== undefined) updatePayload.linksJson = JSON.stringify(input.links);

  updatePayload.updatedAt = new Date();

  return await prisma.cliTopic.update({
    where: { topicId },
    data: updatePayload,
  });
}

export async function deleteCliTopic(topicId: string): Promise<CliTopicEntity> {
  return await prisma.cliTopic.delete({
    where: { topicId },
  });
}

// -----------------------------------------------------------------------------
// Interactive Simulator Logic matching Ai-deployed's Cli.tsx
// -----------------------------------------------------------------------------

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export async function simulateCliQuery(query: string): Promise<SimulationResult> {
  const tokens = tokenize(query);
  const topics = await getCliTopics();

  if (tokens.length === 0) {
    return {
      matchedTopic: null,
      score: 0,
      composedOutput: "Please enter a valid query.",
      query,
      tokens: [],
    };
  }

  let best: { topic: CliTopicInput; score: number } | null = null;

  for (const raw of topics) {
    const keywords: string[] = JSON.parse(raw.keywordsJson || "[]");
    const facts: string[] = JSON.parse(raw.factsJson || "[]");
    const links = raw.linksJson ? JSON.parse(raw.linksJson) : [];

    const topicItem: CliTopicInput = {
      topicId: raw.topicId,
      title: raw.title,
      summary: raw.summary,
      keywords,
      facts,
      links,
    };

    let score = 0;
    for (const kw of keywords) {
      const kwt = kw.toLowerCase();
      if (kwt.includes(" ")) {
        if (query.toLowerCase().includes(kwt)) score += 2;
      } else {
        if (tokens.includes(kwt)) score += 2;
      }
    }

    const titleWords = tokenize(raw.title);
    for (const w of titleWords) {
      if (w.length > 2 && tokens.includes(w)) score += 1;
    }

    if (tokens.includes("how") && tokens.includes("much")) score += 6;
    if (tokens.includes("how") && tokens.includes("long")) score += 6;
    if (tokens.includes("what") && tokens.includes("is")) score += 4;
    if (tokens.includes("who") && tokens.includes("are")) score += 4;

    if (!best || score > best.score) {
      best = { topic: topicItem, score };
    }
  }

  if (!best || best.score === 0) {
    return {
      matchedTopic: null,
      score: 0,
      composedOutput: composeFallback(query),
      query,
      tokens,
    };
  }

  return {
    matchedTopic: best.topic,
    score: best.score,
    composedOutput: composeAnswer(best.topic),
    query,
    tokens,
  };
}

function composeAnswer(topic: CliTopicInput): string {
  const lines: string[] = [];
  lines.push(`> ${topic.title}`);
  lines.push("");
  lines.push(topic.summary);
  lines.push("");
  lines.push("—");
  for (const f of topic.facts) {
    lines.push(`· ${f}`);
  }
  if (topic.links && topic.links.length > 0) {
    lines.push("");
    lines.push("—");
    for (const l of topic.links) {
      lines.push(`↳ ${l.label}  ${l.href}`);
    }
  }
  lines.push("");
  lines.push("Anything else? Try: platform, governance, engagement.");
  return lines.join("\n");
}

function composeFallback(query: string): string {
  return [
    `> no match`,
    ``,
    `I couldn't find a topic matching "${query}".`,
    ``,
    `Try one of these:`,
    `· "what does AI Deployed do"`,
    `· "how does governance work"`,
    `· "where do agents run"`,
    `· "how does an engagement start"`,
    ``,
    `Or reach out directly:`,
    `↳ Book consultation  /contact`,
    ``,
    `Tip: keywords like "platform", "governance", "engagement", "FDE", "queue", "audit", and "FAQ" all map to specific topics.`,
  ].join("\n");
}
