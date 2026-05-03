import { useQuery } from '@tanstack/react-query'
import MarketOverview from '../components/dashboard/MarketOverview'
import SectorHeatMap from '../components/dashboard/SectorHeatMap'
import TopMovers from '../components/dashboard/TopMovers'
import NewsCard from '../components/news/NewsCard'
import AIRecommendationCard from '../components/ai/AIRecommendationCard'
import { PageLoader } from '../components/common/Loading'
import { getMarketIndices, getQuotes, getSectorPerformance } from '../services/stockService'
import { getMarketNews } from '../services/newsService'
import { getTopPicks } from '../services/aiService'
import { DEMO_QUOTES } from '../utils/demoData'
import { RefreshCw, Cpu, Newspaper } from 'lucide-react'

export default function DashboardPage() {
  const { data: indices, isLoading: loadingIdx } = useQuery({
    queryKey: ['indices'],
    queryFn: getMarketIndices,
    refetchInterval: 30_000,
  })

  const { data: quotes, isLoading: loadingQ } = useQuery({
    queryKey: ['quotes', 'dashboard'],
    queryFn: () => getQuotes(DEMO_QUOTES.map(q => q.symbol)),
    refetchInterval: 30_000,
  })

  const { data: sectors } = useQuery({
    queryKey: ['sectors'],
    queryFn: getSectorPerformance,
    refetchInterval: 60_000,
  })

  const { data: news, isLoading: loadingNews } = useQuery({
    queryKey: ['news', 'general'],
    queryFn: () => getMarketNews('general'),
    refetchInterval: 120_000,
  })

  const stockData = quotes ?? DEMO_QUOTES
  const newsData = news ?? []
  const picks = getTopPicks(stockData, newsData, 3)

  if (loadingIdx && loadingQ) return <PageLoader />

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Market Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Real-time US market intelligence & AI insights</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <RefreshCw size={12} className="animate-spin-slow" />
          <span>Live • Updates every 30s</span>
        </div>
      </div>

      {/* Market indices */}
      {indices && <MarketOverview indices={indices} />}

      {/* Sector heatmap */}
      {sectors && <SectorHeatMap sectors={sectors} />}

      {/* Top movers */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Today's Top Movers</h2>
        <TopMovers quotes={stockData} />
      </section>

      {/* AI Picks preview */}
      {picks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Cpu size={13} className="text-accent-blue" /> AI Top Picks Today
            </h2>
            <a href="/ai-picks" className="text-xs text-accent-blue hover:underline">View all →</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {picks.map(r => <AIRecommendationCard key={r.symbol} rec={r} />)}
          </div>
        </section>
      )}

      {/* News */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Newspaper size={13} /> Latest Market News
          </h2>
          <a href="/news" className="text-xs text-accent-blue hover:underline">View all →</a>
        </div>
        {loadingNews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="bg-bg-card border border-white/5 rounded-xl h-48 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsData.slice(0, 6).map(item => <NewsCard key={item.id} item={item} />)}
          </div>
        )}
      </section>
    </div>
  )
}
