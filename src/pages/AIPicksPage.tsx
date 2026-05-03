import { useQuery } from '@tanstack/react-query'
import { Cpu, RefreshCw, Info } from 'lucide-react'
import AIRecommendationCard from '../components/ai/AIRecommendationCard'
import { PageLoader } from '../components/common/Loading'
import { getQuotes } from '../services/stockService'
import { getMarketNews } from '../services/newsService'
import { generateRecommendations, getAIRecommendations } from '../services/aiService'
import { DEMO_QUOTES, DEMO_NEWS } from '../utils/demoData'

export default function AIPicksPage() {
  const { data: quotes } = useQuery({
    queryKey: ['quotes', 'ai'],
    queryFn: () => getQuotes(DEMO_QUOTES.map(q => q.symbol)),
    refetchInterval: 60_000,
  })

  const { data: news, isLoading } = useQuery({
    queryKey: ['news', 'ai'],
    queryFn: () => getMarketNews('general'),
    refetchInterval: 120_000,
  })

  const quoteData = quotes ?? DEMO_QUOTES
  const newsData = news ?? DEMO_NEWS
  const { data: aiRecs, isLoading: loadingAI } = useQuery({
    queryKey: ['ai-recommendations', quoteData.map(q => q.symbol).join(','), newsData.map(n => n.id).join(',')],
    queryFn: () => getAIRecommendations(quoteData, newsData),
    enabled: !isLoading,
    refetchInterval: 120_000,
  })

  const fallbackRecs = generateRecommendations(quoteData, newsData)
  const allRecs = aiRecs?.length ? aiRecs : fallbackRecs
  const buyRecs = allRecs.filter(r => r.action === 'STRONG_BUY' || r.action === 'BUY')
  const holdRecs = allRecs.filter(r => r.action === 'HOLD')
  const sellRecs = allRecs.filter(r => r.action === 'SELL' || r.action === 'STRONG_SELL')

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Cpu size={24} className="text-accent-blue" /> AI 選股推薦
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Qwen AI 多因子評分：情緒分析 × 技術指標 × 價格動量 × 分析師共識
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <RefreshCw size={12} className={loadingAI ? 'animate-spin' : undefined} />
          <span>{loadingAI ? 'Qwen AI 分析中' : '每 2 分鐘更新'}</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4 text-xs text-yellow-300/70">
        <Info size={14} className="shrink-0 mt-0.5 text-yellow-400/60" />
        <p>AI 推薦僅供參考，不構成任何投資建議。投資有風險，市場有漲有跌。請自行研究分析，如需請誵詢持牌財務顧問。</p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: '情緒評分', desc: '新聞與社群媒體情緒分析', value: '30%', color: 'text-accent-blue' },
          { label: '技術評分', desc: '52週位置、RSI指標、均線訊號', value: '25%', color: 'text-purple-400' },
          { label: '動量評分', desc: '價格動量與成交量分析', value: '25%', color: 'text-yellow-400' },
          { label: '分析師評分', desc: '华尔街分析師共識評级', value: '20%', color: 'text-up' },
        ].map(({ label, desc, value, color }) => (
          <div key={label} className="bg-bg-card border border-white/5 rounded-xl p-4">
            <div className={`text-lg font-bold ${color} mb-1`}>{value}</div>
            <div className="text-sm font-medium text-white mb-0.5">{label}</div>
            <div className="text-xs text-gray-500">{desc}</div>
          </div>
        ))}
      </div>

      {/* BUY recommendations */}
      {buyRecs.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-up uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-up animate-pulse" />
            買入訊號 ({buyRecs.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {buyRecs.map(r => <AIRecommendationCard key={r.symbol} rec={r} />)}
          </div>
        </section>
      )}

      {/* HOLD recommendations */}
      {holdRecs.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-yellow-400 uppercase tracking-widest mb-4">
            持有 / 中性 ({holdRecs.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {holdRecs.map(r => <AIRecommendationCard key={r.symbol} rec={r} />)}
          </div>
        </section>
      )}

      {/* SELL recommendations */}
      {sellRecs.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-down uppercase tracking-widest mb-4">
            賣出訊號 ({sellRecs.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sellRecs.map(r => <AIRecommendationCard key={r.symbol} rec={r} />)}
          </div>
        </section>
      )}
    </div>
  )
}
