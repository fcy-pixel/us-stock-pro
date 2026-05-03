import IndexCard from './IndexCard'
import type { MarketIndex } from '../../types'

export default function MarketOverview({ indices }: { indices: MarketIndex[] }) {
  return (
    <section>
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">市場概覽</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {indices.map(idx => <IndexCard key={idx.symbol} index={idx} />)}
      </div>
    </section>
  )
}
