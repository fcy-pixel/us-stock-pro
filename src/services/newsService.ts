import type { NewsItem } from '../types'
import { DEMO_NEWS } from '../utils/demoData'
import { analyzeSentiment } from '../utils/sentiment'
import { findRelatedStocks } from '../utils/stockKeywords'

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

export async function getMarketNews(category = 'general'): Promise<NewsItem[]> {
  const raw = await apiFetch<NewsItem[]>(`/news?category=${category}`, DEMO_NEWS)
  // Enrich with sentiment & related stocks if coming from API
  return raw.map(item => {
    if (item.relatedStocks?.length) return item
    const text = `${item.headline} ${item.summary}`
    const { sentiment, score } = analyzeSentiment(text)
    return {
      ...item,
      sentiment,
      sentimentScore: score,
      relatedStocks: findRelatedStocks(text),
    }
  })
}

export async function getCompanyNews(symbol: string): Promise<NewsItem[]> {
  const from = new Date(Date.now() - 7 * 86400_000).toISOString().split('T')[0]
  const to = new Date().toISOString().split('T')[0]
  return apiFetch<NewsItem[]>(`/company-news?symbol=${encodeURIComponent(symbol)}&from=${from}&to=${to}`, [])
}
