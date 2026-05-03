import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Star, Trash2, TrendingUp, TrendingDown, Bell } from 'lucide-react'
import { useAppStore } from '../store'
import { getQuotes } from '../services/stockService'
import { formatPrice, formatPercent, formatVolume } from '../utils/formatters'
import { DEMO_QUOTES } from '../utils/demoData'

export default function WatchlistPage() {
  const navigate = useNavigate()
  const { watchlist, addToWatchlist, removeFromWatchlist } = useAppStore()

  const symbols = watchlist.map(w => w.symbol)
  const { data: quotes } = useQuery({
    queryKey: ['quotes', 'watchlist', symbols.join(',')],
    queryFn: () => getQuotes(symbols),
    enabled: symbols.length > 0,
    refetchInterval: 30_000,
  })

  const stockData = quotes ?? DEMO_QUOTES.filter(q => symbols.includes(q.symbol))

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Watchlist</h1>
          <p className="text-sm text-gray-400 mt-0.5">{watchlist.length} stocks tracked</p>
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-up animate-pulse" />
          Live prices
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-3">
          <Star size={40} className="opacity-30" />
          <p>Your watchlist is empty</p>
          <button onClick={() => navigate('/stocks')} className="text-accent-blue text-sm hover:underline">
            Browse stocks →
          </button>
        </div>
      ) : (
        <div className="bg-bg-card border border-white/5 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-white/5 text-xs text-gray-500 font-medium uppercase tracking-wider">
            <span>Symbol</span>
            <span>Price</span>
            <span>Change</span>
            <span className="hidden sm:block">Volume</span>
            <span>Actions</span>
          </div>
          {stockData.map(q => (
            <div
              key={q.symbol}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center border-b border-white/5 last:border-0 hover:bg-bg-hover transition-all cursor-pointer"
              onClick={() => navigate(`/stocks/${q.symbol}`)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-accent-blue">{q.symbol.slice(0, 2)}</span>
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{q.symbol}</div>
                  <div className="text-xs text-gray-500 hidden sm:block">{q.name.split(' ').slice(0, 3).join(' ')}</div>
                </div>
              </div>
              <div className="font-mono text-sm font-medium text-white">{formatPrice(q.price)}</div>
              <div className={`flex items-center gap-1 text-sm font-mono ${q.changePercent >= 0 ? 'text-up' : 'text-down'}`}>
                {q.changePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {formatPercent(q.changePercent)}
              </div>
              <div className="text-xs text-gray-500 hidden sm:block">{formatVolume(q.volume)}</div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <button className="p-1.5 rounded text-gray-500 hover:text-yellow-400 transition-colors">
                  <Bell size={13} />
                </button>
                <button
                  onClick={() => removeFromWatchlist(q.symbol)}
                  className="p-1.5 rounded text-gray-500 hover:text-down transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
