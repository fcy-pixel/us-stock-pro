import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import NewsPage from './pages/NewsPage'
import StocksPage from './pages/StocksPage'
import WatchlistPage from './pages/WatchlistPage'
import PortfolioPage from './pages/PortfolioPage'
import AIPicksPage from './pages/AIPicksPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="stocks" element={<StocksPage />} />
            <Route path="stocks/:symbol" element={<StocksPage />} />
            <Route path="watchlist" element={<WatchlistPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="ai-picks" element={<AIPicksPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
