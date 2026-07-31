import type { Tension } from '@/lib/result'
import { TENSIONS_INTRO } from '@/lib/content'

// Contradictory own-answers, placed side by side as something to sit with.
export function Tensions({ tensions }: { tensions: Tension[] }) {
  if (tensions.length === 0) return null
  return (
    <section aria-labelledby="tensions-h">
      <p className="mb-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-faint">
        Napätia
      </p>
      <h2 id="tensions-h" className="font-display text-lg font-extrabold tracking-tightish">
        Kde tvoje odpovede idú proti sebe
      </h2>
      <p className="mt-1 text-[0.9rem] leading-relaxed text-muted">{TENSIONS_INTRO}</p>

      <div className="mt-5 space-y-4">
        {tensions.map((t) => (
          <div
            key={t.dimension}
            className="grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-2"
          >
            <p className="bg-surface p-4 text-[0.95rem] leading-snug">{t.a.text}</p>
            <p className="bg-surface p-4 text-[0.95rem] leading-snug">{t.b.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
