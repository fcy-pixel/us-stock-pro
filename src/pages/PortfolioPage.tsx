import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Briefcase, Plus, Trash2, TrendingUp, TrendingDown, X } from 'lucide-react'
import { useAppStore } from '../store'
import { formatPrice, formatPercent, formatMarketCap } from '../utils/formatters'
import { DEMO_QUOTES } from '../utils/demoData'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899']

export default function PortfolioPage() {
  const navigate = useNavigate()
  const { portfolio, addHolding, removeHolding } = useAppStore()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ symbol: '', shares: '', avgCost: '' })

  const totalValue = portfolio.reduce((s, h) => s + h.value, 0)
  const totalCost = portfolio.reduce((s, h) => s + h.costBasis, 0)
  const totalGain = totalValue - totalCost
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0
  const dayChange = portfolio.reduce((s, h) => s + h.dayChange, 0)

  const pieData = portfolio.map((h, i) => ({
    name: h.symbol,
    value: h.value,
    color: COLORS[i % COLORS.length],
  }))

  const handleAdd = () => {
    const demo = DEMO_QUOTES.find(q => q.symbol === form.symbol.toUpperCase())
    const price = demo?.price ?? 100
    addHolding({
      symbol: form.symbol.toUpperCase(),
      name: demo?.name ?? form.symbol.toUpperCase(),
      shares: parseFloat(form.shares),
      avgCost: parseFloat(form.avgCost),
      currentPrice: price,
      sector: demo?.sector ?? 'Unknown',
      addedAt: new Date().toISOString().split('T')[0],
    })
    setForm({ symbol: '', shares: '', avgCost: '' })
    setShowAdd(false)
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">投資組合</h1>
          <p className="text-sm text-gray-400 mt-0.5">追蹤美股持股與總體表現</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg text-sm transition-all"
        >
          <Plus size={14} /> 新增持股
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: '總市值', value: formatMarketCap(totalValue).replace('B', '').replace('M', ''), sub: formatPrice(totalValue), color: 'text-white' },
          { label: '總損益', value: formatPrice(Math.abs(totalGain)), sub: formatPercent(totalGainPct), color: totalGain >= 0 ? 'text-up' : 'text-down' },
          { label: '今日損益', value: formatPrice(Math.abs(dayChange)), sub: dayChange >= 0 ? '+今日' : '-今日', color: dayChange >= 0 ? 'text-up' : 'text-down' },
          { label: '持股數', value: String(portfolio.length), sub: '個投資位置', color: 'text-accent-blue' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-bg-card border border-white/5 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-2">{label}</div>
            <div className={`font-bold text-xl ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation pie */}
        <div className="bg-bg-card border border-white/5 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">配置分析</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatPrice(v)} contentStyle={{ background: '#141d30', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="font-mono font-semibold text-white">{d.name}</span>
                </div>
                <span className="text-gray-400">{(totalValue > 0 ? (d.value / totalValue) * 100 : 0).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Holdings table */}
        <div className="lg:col-span-2 bg-bg-card border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 text-xs text-gray-500 font-medium uppercase tracking-wider grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4">
            <span>股票</span><span>價格</span><span>損益</span><span className="hidden sm:block">市值</span><span></span>
          </div>
          {portfolio.map(h => (
            <div
              key={h.symbol}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center border-b border-white/5 last:border-0 hover:bg-bg-hover cursor-pointer transition-all"
              onClick={() => navigate(`/stocks/${h.symbol}`)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-accent-blue">{h.symbol.slice(0, 2)}</span>
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">{h.symbol}</div>
                  <div className="text-xs text-gray-500">{h.shares} 股 @ {formatPrice(h.avgCost)}</div>
                </div>
              </div>
              <div>
                <div className="font-mono text-sm text-white">{formatPrice(h.currentPrice)}</div>
                <div className={`text-xs font-mono ${h.dayChangePercent >= 0 ? 'text-up' : 'text-down'}`}>
                  {formatPercent(h.dayChangePercent)} 今日
                </div>
              </div>
              <div>
                <div className={`font-mono text-sm ${h.gainLoss >= 0 ? 'text-up' : 'text-down'} flex items-center gap-1`}>
                  {h.gainLoss >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {formatPrice(Math.abs(h.gainLoss))}
                </div>
                <div className={`text-xs font-mono ${h.gainLossPercent >= 0 ? 'text-up' : 'text-down'}`}>
                  {formatPercent(h.gainLossPercent)}
                </div>
              </div>
              <div className="font-mono text-sm text-white hidden sm:block">{formatPrice(h.value)}</div>
              <button onClick={e => { e.stopPropagation(); removeHolding(h.symbol) }} className="p-1 text-gray-600 hover:text-down transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add holding modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white">新增持股</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: '股票代碼', key: 'symbol', placeholder: '例如 AAPL' },
                { label: '股數', key: 'shares', placeholder: '例如 10' },
                { label: '平均成本 (USD)', key: 'avgCost', placeholder: '例如 185.50' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs text-gray-400 mb-1 block">{label}</label>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-bg-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-accent-blue/60 transition-colors"
                  />
                </div>
              ))}
              <button
                onClick={handleAdd}
                disabled={!form.symbol || !form.shares || !form.avgCost}
                className="w-full py-2.5 bg-accent-blue hover:bg-accent-blue/80 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-all"
              >
                加入投資組合
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
