import { NavLink } from 'react-router-dom';

interface NavItemProps {
  to: string;
  label: string;
}

export function NavItem({ to, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
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
      {({ isActive }) => (
        <>
          {isActive && <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-primary" />}
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
