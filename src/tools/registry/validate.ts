import { CATEGORY_IDS, TAG_IDS } from './constants';
import type { ToolDefinition, RegistryValidationResult } from './types';

export function validateRegistry(tools: ToolDefinition[]): RegistryValidationResult {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenRoutes = new Set<string>();
  const allToolIds = new Set(tools.map((t) => t.id));

  for (const tool of tools) {
    if (seenIds.has(tool.id)) errors.push(`工具 ID 重复：${tool.id}`);
    seenIds.add(tool.id);

    if (seenRoutes.has(tool.route)) errors.push(`路由重复：${tool.route}`);
    seenRoutes.add(tool.route);

    if (!CATEGORY_IDS.includes(tool.categoryId)) {
      errors.push(`工具 ${tool.id} 的分类 "${tool.categoryId}" 不存在`);
    }

    for (const tag of tool.tags) {
      if (!TAG_IDS.includes(tag)) {
        errors.push(`工具 ${tool.id} 的标签 "${tag}" 不存在`);
      }
    }

    if (typeof tool.recommended !== 'boolean') {
      errors.push(`工具 ${tool.id} 的 recommended 不是布尔值`);
    }

    const related = tool.relatedTools;
    if (related.length < 2 || related.length > 4) {
      errors.push(`工具 ${tool.id} 的 relatedTools 数量 ${related.length} 不在 2-4 范围内`);
    }
    if (related.includes(tool.id)) {
      errors.push(`工具 ${tool.id} 的 relatedTools 包含自身`);
    }
    if (new Set(related).size !== related.length) {
      errors.push(`工具 ${tool.id} 的 relatedTools 有重复`);
    }
    for (const r of related) {
      if (!allToolIds.has(r)) {
        errors.push(`工具 ${tool.id} 的 relatedTools 引用了不存在的工具 "${r}"`);
      }
    }

    if (!tool.name['zh-CN'] || !tool.name['en-US']) {
      errors.push(`工具 ${tool.id} 的中英文名称不完整`);
    }
    if (!tool.description['zh-CN'] || !tool.description['en-US']) {
      errors.push(`工具 ${tool.id} 的中英文描述不完整`);
    }
  }

  return { valid: errors.length === 0, errors };
}
