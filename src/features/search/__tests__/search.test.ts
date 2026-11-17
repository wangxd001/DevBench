import { describe, it, expect } from 'vitest';
import { searchTools } from '../search';
import type { ToolDefinition } from '@/tools/registry/types';

type ToolComponent = ToolDefinition['component'];
const mockComponent = (() => null) as unknown as ToolComponent;

const mockTools: ToolDefinition[] = [
  {
    id: 'json-formatter',
    name: { 'zh-CN': 'JSON 格式化与校验', 'en-US': 'JSON Formatter & Validator' },
    description: { 'zh-CN': '格式化、压缩和校验 JSON', 'en-US': 'Format, minify and validate JSON' },
    categoryId: 'data',
    tags: ['json', 'validation'],
    keywords: { 'zh-CN': ['json', '格式化', '校验'], 'en-US': ['json', 'format', 'validate'] },
    icon: 'braces',
    route: '/tools/json-formatter',
    component: mockComponent,
    recommended: true,
    relatedTools: [],
  },
  {
    id: 'timestamp-converter',
    name: { 'zh-CN': '时间戳转换器', 'en-US': 'Timestamp Converter' },
    description: { 'zh-CN': '时间戳与日期时间互转', 'en-US': 'Convert between timestamps and dates' },
    categoryId: 'datetime',
    tags: ['datetime', 'conversion'],
    keywords: { 'zh-CN': ['时间戳', '转换', '日期'], 'en-US': ['timestamp', 'convert', 'date'] },
    icon: 'clock',
    route: '/tools/timestamp-converter',
    component: mockComponent,
    recommended: true,
    relatedTools: [],
  },
  {
    id: 'uuid-generator',
    name: { 'zh-CN': 'UUID 生成器', 'en-US': 'UUID Generator' },
    description: { 'zh-CN': '生成 UUID v4 格式的标识符', 'en-US': 'Generate UUID v4 identifiers' },
    categoryId: 'generator',
    tags: ['generation'],
    keywords: { 'zh-CN': ['uuid', '生成', '标识符'], 'en-US': ['uuid', 'generate', 'identifier'] },
    icon: 'hash',
    route: '/tools/uuid-generator',
    component: mockComponent,
    recommended: true,
    relatedTools: [],
  },
];

describe('searchTools', () => {
  it('returns empty array for empty query', () => {
    expect(searchTools('', mockTools)).toEqual([]);
    expect(searchTools('   ', mockTools)).toEqual([]);
  });

  it('matches Chinese name', () => {
    const results = searchTools('json', mockTools);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].tool.id).toBe('json-formatter');
  });

  it('matches English name case-insensitively', () => {
    const results = searchTools('uuid', mockTools);
    expect(results.length).toBe(1);
    expect(results[0].tool.id).toBe('uuid-generator');
  });

  it('matches Chinese keywords', () => {
    const results = searchTools('时间戳', mockTools);
    expect(results.length).toBe(1);
    expect(results[0].tool.id).toBe('timestamp-converter');
  });

  it('matches English keywords', () => {
    const results = searchTools('timestamp', mockTools);
    expect(results.length).toBe(1);
    expect(results[0].tool.id).toBe('timestamp-converter');
  });

  it('matches by description', () => {
    const results = searchTools('格式化', mockTools);
    expect(results.some((r) => r.tool.id === 'json-formatter')).toBe(true);
  });

  it('matches by tag', () => {
    const results = searchTools('json', mockTools);
    expect(results.some((r) => r.tool.id === 'json-formatter')).toBe(true);
  });

  it('ranks name matches above description matches', () => {
    const results = searchTools('json', mockTools);
    // json-formatter has name + tag + keyword matches, should rank first
    expect(results[0].tool.id).toBe('json-formatter');
  });

  it('returns empty for no match', () => {
    expect(searchTools('nonexistenttool', mockTools)).toEqual([]);
  });
});
