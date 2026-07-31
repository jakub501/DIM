import type { Dimension } from '@/lib/types'
import type { DimensionResult } from '@/lib/result'
import { DIMENSIONS } from '@/lib/content'

// "Shape of the profile": a pentagon of each institution's functionality.
// Closer to the edge = more functional. The narrowest vertex is marked ochre.
export function OverviewRadar({
  dimensions,
  narrowest,
}: {
  dimensions: DimensionResult[]
  narrowest: Dimension
}) {
  const byId = new Map(dimensions.map((d) => [d.dimension, d]))
  const order = DIMENSIONS.map((m) => byId.get(m.id)).filter(Boolean) as DimensionResult[]
  const n = order.length

  const cx = 110
  const cy = 100
  const R = 66

  const pt = (i: number, r: number): [number, number] => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }
  const clamp = (f: number) => Math.max(0, Math.min(10, f))

  const rings = [0.5, 1].map((k) => order.map((_, i) => pt(i, R * k).join(',')).join(' '))
  const shape = order.map((d, i) => pt(i, R * (clamp(d.f) / 10)).join(',')).join(' ')

  return (
    <div className="rounded-2xl border border-line bg-panel px-4 pb-3 pt-5">
      <svg
        viewBox="0 0 220 200"
        className="block w-full overflow-visible"
        role="img"
        aria-label="Tvar profilu — funkčnosť piatich inštitúcií"
      >
        {rings.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="var(--line)" strokeWidth="1" />
        ))}
        {order.map((_, i) => {
          const [x, y] = pt(i, R)
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line)" strokeWidth="1" />
        })}
        <polygon
          points={shape}
          fill="rgba(42,70,232,0.14)"
          stroke="var(--accent)"
          strokeWidth="2"
          style={{ filter: 'drop-shadow(0 0 10px rgba(42,70,232,0.28))' }}
        />
        {order.map((d, i) => {
          const [x, y] = pt(i, R * (clamp(d.f) / 10))
          const low = d.dimension === narrowest
          return (
            <circle key={d.dimension} cx={x} cy={y} r={3} fill={low ? 'var(--spark)' : 'var(--accent)'} />
          )
        })}
        {order.map((d, i) => {
          const [lx, ly] = pt(i, R + 16)
          const low = d.dimension === narrowest
          const anchor = Math.abs(lx - cx) < 6 ? 'middle' : lx < cx ? 'end' : 'start'
          return (
            <text
              key={d.dimension}
              x={lx}
              y={ly + 3}
              textAnchor={anchor}
              className="font-mono"
              style={{ fontSize: 9, letterSpacing: '0.06em', fontWeight: low ? 700 : 400 }}
              fill={low ? 'var(--spark-deep)' : 'var(--muted)'}
            >
              {d.dimension}
            </text>
          )
        })}
      </svg>
      <p className="mt-1 text-center font-mono text-[0.66rem] text-faint">
        Bližšie k okraju = funkčnejšie. Najužšia je označená okrovou.
      </p>
    </div>
  )
}
