import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useAppStore } from '../../store'
import { cn } from '../../utils/formatters'

export default function Layout() {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="min-h-screen bg-bg-primary text-white font-[Inter,sans-serif]">
      <Sidebar />
      <Header />
      <main className={cn(
        'pt-16 transition-all duration-300 min-h-screen',
        sidebarOpen ? 'lg:pl-60' : 'lg:pl-16'
      )}>
        <div className="p-4 lg:p-6 max-w-screen-2xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
