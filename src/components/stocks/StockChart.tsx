import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { Candle, Timeframe } from '../../types'
import { formatPrice } from '../../utils/formatters'
import { format } from 'date-fns'

const TIMEFRAMES: Timeframe[] = ['1D', '1W', '1M', '3M', '6M', '1Y']

interface Props {
  candles: Candle[]
  symbol: string
  currentPrice: number
  change: number
}

export default function StockChart({ candles, symbol, currentPrice, change }: Props) {
  const [tf, setTf] = useState<Timeframe>('3M')
  const up = change >= 0

  const filtered = candles.slice(
    tf === '1D' ? -1 : tf === '1W' ? -7 : tf === '1M' ? -30 : tf === '3M' ? -90 : tf === '6M' ? -180 : 0
  )

  const data = filtered.map(c => ({
    time: c.time,
    price: c.close,
    volume: c.volume,
  }))

  const minPrice = Math.min(...data.map(d => d.price)) * 0.998
  const maxPrice = Math.max(...data.map(d => d.price)) * 1.002
  const firstPrice = data[0]?.price ?? currentPrice

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="bg-bg-card border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
        <div className="text-gray-400">{format(new Date(d.time), 'MMM d, yyyy')}</div>
        <div className="font-mono font-bold text-white">{formatPrice(d.price)}</div>
        <div className={d.price >= firstPrice ? 'text-up' : 'text-down'}>
          {d.price >= firstPrice ? '+' : ''}{((d.price - firstPrice) / firstPrice * 100).toFixed(2)}%
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-card border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-mono font-bold text-2xl text-white">{formatPrice(currentPrice)}</span>
          <span className={`ml-3 text-sm font-mono ${up ? 'text-up' : 'text-down'}`}>
            {up ? '+' : ''}{change.toFixed(2)}%
          </span>
        </div>
        <div className="flex gap-1">
          {TIMEFRAMES.map(t => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={`text-xs px-2.5 py-1 rounded-md transition-all ${tf === t ? 'bg-accent-blue text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={up ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
              <stop offset="95%" stopColor={up ? '#10b981' : '#ef4444'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tickFormatter={v => format(new Date(v), tf === '1D' ? 'HH:mm' : 'MMM d')}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            tickFormatter={v => `$${v.toFixed(0)}`}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={firstPrice} stroke="#4b5563" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="price"
            stroke={up ? '#10b981' : '#ef4444'}
            strokeWidth={1.5}
            fill={`url(#grad-${symbol})`}
            dot={false}
            activeDot={{ r: 4, fill: up ? '#10b981' : '#ef4444' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
