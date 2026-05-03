import type { SectorPerformance } from '../../types'
import { cn } from '../../utils/formatters'

export default function SectorHeatMap({ sectors }: { sectors: SectorPerformance[] }) {
  const max = Math.max(...sectors.map(s => Math.abs(s.changePercent)))

  return (
    <section>
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Sector Performance</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        {sectors
          .sort((a, b) => b.changePercent - a.changePercent)
          .map(s => {
            const intensity = Math.min(0.9, Math.abs(s.changePercent) / max)
            const up = s.changePercent >= 0
            return (
              <div
                key={s.sector}
                className={cn(
                  'rounded-lg p-3 flex flex-col gap-1 border transition-all hover:scale-105 cursor-default',
                  up ? 'border-up/20' : 'border-down/20'
                )}
                style={{
                  backgroundColor: up
                    ? `rgba(16, 185, 129, ${intensity * 0.25})`
                    : `rgba(239, 68, 68, ${intensity * 0.25})`,
                }}
              >
                <span className="text-[10px] text-gray-300 font-medium leading-tight">{s.sector}</span>
                <span className={`font-mono font-bold text-sm ${up ? 'text-up' : 'text-down'}`}>
                  {up ? '+' : ''}{s.changePercent.toFixed(2)}%
                </span>
                <span className="text-[10px] text-gray-500">{s.topStock}</span>
              </div>
            )
          })}
      </div>
    </section>
  )
}
