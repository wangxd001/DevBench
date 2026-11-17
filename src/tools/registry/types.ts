import type { LocalizedText, LocalizedKeywords } from '@/types';
import type { ComponentType, LazyExoticComponent } from 'react';

export type ToolId =
  | 'json-formatter' | 'timestamp-converter' | 'uuid-generator'
  | 'base64-converter' | 'url-encoder' | 'hash-generator'
  | 'jwt-decoder' | 'http-header-parser' | 'json-diff'
  | 'regex-tester' | 'datetime-formatter' | 'date-calculator'
  | 'random-string-generator' | 'test-data-generator'
  | 'unicode-converter' | 'html-entity-converter'
  | 'json-yaml-converter' | 'http-cookie-parser'
  | 'http-status-codes' | 'text-diff';

export type CategoryId = 'data' | 'datetime' | 'encoding' | 'generator' | 'http' | 'text';

export interface ToolCategory {
  id: CategoryId;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  order: number;
}

export interface ToolTag {
  id: string;
  name: LocalizedText;
}

export interface ToolDefinition {
  id: ToolId;
  name: LocalizedText;
  description: LocalizedText;
  categoryId: CategoryId;
  tags: string[];
  keywords: LocalizedKeywords;
  icon: string;
  route: string;
  component: LazyExoticComponent<ComponentType>;
  recommended: boolean;
  relatedTools: ToolId[];
}

export interface RegistryValidationResult {
  valid: boolean;
  errors: string[];
}
