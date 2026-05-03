import { useNavigate } from 'react-router-dom'
import { Cpu, TrendingUp, TrendingDown, Minus, Shield, AlertTriangle, Zap } from 'lucide-react'
import type { Recommendation } from '../../types'
import { formatPrice, formatPercent } from '../../utils/formatters'
import { cn } from '../../utils/formatters'

const ACTION_CONFIG = {
  STRONG_BUY: { label: '強力買入', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', icon: TrendingUp },
  BUY: { label: '買入', color: 'text-up', bg: 'bg-up/10 border-up/20', icon: TrendingUp },
  HOLD: { label: '持有', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: Minus },
  SELL: { label: '賣出', color: 'text-down', bg: 'bg-down/10 border-down/20', icon: TrendingDown },
  STRONG_SELL: { label: '強力賣出', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30', icon: TrendingDown },
}

const RISK_CONFIG = {
  LOW: { icon: Shield, color: 'text-up', label: '低風險' },
  MEDIUM: { icon: AlertTriangle, color: 'text-yellow-400', label: '中等風險' },
  HIGH: { icon: Zap, color: 'text-down', label: '高風險' },
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className={color}>{score}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export default function AIRecommendationCard({ rec }: { rec: Recommendation }) {
  const navigate = useNavigate()
  const cfg = ACTION_CONFIG[rec.action]
  const riskCfg = RISK_CONFIG[rec.risk]
  const RiskIcon = riskCfg.icon
  const ActionIcon = cfg.icon

  const scoreColor = (s: number) => s >= 65 ? 'text-up' : s >= 45 ? 'text-yellow-400' : 'text-down'

  return (
    <div
      className="bg-bg-card border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all cursor-pointer"
      onClick={() => navigate(`/stocks/${rec.symbol}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
            <Cpu size={18} className="text-accent-blue" />
          </div>
          <div>
            <div className="font-bold text-white">{rec.symbol}</div>
            <div className="text-xs text-gray-500 truncate max-w-[150px]">{rec.name}</div>
          </div>
        </div>
        <div className={cn('flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border', cfg.bg, cfg.color)}>
          <ActionIcon size={12} />
          {cfg.label}
        </div>
      </div>

      {/* Price & target */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500 mb-0.5">現價</div>
          <div className="font-mono font-bold text-white">{formatPrice(rec.price)}</div>
        </div>
        <div className="text-gray-600">→</div>
        <div>
          <div className="text-xs text-gray-500 mb-0.5">目標價</div>
          <div className="font-mono font-bold text-up">{formatPrice(rec.targetPrice)}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xs text-gray-500 mb-0.5">潛在升幅</div>
          <div className={`font-mono font-bold text-sm ${rec.upside >= 0 ? 'text-up' : 'text-down'}`}>
            {rec.upside >= 0 ? '+' : ''}{rec.upside.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* AI confidence */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-gray-400 flex items-center gap-1"><Cpu size={10} /> AI 信心指數</span>
          <span className={`font-bold ${scoreColor(rec.confidence)}`}>{rec.confidence}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${rec.confidence >= 65 ? 'bg-up' : rec.confidence >= 45 ? 'bg-yellow-400' : 'bg-down'}`}
            style={{ width: `${rec.confidence}%` }}
          />
        </div>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <ScoreBar label="情緒評分" score={rec.scores.sentiment} color={scoreColor(rec.scores.sentiment)} />
        <ScoreBar label="技術評分" score={rec.scores.technical} color={scoreColor(rec.scores.technical)} />
        <ScoreBar label="動量評分" score={rec.scores.momentum} color={scoreColor(rec.scores.momentum)} />
        <ScoreBar label="分析師評分" score={rec.scores.analyst} color={scoreColor(rec.scores.analyst)} />
      </div>

      {/* Reasons */}
      <div className="space-y-1 mb-3">
        {rec.reasons.slice(0, 3).map((r, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
            <span className="text-accent-blue mt-0.5">•</span>
            <span>{r}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
        <div className={`flex items-center gap-1 ${riskCfg.color}`}>
          <RiskIcon size={11} />
          {riskCfg.label}
        </div>
        <span className="text-gray-500">{rec.newsCount} 篇相關新聞</span>
      </div>
    </div>
  )
}
