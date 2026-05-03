import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import NewsCard from '../components/news/NewsCard'
import { PageLoader } from '../components/common/Loading'
import { getMarketNews, getAISummary } from '../services/newsService'
import { TrendingUp, TrendingDown, Minus, Filter, Sparkles, RefreshCw, ChevronRight } from 'lucide-react'
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

const SENTIMENT_META = {
  bullish: { label: '整體看漲', color: 'text-up', bg: 'bg-up/10 border-up/30', dot: 'bg-up' },
  bearish: { label: '整體看跌', color: 'text-down', bg: 'bg-down/10 border-down/30', dot: 'bg-down' },
  neutral: { label: '整體中性', color: 'text-gray-300', bg: 'bg-white/5 border-white/10', dot: 'bg-gray-400' },
}

export default function NewsPage() {
  const [category, setCategory] = useState('general')
  const [sentiment, setSentiment] = useState<typeof SENTIMENTS[number]>('all')
  const [summaryExpanded, setSummaryExpanded] = useState(true)

  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary, isFetching: summaryFetching } = useQuery({
    queryKey: ['ai-summary'],
    queryFn: getAISummary,
    staleTime: 5 * 60_000,   // re-use for 5 min
    refetchInterval: 10 * 60_000,
  })

  const { data: news, isLoading: newsLoading } = useQuery({
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

  const sentMeta = summary ? SENTIMENT_META[summary.overallSentiment] : null

  return (
    <div className="space-y-6 animate-slide-up">
      {/* ── AI Summary Panel ───────────────────────────────── */}
      <div className="bg-gradient-to-br from-accent-blue/10 via-bg-card to-bg-card border border-accent-blue/20 rounded-2xl overflow-hidden">
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent-blue" />
            <h2 className="font-semibold text-white text-sm">AI 市場摘要</h2>
            {summary && sentMeta && (
              <span className={`flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full border font-medium ${sentMeta.bg} ${sentMeta.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sentMeta.dot}`} />
                {sentMeta.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {summary && (
              <span className="text-xs text-gray-500">
                更新於 {new Date(summary.updatedAt * 1000).toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={() => refetchSummary()}
              disabled={summaryFetching}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
            >
              <RefreshCw size={12} className={summaryFetching ? 'animate-spin' : ''} />
              重新整合
            </button>
            <button onClick={() => setSummaryExpanded(v => !v)} className="text-gray-500 hover:text-white transition-colors">
              <ChevronRight size={16} className={cn('transition-transform', summaryExpanded ? 'rotate-90' : '')} />
            </button>
          </div>
        </div>

        {summaryExpanded && (
          <div className="px-5 py-4 space-y-4">
            {summaryLoading || summaryFetching ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-5/6" />
                <div className="h-4 bg-white/10 rounded w-4/6" />
              </div>
            ) : summary ? (
              <>
                {/* Main digest */}
                <p className="text-sm text-gray-200 leading-relaxed">{summary.digest}</p>

                {/* Key points */}
                {summary.keyPoints.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">重點摘要</h3>
                    <ul className="space-y-1.5">
                      {summary.keyPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hot topics */}
                {summary.hotTopics.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500">熱門主題：</span>
                    {summary.hotTopics.map(topic => (
                      <span key={topic} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2.5 py-1 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 py-2">AI 摘要暫時無法使用（需要設定 QWEN_API_KEY）</p>
            )}
          </div>
        )}
      </div>

      {/* ── Sentiment counts ───────────────────────────────── */}
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

      {/* ── Filters ────────────────────────────────────────── */}
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

      {/* ── News grid ──────────────────────────────────────── */}
      {newsLoading ? (
        <PageLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(item => <NewsCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
