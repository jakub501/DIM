import type { ItemAnswer } from '@/lib/result'
import { SECOND_PASS_QUESTION } from '@/lib/content'

// The person's own strongest answers, handed back with a single question.
export function SecondPass({ items }: { items: ItemAnswer[] }) {
  if (items.length === 0) return null
  return (
    <section aria-labelledby="secondpass-h">
      <p className="mb-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-faint">
        Druhý prechod
      </p>
      <h2 id="secondpass-h" className="font-display text-lg font-extrabold tracking-tightish">
        Tvoje najsilnejšie odpovede
      </h2>
      <ul className="mt-5 space-y-3">
        {items.map((it) => (
          <li key={it.id} className="flex gap-3 text-[0.98rem] leading-snug">
            <span aria-hidden className="mt-0.5 shrink-0 text-spark-deep">
              ★
            </span>
            <span>{it.text}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 font-serif text-lg italic leading-snug">{SECOND_PASS_QUESTION}</p>
    </section>
  )
}
