// Cloudflare Pages Function — proxy for all /api/* routes
// Handles: /api/news, /api/quote, /api/quotes, /api/indices,
//          /api/candles, /api/search, /api/sectors, /api/analyst,
//          /api/company-news

interface Env {
  FINNHUB_API_KEY: string
  // Optional: ALPHA_VANTAGE_KEY, NEWS_API_KEY
}

const FINNHUB = 'https://finnhub.io/api/v1'

async function finnhub(path: string, apiKey: string) {
  const url = `${FINNHUB}${path}${path.includes('?') ? '&' : '?'}token=${apiKey}`
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
  if (!res.ok) throw new Error(`Finnhub error ${res.status}`)
  return res.json()
}

function cors(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=30',
    },
  })
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, params } = context
  const env: Env = (context.env ?? {}) as Env

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET' } })
  }

  if (!env.FINNHUB_API_KEY) {
    return cors({ error: 'FINNHUB_API_KEY not configured — using demo data' }, 503)
  }

  const api = (path: string) => finnhub(path, env.FINNHUB_API_KEY)

  const url = new URL(request.url)
  const path = url.pathname.replace(/^\/api/, '')
  const sp = url.searchParams

  try {
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
      const [q, profile] = await Promise.all([
        api(`/quote?symbol=${symbol}`),
        api(`/stock/profile2?symbol=${symbol}`),
      ])
      return cors({
        symbol,
        name: profile.name ?? symbol,
        price: q.c ?? 0,
        change: q.d ?? 0,
        changePercent: q.dp ?? 0,
        open: q.o ?? 0,
        high: q.h ?? 0,
        low: q.l ?? 0,
        prevClose: q.pc ?? 0,
        volume: 0,
        avgVolume: 0,
        marketCap: (profile.marketCapitalization ?? 0) * 1_000_000,
        pe: profile.peNormalizedAnnual ?? 0,
        eps: 0,
        week52High: q['52WeekHigh'] ?? 0,
        week52Low: q['52WeekLow'] ?? 0,
        sector: profile.finnhubIndustry ?? 'Unknown',
        industry: profile.finnhubIndustry ?? 'Unknown',
      })
    }

    // ── Multiple quotes ───────────────────────────────────────────────
    if (path === '/quotes') {
      const symbols = (sp.get('symbols') ?? '').split(',').filter(Boolean).slice(0, 30)
      const results = await Promise.allSettled(
        symbols.map(async sym => {
          const [q, p] = await Promise.all([
            api(`/quote?symbol=${sym}`),
            api(`/stock/profile2?symbol=${sym}`),
          ])
          return {
            symbol: sym,
            name: p.name ?? sym,
            price: q.c ?? 0,
            change: q.d ?? 0,
            changePercent: q.dp ?? 0,
            open: q.o ?? 0,
            high: q.h ?? 0,
            low: q.l ?? 0,
            prevClose: q.pc ?? 0,
            volume: 0,
            avgVolume: 0,
            marketCap: (p.marketCapitalization ?? 0) * 1_000_000,
            pe: p.peNormalizedAnnual ?? 0,
            eps: 0,
            week52High: 0,
            week52Low: 0,
            sector: p.finnhubIndustry ?? 'Unknown',
            industry: p.finnhubIndustry ?? 'Unknown',
          }
        })
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
