import type { ToolId, CategoryId } from './types';

export const TOOL_IDS: readonly ToolId[] = [
  'json-formatter', 'timestamp-converter', 'uuid-generator',
  'base64-converter', 'url-encoder', 'hash-generator',
  'jwt-decoder', 'http-header-parser', 'json-diff',
  'regex-tester', 'datetime-formatter', 'date-calculator',
  'random-string-generator', 'test-data-generator',
  'unicode-converter', 'html-entity-converter',
  'json-yaml-converter', 'http-cookie-parser',
  'http-status-codes', 'text-diff',
];

export const CATEGORY_IDS: readonly CategoryId[] = [
  'data', 'datetime', 'encoding', 'generator', 'http', 'text',
];

export const TAG_IDS: readonly string[] = [
  'json', 'yaml', 'encoding', 'decoding', 'conversion', 'datetime',
  'generation', 'hash', 'http', 'security', 'text', 'comparison',
  'regex', 'testing', 'validation', 'unicode', 'web',
];
