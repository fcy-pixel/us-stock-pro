import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import StockCard from '../components/stocks/StockCard'
import StockChart from '../components/stocks/StockChart'
import { PageLoader } from '../components/common/Loading'
import { getQuotes, getCandles } from '../services/stockService'
import { DEMO_QUOTES, generateDemoCandles } from '../utils/demoData'
import { formatPrice, formatPercent, formatVolume, formatMarketCap } from '../utils/formatters'
import { Search, SlidersHorizontal, Star, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import { useAppStore } from '../store'

type SortKey = 'changePercent' | 'price' | 'volume' | 'marketCap'

export default function StocksPage() {
  const { symbol } = useParams<{ symbol: string }>()
  const navigate = useNavigate()
  const { isWatched, addToWatchlist, removeFromWatchlist } = useAppStore()
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('全部')
  const [sortBy, setSortBy] = useState<SortKey>('changePercent')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  // Only fetch live prices for top 30 by market cap (Finnhub free tier: 60 req/min)
  const TOP30_SYMBOLS = DEMO_QUOTES
    .slice()
    .sort((a, b) => b.marketCap - a.marketCap)
    .slice(0, 30)
    .map(q => q.symbol)

  const { data: liveQuotes } = useQuery({
    queryKey: ['quotes', 'screener'],
    queryFn: () => getQuotes(TOP30_SYMBOLS),
    refetchInterval: 30_000,
  })

  // Always show ALL stocks from DEMO_QUOTES; overlay live prices where available
  const stockData = DEMO_QUOTES.map(demo => {
    const live = liveQuotes?.find(q => q.symbol === demo.symbol)
    if (!live || !live.price) return demo
    return {
      ...demo,
      price: live.price,
      change: live.change,
      changePercent: live.changePercent,
      open: live.open || demo.open,
      high: live.high || demo.high,
      low: live.low || demo.low,
      prevClose: live.prevClose || demo.prevClose,
    }
  })

  // Detail view
  if (symbol) {
    const quote = stockData.find(q => q.symbol === symbol) ?? DEMO_QUOTES.find(q => q.symbol === symbol)
    const candles = generateDemoCandles(90, quote?.price ?? 150)
    const watched = isWatched(symbol)

    if (!quote) return <PageLoader />

    return (
      <div className="space-y-6 animate-slide-up">
        <button onClick={() => navigate('/stocks')} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> 返回篩選器
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{quote.symbol}</h1>
              <span className={`text-sm font-mono px-2.5 py-1 rounded-lg ${quote.changePercent >= 0 ? 'bg-up/10 text-up' : 'bg-down/10 text-down'}`}>
                {formatPercent(quote.changePercent)}
              </span>
            </div>
            <p className="text-gray-400 mt-1">{quote.name} • {quote.sector}</p>
          </div>
          <button
            onClick={() => watched ? removeFromWatchlist(symbol) : addToWatchlist(symbol)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${watched ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400' : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}
          >
            <Star size={14} fill={watched ? 'currentColor' : 'none'} />
            {watched ? '已加自選股' : '加入自選股'}
          </button>
        </div>

        <StockChart candles={candles} symbol={symbol} currentPrice={quote.price} change={quote.changePercent} />

        {/* Key stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: '開盤價', value: formatPrice(quote.open) },
            { label: '日內高', value: formatPrice(quote.high) },
            { label: '日內低', value: formatPrice(quote.low) },
            { label: '昔日收盤', value: formatPrice(quote.prevClose) },
            { label: '成交量', value: formatVolume(quote.volume) },
            { label: '平均成交量', value: formatVolume(quote.avgVolume) },
            { label: '市値', value: formatMarketCap(quote.marketCap) },
            { label: '市盈率 P/E', value: (quote.pe ?? 0) > 0 ? (quote.pe ?? 0).toFixed(1) : 'N/A' },
            { label: 'EPS 每股盈利', value: quote.eps > 0 ? formatPrice(quote.eps) : 'N/A' },
            { label: '52週最高', value: formatPrice(quote.week52High) },
            { label: '52週最低', value: formatPrice(quote.week52Low) },
            { label: '行業', value: quote.industry },
          ].map(({ label, value }) => (
            <div key={label} className="bg-bg-card border border-white/5 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">{label}</div>
              <div className="font-mono text-sm font-medium text-white truncate">{value}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Screener list
  const sectors = ['全部', ...Array.from(new Set(stockData.map(q => q.sector)))]
  const filtered = stockData
    .filter(q => (!search || q.symbol.toLowerCase().includes(search.toLowerCase()) || q.name.toLowerCase().includes(search.toLowerCase())))
    .filter(q => sector === '全部' || q.sector === sector)
    .sort((a, b) => {
      const diff = a[sortBy] - b[sortBy]
      return sortDir === 'desc' ? -diff : diff
    })

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortBy(key); setSortDir('desc') }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">股票篩選器</h1>
        <p className="text-sm text-gray-400 mt-0.5">篩選及分析 {stockData.length} 支美股</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-bg-card border border-white/10 rounded-lg px-3 py-2">
          <Search size={14} className="text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋代碼或名稱…"
            className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-44" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal size={14} className="text-gray-500" />
          {sectors.map(s => (
            <button key={s} onClick={() => setSector(s)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all ${sector === s ? 'bg-accent-blue text-white' : 'bg-bg-card border border-white/5 text-gray-400 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
        <span>股票</span>
        {(['price', 'changePercent', 'volume', 'marketCap'] as SortKey[]).map(k => (
          <button key={k} onClick={() => toggleSort(k)} className="flex items-center gap-1 hover:text-white transition-colors">
            {k === 'changePercent' ? '漲跌%' : k === 'marketCap' ? '市値' : k === 'price' ? '價格' : '成交量'}
            {sortBy === k && <span className="text-accent-blue">{sortDir === 'desc' ? '↓' : '↑'}</span>}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(q => <StockCard key={q.symbol} quote={q} />)}
      </div>
    </div>
  )
}
