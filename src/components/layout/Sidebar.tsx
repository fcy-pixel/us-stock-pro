import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Newspaper, TrendingUp, Star, Briefcase,
  Cpu, Menu, X, Activity
} from 'lucide-react'
import { useAppStore } from '../../store'
import { cn } from '../../utils/formatters'

const NAV = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/news', label: 'News & Signals', icon: Newspaper },
  { path: '/stocks', label: 'Stock Screener', icon: TrendingUp },
  { path: '/watchlist', label: 'Watchlist', icon: Star },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { path: '/ai-picks', label: 'AI Picks', icon: Cpu },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const { sidebarOpen, toggleSidebar } = useAppStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-300',
        'bg-bg-secondary border-r border-white/5',
        sidebarOpen ? 'w-60' : 'w-0 lg:w-16 overflow-hidden'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center shrink-0">
            <Activity size={18} className="text-accent-blue" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-white tracking-tight whitespace-nowrap">StockPro</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {NAV.map(({ path, label, icon: Icon }) => {
            const active = pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-accent-blue/15 text-accent-blue'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
                {active && sidebarOpen && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-blue" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center h-10 w-full border-t border-white/5 text-gray-500 hover:text-white transition-colors"
        >
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </aside>
    </>
  )
}
