import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Landmark, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { NAV_ITEMS } from '../navigation'
import { useSearchState } from '../hooks/useTopbarSearch'
import { useTheme } from '../hooks/useTheme'
import { API_URL } from '../services'
import { cx } from '../lib/cx'

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-accent text-navy">
        <Landmark className="h-5 w-5" aria-hidden />
      </div>
      <span className="font-serif text-lg font-semibold leading-tight text-white">Controle Acadêmico</span>
    </div>
  )
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-navy/60 lg:hidden" onClick={onClose} aria-hidden />}
      <aside
        id="sidebar"
        aria-label="Navegação principal"
        className={cx(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Brand />
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onClose}
            className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cx(
                      'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <span className="absolute inset-y-2 left-0 w-0.5 rounded bg-navy-accent" aria-hidden />}
                      <Icon className="h-5 w-5 shrink-0" aria-hidden />
                      {label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-5 py-4 text-xs text-white/60">
          <p>API</p>
          <p className="mt-0.5 break-all text-white/80">{API_URL}</p>
        </div>
      </aside>
    </>
  )
}

function Topbar({ title, onMenu }: { title: string; onMenu: () => void }) {
  const { query, setQuery, placeholder } = useSearchState()
  const { dark, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Abrir menu"
          aria-controls="sidebar"
          onClick={onMenu}
          className="-ml-1.5 rounded-md p-1.5 text-muted hover:bg-canvas hover:text-ink lg:hidden"
        >
          <Menu className="h-6 w-6" aria-hidden />
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-navy text-navy-accent lg:hidden" title="Controle Acadêmico">
          <Landmark className="h-4 w-4" aria-hidden />
        </div>

        <h1 className="min-w-0 truncate font-serif text-xl font-semibold text-ink sm:text-2xl">{title}</h1>

        <div className="ml-auto flex items-center gap-2 sm:order-last">
          <button
            type="button"
            onClick={toggle}
            aria-label={dark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            title={dark ? 'Tema claro' : 'Tema escuro'}
            className="rounded-md p-2 text-muted hover:bg-canvas hover:text-ink"
          >
            {dark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
          </button>
        </div>

        {placeholder && (
          <div className="relative order-last w-full sm:order-none sm:ml-auto sm:max-w-sm sm:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
              className="h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-3 text-sm text-ink placeholder:text-muted/80 focus:border-brand focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand/25"
            />
          </div>
        )}
      </div>
    </header>
  )
}

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const current = NAV_ITEMS.find((n) => (n.path === '/' ? pathname === '/' : pathname.startsWith(n.path)))
  const title = current?.title ?? 'Página não encontrada'

  useEffect(() => {
    document.title = `${title} — Controle Acadêmico`
    setMenuOpen(false)
  }, [title, pathname])

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <Topbar title={title} onMenu={() => setMenuOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
