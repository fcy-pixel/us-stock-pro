import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import NewsCard from '../components/news/NewsCard'
import { PageLoader } from '../components/common/Loading'
import { getMarketNews } from '../services/newsService'
import { TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react'
import { cn } from '../utils/formatters'

const CATEGORIES = ['general', 'earnings', 'macro', 'ai', 'crypto', 'industry', 'commodities']
const SENTIMENTS = ['all', 'positive', 'negative', 'neutral'] as const

export default function NewsPage() {
  const [category, setCategory] = useState('general')
  const [sentiment, setSentiment] = useState<typeof SENTIMENTS[number]>('all')

  const { data: news, isLoading } = useQuery({
    queryKey: ['news', category],
    queryFn: () => getMarketNews(category),
    refetchInterval: 60_000,
  })

  const filtered = (news ?? []).filter(n => sentiment === 'all' || n.sentiment === sentiment)

  const counts = {
    positive: (news ?? []).filter(n => n.sentiment === 'positive').length,
    negative: (news ?? []).filter(n => n.sentiment === 'negative').length,
    neutral: (news ?? []).filter(n => n.sentiment === 'neutral').length,
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">News & Market Signals</h1>
        <p className="text-sm text-gray-400 mt-0.5">Real-time financial news with AI sentiment analysis & stock correlation</p>
      </div>

      {/* Sentiment summary */}
      {news && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Bullish Stories', count: counts.positive, icon: TrendingUp, color: 'text-up border-up/20 bg-up/5' },
            { label: 'Bearish Stories', count: counts.negative, icon: TrendingDown, color: 'text-down border-down/20 bg-down/5' },
            { label: 'Neutral Stories', count: counts.neutral, icon: Minus, color: 'text-gray-400 border-white/10 bg-white/5' },
          ].map(({ label, count, icon: Icon, color }) => (
            <div key={label} className={`border rounded-xl p-4 flex items-center gap-3 ${color}`}>
              <Icon size={20} />
              <div>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs opacity-70">{label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-500" />
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={cn('text-xs px-3 py-1.5 rounded-lg capitalize transition-all',
                category === c ? 'bg-accent-blue text-white' : 'bg-bg-card text-gray-400 hover:text-white border border-white/5')}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {SENTIMENTS.map(s => (
            <button key={s} onClick={() => setSentiment(s)}
              className={cn('text-xs px-3 py-1.5 rounded-lg capitalize transition-all',
                sentiment === s ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white')}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* News grid */}
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => <NewsCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
