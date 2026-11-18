import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface NavItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
}

export function NavItem({ to, label, icon: Icon }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      title={label}
      className={({ isActive }) =>
        [
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
          isActive
            ? 'bg-primary-soft font-medium text-primary'
            : 'text-text-secondary hover:bg-surface-muted',
        ].join(' ')
      }
      style={{ outline: 'none' }}
    >
      {() => (
        <>
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
