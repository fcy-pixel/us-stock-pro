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
  const volatility = range / quote.week52Low
  if (volatility < 0.4) return 'LOW'
  if (volatility < 0.8) return 'MEDIUM'
  return 'HIGH'
}

function buildReasons(scores: Recommendation['scores'], quote: Quote, news: NewsItem[]): string[] {
  const reasons: string[] = []
  if (scores.sentiment > 70) reasons.push(`Positive news sentiment (${scores.sentiment}%)`)
  if (scores.sentiment < 35) reasons.push(`Negative news flow — ${news.filter(n => n.relatedStocks?.includes(quote.symbol) && n.sentiment === 'negative').length} negative articles`)
  if (scores.technical > 65) reasons.push('Technically oversold — potential mean reversion')
  if (scores.technical < 35) reasons.push('Near 52-week high — limited upside technically')
  if (scores.momentum > 65) reasons.push(`Strong price momentum: ${quote.changePercent > 0 ? '+' : ''}${quote.changePercent.toFixed(2)}% today`)
  if (scores.momentum < 35) reasons.push(`Weak momentum: ${quote.changePercent.toFixed(2)}% today`)
  if (scores.analyst > 65) reasons.push('Majority analyst consensus: BUY')
  if (scores.analyst < 35) reasons.push('Analyst consensus skews bearish')
  if (quote.pe > 0 && quote.pe < 20) reasons.push(`Attractive valuation: P/E ${quote.pe.toFixed(1)}x`)
  if (quote.pe > 60) reasons.push(`Rich valuation: P/E ${quote.pe.toFixed(1)}x — growth must justify premium`)
  return reasons.length ? reasons : ['Insufficient data for strong signal — neutral stance']
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

      const upside = ((quote.week52High * 0.95 - quote.price) / quote.price) * 100

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

export function getTopPicks(quotes: Quote[], news: NewsItem[], limit = 6): Recommendation[] {
  return generateRecommendations(quotes.length ? quotes : DEMO_QUOTES, news)
    .filter(r => r.action === 'BUY' || r.action === 'STRONG_BUY')
    .slice(0, limit)
}
