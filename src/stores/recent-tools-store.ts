import { create } from 'zustand';
import type { ToolId } from '@/tools/registry/types';

interface RecentToolsState {
  recent: { toolId: ToolId; lastUsedAt: number }[];
  addRecent: (toolId: ToolId) => void;
  clearRecent: () => void;
}

const MAX_RECENT = 10;

export const useRecentToolsStore = create<RecentToolsState>((set) => ({
  recent: [],
  addRecent: (toolId) =>
    set((s) => {
      const filtered = s.recent.filter((r) => r.toolId !== toolId);
      return {
        recent: [{ toolId, lastUsedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT),
      };
    }),
  clearRecent: () => set({ recent: [] }),
}));
