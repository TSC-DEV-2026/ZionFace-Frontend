import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Activity, UserPlus, ShieldCheck, LayoutDashboard } from 'lucide-react'
import clsx from 'clsx'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/enroll', label: 'Cadastro', icon: UserPlus },
  { to: '/verify', label: 'Verificar', icon: ShieldCheck },
  { to: '/identify', label: 'Identificar', icon: Activity },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-border shadow-card' : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-accent-glow border border-accent/30 group-hover:border-accent/60 transition-all" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-accent text-xs font-mono font-bold">F</span>
            </div>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Face<span className="text-accent">ID</span>
          </span>
        </NavLink>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200',
                  isActive
                    ? 'bg-accent-glow text-accent border border-accent/20'
                    : 'text-subtle hover:text-text hover:bg-border/50'
                )
              }
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          <Activity className="w-3.5 h-3.5" />
          <span className="hidden sm:block">API</span>
        </div>
      </div>
    </header>
  )
}
