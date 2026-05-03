import { Menu, Activity } from 'lucide-react'
import { useAppStore } from '../../store'

export default function Header() {
  const { toggleSidebar } = useAppStore()

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-16 z-20 h-16 bg-bg-primary/90 backdrop-blur border-b border-white/5 flex items-center gap-4 px-4">
      {/* Mobile menu */}
      <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white">
        <Menu size={20} />
      </button>

      {/* Branding */}
      <div className="flex items-center gap-2 mr-auto">
        <Activity size={16} className="text-accent-blue" />
        <span className="font-bold text-white tracking-tight">股票新聞 AI 摘要</span>
        <span className="text-xs text-gray-500 hidden sm:block">·  实時財經新聞 · AI 中文整合</span>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-accent-blue/30 bg-accent-blue/10 text-accent-blue">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-accent-blue" />
        <span>直播更新</span>
      </div>
    </header>
  )
}
