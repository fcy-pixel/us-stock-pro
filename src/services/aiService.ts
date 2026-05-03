import type { Recommendation, NewsItem, Quote } from '../types'
import { DEMO_QUOTES } from '../utils/demoData'

interface ScoringInput {
  quote: Quote
  newsItems: NewsItem[]
  analystBuy?: number
  analystSell?: number
}

function calcSentimentScore(symbol: string, news: NewsItem[]): number {
  const related = news.filter(n => n.relatedStocks?.includes(symbol))
  if (!related.length) return 50
  const avg = related.reduce((s, n) => s + n.sentimentScore, 0) / related.length
  return Math.round(50 + avg * 50)
}

function calcTechnicalScore(quote: Quote): number {
  // Simplified: distance from 52w low vs range
  const range = quote.week52High - quote.week52Low
  if (!range) return 50
  const pos = (quote.price - quote.week52Low) / range
  // RSI proxy: if in lower 30% = oversold = bullish
  if (pos < 0.3) return 75
  if (pos > 0.8) return 30
  return 50
}

function calcMomentumScore(quote: Quote): number {
  const pct = quote.changePercent
  if (pct > 3) return 85
  if (pct > 1) return 70
  if (pct > 0) return 55
  if (pct > -1) return 45
  if (pct > -3) return 30
  return 15
}

function calcAnalystScore(buy = 0, sell = 0): number {
  const total = buy + sell
  if (!total) return 50
  return Math.round((buy / total) * 100)
}

function actionFromScore(score: number): Recommendation['action'] {
  if (score >= 80) return 'STRONG_BUY'
  if (score >= 65) return 'BUY'
  if (score >= 45) return 'HOLD'
  if (score >= 30) return 'SELL'
  return 'STRONG_SELL'
}

function riskFromVolatility(quote: Quote): Recommendation['risk'] {
  const range = quote.week52High - quote.week52Low
  if (quote.week52Low <= 0 || range <= 0) return 'MEDIUM'
  const volatility = range / quote.week52Low
  if (volatility < 0.4) return 'LOW'
  if (volatility < 0.8) return 'MEDIUM'
  return 'HIGH'
}

function buildReasons(scores: Recommendation['scores'], quote: Quote, news: NewsItem[]): string[] {
  const reasons: string[] = []
  const changePercent = quote.changePercent ?? 0
  const pe = quote.pe ?? 0
  if (scores.sentiment > 70) reasons.push(`新聞情緒偏正面 (${scores.sentiment}%)`)
  if (scores.sentiment < 35) reasons.push(`負面新聞主導 — ${news.filter(n => n.relatedStocks?.includes(quote.symbol) && n.sentiment === 'negative').length} 篇負面報道`)
  if (scores.technical > 65) reasons.push('技術面超賣 — 存在均值回歸機會')
  if (scores.technical < 35) reasons.push('接近52週高位 — 技術上行空間有限')
  if (scores.momentum > 65) reasons.push(`強勁價格動量：今日 ${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%`)
  if (scores.momentum < 35) reasons.push(`動量偏弱：今日 ${changePercent.toFixed(2)}%`)
  if (scores.analyst > 65) reasons.push('多數分析師共識：買入')
  if (scores.analyst < 35) reasons.push('分析師共識偏向看淡')
  if (pe > 0 && pe < 20) reasons.push(`估值吸引：市盈率 ${pe.toFixed(1)}x`)
  if (pe > 60) reasons.push(`估值偏高：市盈率 ${pe.toFixed(1)}x — 需高增長支撐`)
  return reasons.length ? reasons : ['訊號不足，暫維持中性觀望']
}

export function generateRecommendations(quotes: Quote[], news: NewsItem[]): Recommendation[] {
  return quotes
    .map(quote => {
      const sentimentScore = calcSentimentScore(quote.symbol, news)
      const technicalScore = calcTechnicalScore(quote)
      const momentumScore = calcMomentumScore(quote)
      const analystScore = calcAnalystScore(10, 3) // default 77% buy

      const scores = { sentiment: sentimentScore, technical: technicalScore, momentum: momentumScore, analyst: analystScore }
      const composite = Math.round(sentimentScore * 0.3 + technicalScore * 0.25 + momentumScore * 0.25 + analystScore * 0.2)

      const upside = quote.price > 0 && quote.week52High > 0 ? ((quote.week52High * 0.95 - quote.price) / quote.price) * 100 : 0

      return {
        symbol: quote.symbol,
        name: quote.name,
        price: quote.price,
        action: actionFromScore(composite),
        confidence: composite,
        targetPrice: +(quote.price * (1 + upside / 100)).toFixed(2),
        upside: +upside.toFixed(1),
        scores,
        reasons: buildReasons(scores, quote, news),
        risk: riskFromVolatility(quote),
        newsCount: news.filter(n => n.relatedStocks?.includes(quote.symbol)).length,
      } satisfies Recommendation
    })
    .sort((a, b) => b.confidence - a.confidence)
}

const validActions = ['STRONG_BUY', 'BUY', 'HOLD', 'SELL', 'STRONG_SELL'] as const
const validRisks = ['LOW', 'MEDIUM', 'HIGH'] as const

function clampScore(value: unknown, fallback = 50): number {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.max(0, Math.min(100, Math.round(n)))
}

export async function getAIRecommendations(quotes: Quote[], news: NewsItem[]): Promise<Recommendation[]> {
  const fallback = generateRecommendations(quotes.length ? quotes : DEMO_QUOTES, news)
  try {
    const res = await fetch('/api/ai-recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quotes, news }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const items = Array.isArray(data.recommendations) ? data.recommendations : []
    const quoteMap = new Map(quotes.map(q => [q.symbol, q]))
    const fallbackMap = new Map(fallback.map(r => [r.symbol, r]))

    return items
      .map((item: any) => {
        const quote = quoteMap.get(item.symbol)
        const local = fallbackMap.get(item.symbol)
        if (!quote || !local) return null
        const action = validActions.includes(item.action) ? item.action : local.action
        const risk = validRisks.includes(item.risk) ? item.risk : local.risk
        return {
          ...local,
          action,
          confidence: clampScore(item.confidence, local.confidence),
          targetPrice: Number.isFinite(Number(item.targetPrice)) ? Number(item.targetPrice) : local.targetPrice,
          upside: Number.isFinite(Number(item.upside)) ? Number(item.upside) : local.upside,
          scores: {
            sentiment: clampScore(item.scores?.sentiment, local.scores.sentiment),
            technical: clampScore(item.scores?.technical, local.scores.technical),
            momentum: clampScore(item.scores?.momentum, local.scores.momentum),
            analyst: clampScore(item.scores?.analyst, local.scores.analyst),
          },
          reasons: Array.isArray(item.reasons) && item.reasons.length ? item.reasons.slice(0, 4).map(String) : local.reasons,
          risk,
        } satisfies Recommendation
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.confidence - a.confidence) as Recommendation[]
  } catch {
    return fallback
  }
}

export function getTopPicks(quotes: Quote[], news: NewsItem[], limit = 6): Recommendation[] {
  return generateRecommendations(quotes.length ? quotes : DEMO_QUOTES, news)
    .filter(r => r.action === 'BUY' || r.action === 'STRONG_BUY')
    .slice(0, limit)
}
