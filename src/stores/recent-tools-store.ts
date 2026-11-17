import { create } from 'zustand';
import type { ToolId } from '@/tools/registry/types';

const STORAGE_KEY = 'devbench.recent';
const MAX_RECENT = 10;

interface RecentEntry {
  toolId: ToolId;
  lastUsedAt: number;
}

interface RecentToolsState {
  recent: RecentEntry[];
  addRecent: (toolId: ToolId) => void;
  clearRecent: () => void;
}

function loadRecent(): RecentEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((e) => e && typeof e.toolId === 'string' && typeof e.lastUsedAt === 'number');
    }
    return [];
  } catch {
    return [];
  }
}

function saveRecent(recent: RecentEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  } catch {
    // 写入失败不影响核心功能
  }
}

export const useRecentToolsStore = create<RecentToolsState>((set, get) => ({
  recent: loadRecent(),
  addRecent: (toolId) => {
    const s = get();
    const filtered = s.recent.filter((r) => r.toolId !== toolId);
    const recent = [{ toolId, lastUsedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT);
    set({ recent });
    saveRecent(recent);
  },
  clearRecent: () => {
    set({ recent: [] });
    saveRecent([]);
  },
}));
