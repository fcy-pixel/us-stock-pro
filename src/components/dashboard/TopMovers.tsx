import { useNavigate } from 'react-router-dom'
import type { Quote } from '../../types'
import { formatPrice, formatPercent, formatVolume } from '../../utils/formatters'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function TopMovers({ quotes }: { quotes: Quote[] }) {
  const navigate = useNavigate()
  const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent)
  const gainers = sorted.slice(0, 5)
  const losers = sorted.slice(-5).reverse()

  const Row = ({ q }: { q: Quote }) => (
    <button
      onClick={() => navigate(`/stocks/${q.symbol}`)}
      className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-bg-hover transition-all text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center">
          <span className="text-xs font-bold text-accent-blue">{q.symbol.slice(0, 2)}</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{q.symbol}</div>
          <div className="text-xs text-gray-500 truncate max-w-[100px]">{q.name.split(' ').slice(0, 2).join(' ')}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-sm font-medium text-white">{formatPrice(q.price)}</div>
        <div className={`text-xs font-mono flex items-center justify-end gap-0.5 ${q.changePercent >= 0 ? 'text-up' : 'text-down'}`}>
          {q.changePercent >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {formatPercent(q.changePercent)}
        </div>
      </div>
    </button>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-bg-card border border-white/5 rounded-xl p-4">
        <h3 className="text-xs font-semibold text-up uppercase tracking-widest mb-3 flex items-center gap-2">
          <TrendingUp size={13} /> Top Gainers
        </h3>
        <div className="space-y-0.5">
          {gainers.map(q => <Row key={q.symbol} q={q} />)}
        </div>
      </div>
      <div className="bg-bg-card border border-white/5 rounded-xl p-4">
        <h3 className="text-xs font-semibold text-down uppercase tracking-widest mb-3 flex items-center gap-2">
          <TrendingDown size={13} /> Top Losers
        </h3>
        <div className="space-y-0.5">
          {losers.map(q => <Row key={q.symbol} q={q} />)}
        </div>
      </div>
    </div>
  )
}
