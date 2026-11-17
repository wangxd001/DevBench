import type { ToolDefinition } from '@/tools/registry/types';

export interface ToolSearchResult {
  tool: ToolDefinition;
  score: number;
}

const WEIGHTS = {
  name: 3,
  keyword: 2,
  description: 1,
  tag: 1,
} as const;

export function searchTools(
  query: string,
  tools: ToolDefinition[]
): ToolSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: ToolSearchResult[] = [];

  for (const tool of tools) {
    let score = 0;

    // name match (both locales)
    if (
      tool.name['zh-CN'].toLowerCase().includes(q) ||
      tool.name['en-US'].toLowerCase().includes(q)
    ) {
      score += WEIGHTS.name;
    }

    // keyword match (both locales)
    for (const kw of tool.keywords['zh-CN']) {
      if (kw.toLowerCase().includes(q)) {
        score += WEIGHTS.keyword;
        break;
      }
    }
    for (const kw of tool.keywords['en-US']) {
      if (kw.toLowerCase().includes(q)) {
        score += WEIGHTS.keyword;
        break;
      }
    }

    // description match
    if (
      tool.description['zh-CN'].toLowerCase().includes(q) ||
      tool.description['en-US'].toLowerCase().includes(q)
    ) {
      score += WEIGHTS.description;
    }

    // tag match
    if (tool.tags.some((t) => t.toLowerCase().includes(q))) {
      score += WEIGHTS.tag;
    }

    if (score > 0) {
      results.push({ tool, score });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
