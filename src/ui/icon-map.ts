import type { LucideIcon } from 'lucide-react';
import {
  AlignLeft, Braces, Calendar, Clock, Cookie, Database, Dices,
  FileText, Fingerprint, Globe, Hash, Key, Layers, List,
  Network, ScrollText, Shuffle, SquareCode, Tags,
} from 'lucide-react';
import type { CategoryId } from '@/tools/registry/types';

/**
 * 注册中心 icon 字符串 → Lucide 图标映射（DESIGN.md §2.9 统一线性图标体系）。
 * 未知 icon 回退到 AlignLeft，保证渲染层不崩溃。
 */
const TOOL_ICON_MAP: Record<string, LucideIcon> = {
  clock: Clock,
  code: SquareCode,
  braces: Braces,
  diff: Layers,
  cookie: Cookie,
  file: FileText,
  hash: Hash,
  header: ScrollText,
  key: Key,
  list: List,
  lock: Fingerprint,
  calendar: Calendar,
  calculator: Dices,
  shuffle: Shuffle,
  database: Database,
  globe: Globe,
  link: Network,
  search: Tags,
};

/** 六个主分类图标（与 DESIGN.md §5.7 分类体系对应） */
export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  data: Braces,
  datetime: Calendar,
  encoding: Tags,
  generator: Dices,
  http: Network,
  text: AlignLeft,
};

export function toolIcon(icon: string): LucideIcon {
  return TOOL_ICON_MAP[icon] ?? AlignLeft;
}
