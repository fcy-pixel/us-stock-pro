import type { Quote, Candle, MarketIndex, AnalystRating, SectorPerformance } from '../types'
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
