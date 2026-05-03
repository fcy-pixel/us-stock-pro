import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { MarketIndex } from '../../types'
import { formatPercent } from '../../utils/formatters'

export default function IndexCard({ index }: { index: MarketIndex }) {
  const up = index.changePercent > 0
  const neutral = index.changePercent === 0

  return (
    <div className="bg-bg-card border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 font-medium">{index.name}</span>
        <span className={`flex items-center gap-1 text-xs ${up ? 'text-up' : neutral ? 'text-gray-400' : 'text-down'}`}>
          {up ? <TrendingUp size={12} /> : neutral ? <Minus size={12} /> : <TrendingDown size={12} />}
          {formatPercent(index.changePercent)}
        </span>
      </div>
      <div className="font-mono font-bold text-xl text-white">
        {(index.price ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className={`text-sm font-mono mt-0.5 ${up ? 'text-up' : neutral ? 'text-gray-400' : 'text-down'}`}>
        {up ? '+' : ''}{(index.change ?? 0).toFixed(2)}
      </div>
      {/* Mini bar */}
      <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${up ? 'bg-up' : 'bg-down'}`}
          style={{ width: `${Math.min(100, Math.abs(index.changePercent) * 20 + 30)}%` }}
        />
      </div>
    </div>
  )
}
