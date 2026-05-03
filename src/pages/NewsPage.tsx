import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import NewsCard from '../components/news/NewsCard'
import { PageLoader } from '../components/common/Loading'
import { getMarketNews } from '../services/newsService'
import { TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react'
import { cn } from '../utils/formatters'

const CATEGORIES = ['general', 'earnings', 'macro', 'ai', 'crypto', 'industry', 'commodities']
const CATEGORY_LABELS: Record<string, string> = {
  general: '全部',
  earnings: '盈利公布',
  macro: '宏觀經濟',
  ai: '人工智慧',
  crypto: '加密貨幣',
  industry: '產業動態',
  commodities: '商品期貨',
}
const SENTIMENTS = ['all', 'positive', 'negative', 'neutral'] as const
const SENTIMENT_LABELS: Record<string, string> = { all: '全部', positive: '看漲', negative: '看跌', neutral: '中性' }

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
        <h1 className="text-2xl font-bold text-white">新聞與市場訊號</h1>
        <p className="text-sm text-gray-400 mt-0.5">实時財經新聞·AI 情緒分析·相關股票自動識別</p>
      </div>

      {/* Sentiment summary */}
      {news && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '看漲文章', count: counts.positive, icon: TrendingUp, color: 'text-up border-up/20 bg-up/5' },
            { label: '看跌文章', count: counts.negative, icon: TrendingDown, color: 'text-down border-down/20 bg-down/5' },
            { label: '中性文章', count: counts.neutral, icon: Minus, color: 'text-gray-400 border-white/10 bg-white/5' },
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
              className={cn('text-xs px-3 py-1.5 rounded-lg transition-all',
                category === c ? 'bg-accent-blue text-white' : 'bg-bg-card text-gray-400 hover:text-white border border-white/5')}>
              {CATEGORY_LABELS[c] ?? c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {SENTIMENTS.map(s => (
            <button key={s} onClick={() => setSentiment(s)}
              className={cn('text-xs px-3 py-1.5 rounded-lg transition-all',
                sentiment === s ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white')}>
              {SENTIMENT_LABELS[s] ?? s}
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
