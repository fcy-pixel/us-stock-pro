import { useQuery } from '@tanstack/react-query'
import { Cpu, RefreshCw, Info } from 'lucide-react'
import AIRecommendationCard from '../components/ai/AIRecommendationCard'
import { PageLoader } from '../components/common/Loading'
import { getQuotes } from '../services/stockService'
import { getMarketNews } from '../services/newsService'
import { generateRecommendations } from '../services/aiService'
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

  const allRecs = generateRecommendations(quotes ?? DEMO_QUOTES, news ?? DEMO_NEWS)
  const buyRecs = allRecs.filter(r => r.action === 'STRONG_BUY' || r.action === 'BUY')
  const holdRecs = allRecs.filter(r => r.action === 'HOLD')
  const sellRecs = allRecs.filter(r => r.action === 'SELL' || r.action === 'STRONG_SELL')

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Cpu size={24} className="text-accent-blue" /> AI Stock Picks
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Multi-factor AI scoring: sentiment analysis × technical indicators × price momentum × analyst consensus
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <RefreshCw size={12} />
          <span>Updated every 2 minutes</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4 text-xs text-yellow-300/70">
        <Info size={14} className="shrink-0 mt-0.5 text-yellow-400/60" />
        <p>AI recommendations are for informational purposes only and do not constitute financial advice. Always conduct your own research and consult a licensed financial advisor before making investment decisions.</p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Sentiment Score', desc: 'News & social media sentiment analysis', value: '30%', color: 'text-accent-blue' },
          { label: 'Technical Score', desc: '52W position, RSI proxy, MA signals', value: '25%', color: 'text-purple-400' },
          { label: 'Momentum Score', desc: 'Price momentum & volume analysis', value: '25%', color: 'text-yellow-400' },
          { label: 'Analyst Score', desc: 'Wall Street analyst consensus ratings', value: '20%', color: 'text-up' },
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
            Buy Signals ({buyRecs.length})
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
            Hold / Neutral ({holdRecs.length})
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
            Sell Signals ({sellRecs.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sellRecs.map(r => <AIRecommendationCard key={r.symbol} rec={r} />)}
          </div>
        </section>
      )}
    </div>
  )
}
