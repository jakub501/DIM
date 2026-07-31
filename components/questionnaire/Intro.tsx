import { Button } from '@/components/ui/Button'

// Signature schematic: the self's decision-making branching into five
// institutions (a separation-of-powers motif). Static, decorative-but-true.
function Schematic() {
  return (
    <div className="my-8">
      <svg
        viewBox="0 0 320 92"
        className="w-full overflow-visible"
        role="img"
        aria-label="Schéma: rozhodovanie sa vetví na päť inštitúcií"
      >
        <text
          x="160"
          y="8"
          textAnchor="middle"
          className="fill-faint font-mono"
          style={{ fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase' }}
        >
          rozhodovanie
        </text>
        <circle cx="160" cy="20" r="5" fill="var(--accent)" />
        <path
          d="M160 25 L160 40 M20 40 L300 40 M20 40 L20 52 M90 40 L90 52 M160 40 L160 52 M230 40 L230 52 M300 40 L300 52"
          stroke="var(--accent-line)"
          strokeWidth="1.5"
          fill="none"
        />
        {[20, 90, 160, 230, 300].map((x) => (
          <circle key={x} cx={x} cy="58" r="6" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
        ))}
        {[
          [20, 'Pluralita'],
          [90, 'Exekutíva'],
          [160, 'Slobody'],
          [230, 'Médiá'],
          [300, 'Právny št.'],
        ].map(([x, label]) => (
          <text
            key={label}
            x={x as number}
            y="80"
            textAnchor="middle"
            className="fill-muted font-mono"
            style={{ fontSize: 8.5, letterSpacing: '0.04em' }}
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  )
}

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="step-enter mx-auto max-w-prose px-5 py-14 sm:py-20">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent">
        Demokratický index myslenia
      </p>
      <h1 className="mt-3 font-display text-[2.1rem] font-extrabold leading-none tracking-tighter2 sm:text-[2.5rem]">
        Ako je usporiadané tvoje{' '}
        <span className="font-serif font-medium italic text-accent">vnútorné rozhodovanie</span>
      </h1>

      <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
        Päť inštitúcií v tvojej hlave. Nemeriame, aký si — sledujeme, čo sa za posledný mesiac
        dialo.
      </p>

      <Schematic />

      <p className="text-[0.9rem] leading-relaxed text-muted">
        Pri každej vete odhadni, koľkokrát sa ti to za posledný mesiac stalo.
      </p>

      <div className="mt-8 flex items-center gap-5">
        <Button onClick={onStart}>
          Začať <span aria-hidden>→</span>
        </Button>
        <span className="font-mono text-sm text-faint">≈ 12–15 min</span>
      </div>

      {/* TODO: privacy copy — the spec's "Výsledok sa nikam neposiela a nikto ho neuvidí."
          sentence is intentionally withheld until the data-collection decision is made.
          Whatever ships here must match what the app actually does. */}
      <p className="mt-8 border-t border-line pt-6 text-[0.84rem] leading-relaxed text-muted">
        Nie je to psychologický test ani diagnostika. Neprešiel validáciou a nehovorí nič
        o tvojom duševnom zdraví.
      </p>
    </div>
  )
}
