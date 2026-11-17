import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/features/home';
import { ToolsPage } from '@/features/tools';
import { ToolDetail } from '@/features/tools/ToolDetail';
import { FavoritesPage } from '@/features/favorites';
import { RecentPage } from '@/features/recent';
import { PrivacyPage } from '@/features/privacy';
import { NotFoundPage } from '@/features/not-found';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tools/:toolId" element={<ToolDetail />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/recent" element={<RecentPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
