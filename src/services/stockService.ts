import type { Quote, Candle, MarketIndex, AnalystRating, SectorPerformance, MarketStatus } from '../types'
import { DEMO_QUOTES, DEMO_INDICES, DEMO_SECTORS, generateDemoCandles } from '../utils/demoData'

const BASE = '/api'

async function apiFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${BASE}${path}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json() as T
  } catch {
    return fallback
  }
}

export async function getQuote(symbol: string): Promise<Quote> {
  const demo = DEMO_QUOTES.find(q => q.symbol === symbol) ?? DEMO_QUOTES[0]
  return apiFetch<Quote>(`/quote?symbol=${encodeURIComponent(symbol)}`, demo)
}

export async function getQuotes(symbols: string[]): Promise<Quote[]> {
  return apiFetch<Quote[]>(`/quotes?symbols=${symbols.join(',')}`, DEMO_QUOTES)
}

export async function getMarketIndices(): Promise<MarketIndex[]> {
  return apiFetch<MarketIndex[]>('/indices', DEMO_INDICES)
}

function localUSMarketStatus(): MarketStatus {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now)
  const weekday = parts.find(p => p.type === 'weekday')?.value ?? 'Sun'
  const hour = Number(parts.find(p => p.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find(p => p.type === 'minute')?.value ?? 0)
  const minutes = hour * 60 + minute
  const isWeekday = !['Sat', 'Sun'].includes(weekday)
  const isOpen = isWeekday && minutes >= 9 * 60 + 30 && minutes < 16 * 60

  return {
    isOpen,
    session: isOpen ? 'regular' : 'closed',
    timezone: 'America/New_York',
    holiday: null,
    t: Math.floor(now.getTime() / 1000),
  }
}

export async function getMarketStatus(): Promise<MarketStatus> {
  return apiFetch<MarketStatus>('/market-status', localUSMarketStatus())
}

export async function getCandles(symbol: string, resolution: string, from: number, to: number): Promise<Candle[]> {
  const demo = generateDemoCandles(90, DEMO_QUOTES.find(q => q.symbol === symbol)?.price ?? 150)
  return apiFetch<Candle[]>(`/candles?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}`, demo)
}

export async function searchStocks(query: string): Promise<{ symbol: string; name: string; type: string }[]> {
  return apiFetch(`/search?q=${encodeURIComponent(query)}`, [])
}

export async function getSectorPerformance(): Promise<SectorPerformance[]> {
  return apiFetch<SectorPerformance[]>('/sectors', DEMO_SECTORS)
}

export async function getAnalystRatings(symbol: string): Promise<AnalystRating | null> {
  return apiFetch<AnalystRating | null>(`/analyst?symbol=${encodeURIComponent(symbol)}`, null)
}
