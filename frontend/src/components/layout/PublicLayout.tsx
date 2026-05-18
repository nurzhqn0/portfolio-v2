import { Outlet, NavLink } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="min-h-screen text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <NavLink to="/" className="font-display text-2xl italic tracking-wide text-clay transition-colors duration-300 hover:text-brand-navy">
            nurzhqn0
          </NavLink>
          <div className="flex items-center gap-6 text-sm font-medium text-graphite">
            <NavLink className={({ isActive }) => (isActive ? 'text-ink' : 'transition-colors hover:text-clay')} to="/projects">
              Projects
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'text-ink' : 'transition-colors hover:text-clay')} to="/contacts">
              Contacts
            </NavLink>
            <NavLink className={({ isActive }) => (isActive ? 'text-ink' : 'transition-colors hover:text-clay')} to="/admin">
              Admin
            </NavLink>
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
