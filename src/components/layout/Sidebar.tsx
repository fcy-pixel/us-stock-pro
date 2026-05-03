import { Newspaper, Activity } from 'lucide-react'
import { useAppStore } from '../../store'
import { cn } from '../../utils/formatters'

export default function Sidebar() {
  const { sidebarOpen } = useAppStore()

  return (
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
          <span className="font-bold text-white tracking-tight whitespace-nowrap">新聞Pro</span>
        )}
      </div>

      {/* Active page indicator */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-accent-blue/15 text-accent-blue">
          <Newspaper size={18} className="shrink-0" />
          {sidebarOpen && <span className="whitespace-nowrap">AI 新聞摘要</span>}
        </div>
      </nav>
    </aside>
  )
}
