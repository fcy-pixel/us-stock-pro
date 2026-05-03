// Cloudflare Pages Function — proxy for all /api/* routes
// Handles: /api/news, /api/quote, /api/quotes, /api/indices,
//          /api/candles, /api/search, /api/sectors, /api/analyst,
//          /api/company-news

interface Env {
  FINNHUB_API_KEY: string
  QWEN_API_KEY?: string
  // Optional: ALPHA_VANTAGE_KEY, NEWS_API_KEY
}

const FINNHUB = 'https://finnhub.io/api/v1'
const QWEN = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions'

async function finnhub(path: string, apiKey: string) {
  const url = `${FINNHUB}${path}${path.includes('?') ? '&' : '?'}token=${apiKey}`
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
  if (!res.ok) throw new Error(`Finnhub error ${res.status}`)
  return res.json()
}

async function qwen(messages: unknown[], apiKey: string) {
  const res = await fetch(QWEN, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages,
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  })
  if (!res.ok) throw new Error(`Qwen error ${res.status}`)
  return res.json()
}

const num = (value: unknown, fallback = 0) => {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : fallback
}

function metricValue(metric: any, keys: string[]) {
  for (const key of keys) {
    const value = metric?.metric?.[key]
    if (value !== undefined && value !== null) return num(value)
  }
  return 0
}

async function getQuoteBundle(symbol: string, api: (path: string) => Promise<any>) {
  const [quoteRes, profileRes, metricRes] = await Promise.allSettled([
    api(`/quote?symbol=${symbol}`),
    api(`/stock/profile2?symbol=${symbol}`),
    api(`/stock/metric?symbol=${symbol}&metric=all`),
  ])
  const q = quoteRes.status === 'fulfilled' ? quoteRes.value : {}
  const profile = profileRes.status === 'fulfilled' ? profileRes.value : {}
  const metric = metricRes.status === 'fulfilled' ? metricRes.value : {}

  const price = num(q.c || q.pc)
  const quoteHigh = Math.max(num(q.h), price)
  const quoteLow = Math.min(num(q.l) || price, price)
  const metricHigh = metricValue(metric, ['52WeekHigh'])
  const metricLow = metricValue(metric, ['52WeekLow'])
  let week52High = metricHigh > 0 && (!price || metricHigh < price * 5) ? metricHigh : quoteHigh
  let week52Low = metricLow > 0 && (!price || metricLow < price * 5) ? metricLow : quoteLow
  if (week52Low > week52High) {
    week52High = quoteHigh
    week52Low = quoteLow
  }

  return {
    symbol,
    name: profile.name ?? symbol,
    price,
    change: num(q.d),
    changePercent: num(q.dp),
    open: num(q.o),
    high: num(q.h),
    low: num(q.l),
    prevClose: num(q.pc),
    volume: metricValue(metric, ['10DayAverageTradingVolume']) * 1_000_000,
    avgVolume: metricValue(metric, ['3MonthAverageTradingVolume', '10DayAverageTradingVolume']) * 1_000_000,
    marketCap: num(profile.marketCapitalization) * 1_000_000,
    pe: metricValue(metric, ['peBasicExclExtraTTM', 'peNormalizedAnnual', 'peTTM']),
    eps: metricValue(metric, ['epsBasicExclExtraItemsTTM', 'epsNormalizedAnnual', 'epsTTM']),
    week52High,
    week52Low,
    sector: profile.finnhubIndustry ?? 'Unknown',
    industry: profile.finnhubIndustry ?? 'Unknown',
    logo: profile.logo ?? undefined,
  }
}

function cors(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=30',
    },
  })
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, params } = context
  const env: Env = (context.env ?? {}) as Env

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } })
  }

  if (!env.FINNHUB_API_KEY) {
    return cors({ error: 'FINNHUB_API_KEY not configured — using demo data' }, 503)
  }

  const api = (path: string) => finnhub(path, env.FINNHUB_API_KEY)

  const url = new URL(request.url)
  const path = url.pathname.replace(/^\/api/, '')
  const sp = url.searchParams

  try {
    // ── Market status ─────────────────────────────────────────────────
    if (path === '/market-status') {
      const raw: any = await api('/stock/market-status?exchange=US')
      return cors({
        isOpen: !!raw.isOpen,
        session: raw.session ?? (raw.isOpen ? 'regular' : 'closed'),
        timezone: raw.timezone ?? 'America/New_York',
        holiday: raw.holiday ?? null,
        t: raw.t ?? null,
      })
    }

    // ── Qwen AI recommendations ───────────────────────────────────────
    if (path === '/ai-recommendations') {
      if (request.method !== 'POST') return cors({ error: 'Method not allowed' }, 405)
      if (!env.QWEN_API_KEY) return cors({ error: 'QWEN_API_KEY not configured' }, 503)

      const body = await request.json().catch(() => ({})) as any
      const quotes = Array.isArray(body.quotes) ? body.quotes.slice(0, 15) : []
      const news = Array.isArray(body.news) ? body.news.slice(0, 12) : []
      const payload = {
        quotes: quotes.map((q: any) => ({
          symbol: q.symbol,
          name: q.name,
          price: q.price,
          changePercent: q.changePercent,
          marketCap: q.marketCap,
          pe: q.pe,
          eps: q.eps,
          week52High: q.week52High,
          week52Low: q.week52Low,
          sector: q.sector,
        })),
        news: news.map((n: any) => ({ headline: n.headline, summary: n.summary, sentiment: n.sentiment, relatedStocks: n.relatedStocks })),
      }
      const result = await qwen([
        { role: 'system', content: '你是專業美股投資分析助手。只輸出 JSON，使用繁體中文。不要提供保證收益，不要假裝知道缺失資料。JSON 格式：{"recommendations":[{"symbol":"AAPL","action":"BUY","confidence":70,"targetPrice":190,"upside":8.5,"scores":{"sentiment":60,"technical":55,"momentum":70,"analyst":65},"reasons":["..."],"risk":"MEDIUM"}]}' },
        { role: 'user', content: `根據以下行情與新聞，為每隻股票給出投資評級。action 只可用 STRONG_BUY, BUY, HOLD, SELL, STRONG_SELL；risk 只可用 LOW, MEDIUM, HIGH。資料：${JSON.stringify(payload)}` },
      ], env.QWEN_API_KEY)
      const content = result?.choices?.[0]?.message?.content ?? '{}'
      const parsed = JSON.parse(content)
      return cors(parsed)
    }

    // ── News ──────────────────────────────────────────────────────────
    if (path === '/news') {
      const category = sp.get('category') ?? 'general'
      const raw: any[] = await api(`/news?category=${category}`)
      const news = raw.slice(0, 20).map((n: any) => ({
        id: String(n.id),
        headline: n.headline,
        summary: n.summary,
        url: n.url,
        datetime: n.datetime,
        source: n.source,
        image: n.image ?? null,
        category,
        sentiment: 'neutral',
        sentimentScore: 0,
        relatedStocks: [],
      }))
      return cors(news)
    }

    // ── Company news ──────────────────────────────────────────────────
    if (path === '/company-news') {
      const symbol = sp.get('symbol')
      const from = sp.get('from')
      const to = sp.get('to')
      if (!symbol || !from || !to) return cors({ error: 'Missing params' }, 400)
      const raw: any[] = await api(`/company-news?symbol=${symbol}&from=${from}&to=${to}`)
      return cors(raw.slice(0, 15).map((n: any) => ({
        id: String(n.id),
        headline: n.headline,
        summary: n.summary,
        url: n.url,
        datetime: n.datetime,
        source: n.source,
        image: n.image ?? null,
        category: 'company',
        sentiment: 'neutral',
        sentimentScore: 0,
        relatedStocks: [symbol],
      })))
    }

    // ── Single quote ──────────────────────────────────────────────────
    if (path === '/quote') {
      const symbol = sp.get('symbol')
      if (!symbol) return cors({ error: 'Missing symbol' }, 400)
      return cors(await getQuoteBundle(symbol, api))
    }

    // ── Multiple quotes ───────────────────────────────────────────────
    if (path === '/quotes') {
      const symbols = (sp.get('symbols') ?? '').split(',').filter(Boolean).slice(0, 30)
      const results = await Promise.allSettled(
        symbols.map(sym => getQuoteBundle(sym, api))
      )
      return cors(results.filter(r => r.status === 'fulfilled').map((r: any) => r.value))
    }

    // ── Market indices ────────────────────────────────────────────────
    if (path === '/indices') {
      const INDEX_SYMBOLS = ['SPY', 'QQQ', 'DIA', 'IWM', 'VIX']
      const INDEX_NAMES: Record<string, string> = { SPY: 'S&P 500', QQQ: 'NASDAQ 100', DIA: 'Dow Jones', IWM: 'Russell 2000', VIX: 'VIX' }
      const results = await Promise.allSettled(INDEX_SYMBOLS.map(s => api(`/quote?symbol=${s}`)))
      return cors(
        results.map((r, i) => {
          const sym = INDEX_SYMBOLS[i]
          const q = r.status === 'fulfilled' ? (r.value as any) : { c: 0, d: 0, dp: 0 }
          return { symbol: sym, name: INDEX_NAMES[sym], price: q.c ?? 0, change: q.d ?? 0, changePercent: q.dp ?? 0 }
        })
      )
    }

    // ── Candles ───────────────────────────────────────────────────────
    if (path === '/candles') {
      const symbol = sp.get('symbol')
      const resolution = sp.get('resolution') ?? 'D'
      const from = sp.get('from')
      const to = sp.get('to')
      if (!symbol || !from || !to) return cors({ error: 'Missing params' }, 400)
      const raw: any = await api(`/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`)
      if (raw.s !== 'ok') return cors([], 200)
      const candles = (raw.t as number[]).map((t: number, i: number) => ({
        time: t * 1000,
        open: raw.o[i],
        high: raw.h[i],
        low: raw.l[i],
        close: raw.c[i],
        volume: raw.v[i],
      }))
      return cors(candles)
    }

    // ── Symbol search ─────────────────────────────────────────────────
    if (path === '/search') {
      const q = sp.get('q')
      if (!q) return cors([])
      const raw: any = await api(`/search?q=${encodeURIComponent(q)}`)
      return cors((raw.result ?? []).slice(0, 10).map((r: any) => ({
        symbol: r.symbol,
        name: r.description,
        type: r.type,
      })))
    }

    return cors({ error: 'Not found' }, 404)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal error'
    return cors({ error: message }, 500)
  }
}
