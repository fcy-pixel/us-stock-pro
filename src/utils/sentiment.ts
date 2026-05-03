const POSITIVE_WORDS = [
  'surge', 'rally', 'soar', 'beat', 'record', 'growth', 'strong', 'upgrade',
  'buy', 'bullish', 'outperform', 'exceed', 'profit', 'revenue growth', 'boost',
  'expansion', 'breakthrough', 'innovation', 'partnership', 'acquisition win',
  'raised guidance', 'dividend increase', 'buyback', 'market share gain',
  'positive', 'optimistic', 'momentum', 'milestone', 'approval', 'launch',
  'demand surge', 'supply chain improve', 'cost cut', 'margin expand',
]

const NEGATIVE_WORDS = [
  'crash', 'fall', 'plunge', 'miss', 'loss', 'weak', 'downgrade', 'sell',
  'bearish', 'underperform', 'decline', 'warning', 'risk', 'investigation',
  'lawsuit', 'recall', 'layoff', 'restructure', 'debt', 'default', 'fraud',
  'fine', 'penalty', 'supply chain issue', 'demand weakness', 'guidance cut',
  'earnings miss', 'revenue decline', 'margin compression', 'competition threat',
  'regulation', 'ban', 'sanction', 'tariff', 'inflation pressure',
]

export function analyzeSentiment(text: string): { sentiment: 'positive' | 'negative' | 'neutral'; score: number } {
  const lower = text.toLowerCase()
  let score = 0

  for (const word of POSITIVE_WORDS) {
    if (lower.includes(word)) score += 1
  }
  for (const word of NEGATIVE_WORDS) {
    if (lower.includes(word)) score -= 1
  }

  const normalized = Math.max(-1, Math.min(1, score / 3))

  if (normalized > 0.15) return { sentiment: 'positive', score: normalized }
  if (normalized < -0.15) return { sentiment: 'negative', score: normalized }
  return { sentiment: 'neutral', score: normalized }
}
