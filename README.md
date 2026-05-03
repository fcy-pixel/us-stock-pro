# StockPro — US Market Intelligence App

A professional, full-featured US stock market app with real-time data, AI-powered recommendations, and news sentiment analysis. Built with React + TypeScript, deployed to Cloudflare Pages.

## Features

| Feature | Description |
|---------|-------------|
| **Market Dashboard** | Live indices (S&P 500, NASDAQ, Dow Jones, Russell 2000, VIX) |
| **Sector Heatmap** | Color-coded sector performance with intensity mapping |
| **News & Signals** | Real-time financial news with AI sentiment analysis (bullish/bearish/neutral) |
| **Stock Correlation** | Automatically links news articles to relevant stock tickers |
| **AI Picks** | Multi-factor scoring: sentiment × technical × momentum × analyst consensus |
| **Stock Screener** | Filter stocks by sector, sort by change/volume/market cap |
| **Price Charts** | Interactive area charts with 1D/1W/1M/3M/6M/1Y timeframes |
| **Watchlist** | Persistent watchlist with price tracking |
| **Portfolio Tracker** | Track holdings with P&L, allocation pie chart, day change |
| **Stock Detail** | Key metrics: P/E, EPS, 52W range, volume, market cap |

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (custom dark theme)
- **Charts**: Recharts
- **State**: Zustand (with localStorage persistence)
- **Data Fetching**: TanStack Query (30s polling for live prices)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Backend**: Cloudflare Pages Functions (API proxy)
- **Hosting**: Cloudflare Pages

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/us-stock-pro
cd us-stock-pro
npm install
npm run dev
```

The app works with **demo data by default** — no API key needed to try it out.

## Live Data Setup

1. Get a free API key at [finnhub.io](https://finnhub.io) (60 calls/minute free)
2. Add it as an environment variable in Cloudflare Pages:
   - Dashboard → Your project → Settings → Environment variables
   - Add `FINNHUB_API_KEY` = your key
3. Redeploy

## Deploy to Cloudflare Pages

### One-time setup

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial StockPro app"
   git remote add origin https://github.com/YOUR_USERNAME/us-stock-pro.git
   git push -u origin main
   ```

2. In [Cloudflare Dashboard](https://dash.cloudflare.com):
   - Workers & Pages → Create → Pages → Connect to Git
   - Select your repo
   - Build command: `npm run build`
   - Output directory: `dist`
   - Add environment variable: `FINNHUB_API_KEY`

### Auto-deploy via GitHub Actions

Add these secrets to your GitHub repo (Settings → Secrets):

| Secret | Where to find |
|--------|--------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → Create Token (Pages permissions) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard URL: `dash.cloudflare.com/ACCOUNT_ID` |

Every push to `main` will automatically build and deploy.

## Project Structure

```
us-stock-pro/
├── src/
│   ├── components/
│   │   ├── layout/       # Header, Sidebar, Layout
│   │   ├── dashboard/    # MarketOverview, SectorHeatMap, TopMovers
│   │   ├── news/         # NewsCard
│   │   ├── stocks/       # StockCard, StockChart
│   │   ├── ai/           # AIRecommendationCard
│   │   └── common/       # Loading spinners
│   ├── pages/            # Dashboard, News, Stocks, Watchlist, Portfolio, AI Picks
│   ├── services/         # stockService, newsService, aiService
│   ├── store/            # Zustand store
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Formatters, sentiment, stock keywords, demo data
├── functions/
│   └── api/[[catchall]].ts   # Cloudflare Pages Function (API proxy)
├── public/
│   ├── _headers          # Security headers
│   └── _redirects        # SPA routing
└── wrangler.toml
```

## AI Recommendation Algorithm

The AI scoring combines four factors:

```
Final Score = Sentiment(30%) + Technical(25%) + Momentum(25%) + Analyst(20%)
```

- **Sentiment**: Counts positive/negative keywords in related news articles
- **Technical**: 52-week price position (oversold zone = buy signal)  
- **Momentum**: Today's price change percentage
- **Analyst**: Wall Street analyst buy/sell ratio

Scores 65+ → BUY, 80+ → STRONG BUY, 45-64 → HOLD, below 45 → SELL

## License

MIT
