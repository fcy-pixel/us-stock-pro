import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PortfolioHolding, WatchlistItem } from '../types'

interface AppState {
  // Watchlist
  watchlist: WatchlistItem[]
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  isWatched: (symbol: string) => boolean

  // Portfolio
  portfolio: PortfolioHolding[]
  addHolding: (holding: Omit<PortfolioHolding, 'value' | 'costBasis' | 'gainLoss' | 'gainLossPercent' | 'dayChange' | 'dayChangePercent'>) => void
  removeHolding: (symbol: string) => void
  updateHoldingPrice: (symbol: string, price: number, change: number) => void

  // UI
  activeSymbol: string | null
  setActiveSymbol: (symbol: string | null) => void
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Watchlist ────────────────────────────────
      watchlist: [
        { symbol: 'AAPL', addedAt: new Date().toISOString() },
        { symbol: 'NVDA', addedAt: new Date().toISOString() },
        { symbol: 'MSFT', addedAt: new Date().toISOString() },
        { symbol: 'TSLA', addedAt: new Date().toISOString() },
      ],
      addToWatchlist: (symbol) =>
        set(s => ({
          watchlist: s.watchlist.find(w => w.symbol === symbol)
            ? s.watchlist
            : [...s.watchlist, { symbol, addedAt: new Date().toISOString() }],
        })),
      removeFromWatchlist: (symbol) =>
        set(s => ({ watchlist: s.watchlist.filter(w => w.symbol !== symbol) })),
      isWatched: (symbol) => get().watchlist.some(w => w.symbol === symbol),

      // ── Portfolio ────────────────────────────────
      portfolio: [
        { symbol: 'AAPL', name: 'Apple Inc.', shares: 10, avgCost: 185.50, currentPrice: 228.87, value: 2288.70, costBasis: 1855.00, gainLoss: 433.70, gainLossPercent: 23.37, dayChange: 32.10, dayChangePercent: 1.42, sector: 'Technology', addedAt: '2024-01-15' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 5, avgCost: 98.20, currentPrice: 136.45, value: 682.25, costBasis: 491.00, gainLoss: 191.25, gainLossPercent: 38.95, dayChange: 21.60, dayChangePercent: 3.27, sector: 'Technology', addedAt: '2024-02-20' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 8, avgCost: 395.00, currentPrice: 441.32, value: 3530.56, costBasis: 3160.00, gainLoss: 370.56, gainLossPercent: 11.72, dayChange: 46.96, dayChangePercent: 1.35, sector: 'Technology', addedAt: '2024-03-10' },
      ],
      addHolding: (h) =>
        set(s => {
          const value = h.shares * h.currentPrice
          const costBasis = h.shares * h.avgCost
          const gainLoss = value - costBasis
          const gainLossPercent = (gainLoss / costBasis) * 100
          return {
            portfolio: [
              ...s.portfolio.filter(p => p.symbol !== h.symbol),
              { ...h, value, costBasis, gainLoss, gainLossPercent, dayChange: 0, dayChangePercent: 0 },
            ],
          }
        }),
      removeHolding: (symbol) =>
        set(s => ({ portfolio: s.portfolio.filter(p => p.symbol !== symbol) })),
      updateHoldingPrice: (symbol, price, change) =>
        set(s => ({
          portfolio: s.portfolio.map(p => {
            if (p.symbol !== symbol) return p
            const value = p.shares * price
            const gainLoss = value - p.costBasis
            return {
              ...p,
              currentPrice: price,
              value,
              gainLoss,
              gainLossPercent: (gainLoss / p.costBasis) * 100,
              dayChange: p.shares * change,
              dayChangePercent: (change / (price - change)) * 100,
            }
          }),
        })),

      // ── UI ───────────────────────────────────────
      activeSymbol: null,
      setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),
      sidebarOpen: true,
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    { name: 'stockpro-store' }
  )
)
