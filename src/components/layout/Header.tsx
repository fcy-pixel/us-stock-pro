import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Menu, TrendingUp, TrendingDown, X } from 'lucide-react'
import { useAppStore } from '../../store'
import { searchStocks } from '../../services/stockService'
import { formatPercent } from '../../utils/formatters'
import { DEMO_INDICES } from '../../utils/demoData'

export default function Header() {
  const { toggleSidebar } = useAppStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ symbol: string; name: string }[]>([])
  const [searching, setSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.length < 1) { setResults([]); return }
    const t = setTimeout(async () => {
      setSearching(true)
      try {
        const r = await searchStocks(query)
        setResults(r.slice(0, 8))
      } finally { setSearching(false) }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropRef.current?.contains(e.target as Node)) setResults([])
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (symbol: string) => {
    setQuery('')
    setResults([])
    navigate(`/stocks/${symbol}`)
  }

  const bullish = DEMO_INDICES[0].changePercent > 0

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-16 z-20 h-16 bg-bg-primary/90 backdrop-blur border-b border-white/5 flex items-center gap-4 px-4">
      {/* Mobile menu */}
      <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white">
        <Menu size={20} />
      </button>

      {/* Market ticker strip */}
      <div className="hidden md:flex items-center gap-4 mr-auto">
        {DEMO_INDICES.slice(0, 4).map(idx => (
          <div key={idx.symbol} className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-400">{idx.name}</span>
            <span className="font-mono font-medium text-white">{(idx.price ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className={idx.changePercent >= 0 ? 'text-up flex items-center gap-0.5' : 'text-down flex items-center gap-0.5'}>
              {idx.changePercent >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {formatPercent(idx.changePercent)}
            </span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative ml-auto" ref={dropRef}>
        <div className="flex items-center gap-2 bg-bg-card border border-white/10 rounded-lg px-3 py-2 w-52 focus-within:border-accent-blue/60 transition-colors">
          <Search size={14} className="text-gray-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜尋股票代碼…"
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
          />
          {query && <button onClick={() => setQuery('')}><X size={12} className="text-gray-500" /></button>}
        </div>
        {(results.length > 0 || searching) && (
          <div className="absolute top-full mt-1 right-0 w-72 bg-bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
            {searching && <div className="px-4 py-3 text-xs text-gray-400">搜尋中…</div>}
            {results.map(r => (
              <button
                key={r.symbol}
                onClick={() => handleSelect(r.symbol)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-hover text-left"
              >
                <span className="font-mono font-semibold text-accent-blue text-sm w-14">{r.symbol}</span>
                <span className="text-sm text-gray-300 truncate">{r.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Market status pill */}
      <div className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${bullish ? 'border-up/30 bg-up/10 text-up' : 'border-down/30 bg-down/10 text-down'}`}>
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${bullish ? 'bg-up' : 'bg-down'}`} />
        <span>市場開市中</span>
      </div>

      {/* Notifications */}
      <button className="relative text-gray-400 hover:text-white transition-colors">
        <Bell size={18} />
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-accent-blue rounded-full text-[9px] flex items-center justify-center text-white font-bold">3</span>
      </button>
    </header>
  )
}
