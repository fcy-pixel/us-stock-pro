import { useNavigate } from 'react-router-dom'
import { Star, TrendingUp, TrendingDown } from 'lucide-react'
import type { Quote } from '../../types'
import { formatPrice, formatPercent, formatVolume, formatMarketCap } from '../../utils/formatters'
import { useAppStore } from '../../store'
import { cn } from '../../utils/formatters'

export default function StockCard({ quote }: { quote: Quote }) {
  const navigate = useNavigate()
  const { isWatched, addToWatchlist, removeFromWatchlist } = useAppStore()
  const watched = isWatched(quote.symbol)
  const up = quote.changePercent >= 0

  return (
    <div
      className="bg-bg-card border border-white/5 rounded-xl p-4 hover:border-accent-blue/30 transition-all cursor-pointer group"
      onClick={() => navigate(`/stocks/${quote.symbol}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
            <span className="text-xs font-bold text-accent-blue">{quote.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <div className="font-semibold text-white text-sm">{quote.symbol}</div>
            <div className="text-xs text-gray-500 line-clamp-1">{quote.name}</div>
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); watched ? removeFromWatchlist(quote.symbol) : addToWatchlist(quote.symbol) }}
          className={cn('p-1 rounded transition-colors', watched ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-300')}
        >
          <Star size={14} fill={watched ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono font-bold text-xl text-white">{formatPrice(quote.price)}</div>
          <div className={`flex items-center gap-1 text-sm font-mono ${up ? 'text-up' : 'text-down'}`}>
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {formatPercent(quote.changePercent)}
          </div>
        </div>
        <div className="text-right text-xs text-gray-500 space-y-0.5">
          <div>成交量: {formatVolume(quote.volume)}</div>
          <div>市値: {formatMarketCap(quote.marketCap)}</div>
        </div>
      </div>

      <div className="mt-3 h-0.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${up ? 'bg-up' : 'bg-down'} rounded-full`}
          style={{ width: `${Math.min(100, (quote.price - quote.week52Low) / (quote.week52High - quote.week52Low) * 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-600 mt-1">
        <span>${quote.week52Low.toFixed(0)}</span>
        <span className="text-gray-500">52週區間</span>
        <span>${quote.week52High.toFixed(0)}</span>
      </div>
    </div>
  )
}
