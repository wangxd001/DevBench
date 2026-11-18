import { useTranslation } from 'react-i18next';
import { House, LayoutGrid, Star, Timer, ShieldCheck } from 'lucide-react';
import { NavItem } from '@/components/navigation/NavItem';
import { DevBenchLogo } from '@/ui/DevBenchLogo';

const navItems = [
  { to: '/', labelKey: 'nav.home', icon: House },
  { to: '/tools', labelKey: 'nav.tools', icon: LayoutGrid },
  { to: '/favorites', labelKey: 'nav.favorites', icon: Star },
  { to: '/recent', labelKey: 'nav.recent', icon: Timer },
  { to: '/privacy', labelKey: 'nav.privacy', icon: ShieldCheck },
];

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex shrink-0 items-center gap-2.5 p-4">
        <DevBenchLogo
          className="h-7 w-7 shrink-0"
          aria-label={t('brand.logoAria')}
        />
        <span className="text-lg font-semibold text-primary">DevBench</span>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto p-2" aria-label={t('nav.ariaLabel')}>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavItem to={item.to} label={t(item.labelKey)} icon={item.icon} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
