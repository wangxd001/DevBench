import { NavItem } from '@/components/navigation/NavItem';

const navItems = [
  { to: '/', label: '首页' },
  { to: '/tools', label: '工具目录' },
  { to: '/favorites', label: '收藏' },
  { to: '/recent', label: '最近使用' },
  { to: '/privacy', label: '隐私与安全' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="p-4">
        <span className="text-lg font-semibold text-primary">DevBench</span>
      </div>
      <nav className="flex-1 p-2" aria-label="主导航">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavItem to={item.to} label={item.label} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
