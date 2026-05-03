// ──────────────────────────────────────────────
//  Core domain types
// ──────────────────────────────────────────────

export interface Quote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  open: number
  high: number
  low: number
  prevClose: number
  volume: number
  avgVolume: number
  marketCap: number
  pe: number
  eps: number
  week52High: number
  week52Low: number
  sector: string
  industry: string
  logo?: string
}

export interface Candle {
  time: number   // Unix timestamp ms
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface NewsItem {
  id: string
  headline: string
  headlineZh?: string
  summary: string
  summaryZh?: string
  url: string
  datetime: number   // Unix timestamp seconds
  source: string
  image?: string
  sentiment: 'positive' | 'negative' | 'neutral'
  sentimentScore: number   // -1 to 1
  relatedStocks: string[]
  category: string
}

export interface MarketIndex {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

export interface MarketStatus {
  isOpen: boolean
  session: string
  timezone: string
  holiday: string | null
  t: number | null
}

export interface Recommendation {
  symbol: string
  name: string
  price: number
  action: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL'
  confidence: number   // 0-100
  targetPrice: number
  upside: number
  scores: {
    sentiment: number
    technical: number
    momentum: number
    analyst: number
  }
  reasons: string[]
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
  newsCount: number
}

export interface PortfolioHolding {
  symbol: string
  name: string
  shares: number
  avgCost: number
  currentPrice: number
  value: number
  costBasis: number
  gainLoss: number
  gainLossPercent: number
  dayChange: number
  dayChangePercent: number
  sector: string
  addedAt: string
}

export interface WatchlistItem {
  symbol: string
  addedAt: string
  alertAbove?: number
  alertBelow?: number
}

export interface SectorPerformance {
  sector: string
  etf: string
  change: number
  changePercent: number
  topStock: string
}

export interface AnalystRating {
  buy: number
  hold: number
  sell: number
  strongBuy: number
  strongSell: number
  targetHigh: number
  targetLow: number
  targetMean: number
  targetMedian: number
}

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y'

export type SortField = 'symbol' | 'price' | 'change' | 'changePercent' | 'volume' | 'marketCap'
export type SortDir = 'asc' | 'desc'
