import { ExternalLink, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react'
import type { NewsItem } from '../../types'
import { formatTimeAgo } from '../../utils/formatters'
import { useNavigate } from 'react-router-dom'

export default function NewsCard({ item, compact = false }: { item: NewsItem; compact?: boolean }) {
  const navigate = useNavigate()

  const sentimentConfig = {
    positive: { color: 'text-up', bg: 'bg-up/10 border-up/20', icon: TrendingUp, label: 'Bullish' },
    negative: { color: 'text-down', bg: 'bg-down/10 border-down/20', icon: TrendingDown, label: 'Bearish' },
    neutral: { color: 'text-gray-400', bg: 'bg-white/5 border-white/10', icon: Minus, label: 'Neutral' },
  }
  const cfg = sentimentConfig[item.sentiment]
  const Icon = cfg.icon

  return (
    <div className="bg-bg-card border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all group">
      {item.image && !compact && (
        <div className="h-36 overflow-hidden">
          <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} font-medium`}>
            <Icon size={10} />
            {cfg.label}
          </span>
          <span className="text-xs text-gray-500 capitalize">{item.category}</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-gray-500">
            <Clock size={10} />
            {formatTimeAgo(item.datetime)}
          </span>
        </div>

        {/* Headline */}
        <a href={item.url} target="_blank" rel="noopener noreferrer"
          className="block font-semibold text-white text-sm leading-snug hover:text-accent-blue transition-colors mb-1.5 line-clamp-3">
          {item.headline}
        </a>

        {!compact && (
          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">{item.summary}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {item.relatedStocks?.slice(0, 4).map(sym => (
              <button
                key={sym}
                onClick={() => navigate(`/stocks/${sym}`)}
                className="text-[10px] font-mono font-semibold text-accent-blue bg-accent-blue/10 hover:bg-accent-blue/20 px-1.5 py-0.5 rounded transition-colors"
              >
                {sym}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{item.source}</span>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
