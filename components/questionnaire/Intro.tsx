import { Button } from '@/components/ui/Button'

const STROKE = 'var(--accent)'
const FILL = 'var(--surface)'
const SW = 1.6

// Glyphs on a standard 24×24 grid, round joins/caps throughout for a
// consistent, professional icon-set feel. Closed shapes use FILL as a
// knockout against the tinted badge behind them.
function InstitutionGlyph({ id }: { id: 'plu' | 'exe' | 'obc' | 'med' | 'pra' }) {
  switch (id) {
    case 'plu':
      return (
        <g fill={FILL} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round">
          <path d="M3 4.5h11a2 2 0 0 1 2 2V11a2 2 0 0 1-2 2H8.5L5 15.5V13H3a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z" />
          <path d="M21 9.5h-2v6a2 2 0 0 1-2 2H9l3.2 2.6a2 2 0 0 0 1 2h4.3l3.2 2.6v-2.6h.3a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Z" />
        </g>
      )
    case 'exe':
      return (
        <path
          d="M8 5.5 19 12 8 18.5Z"
          fill={FILL}
          stroke={STROKE}
          strokeWidth={SW}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )
    case 'obc':
      return (
        <g fill="none" stroke={STROKE} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 10V7a4 4 0 0 1 7.2-2.4" />
          <rect x="5" y="10" width="14" height="10" rx="2" fill={FILL} />
          <path d="M12 14v2.5" strokeWidth={SW + 0.3} />
        </g>
      )
    case 'med':
      return (
        <g stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" strokeLinecap="round">
          <path d="M2 12c2.8-4.8 6.8-7.2 10-7.2S19.2 7.2 22 12c-2.8 4.8-6.8 7.2-10 7.2S4.8 16.8 2 12Z" fill={FILL} />
          <circle cx="12" cy="12" r="3.4" fill={FILL} />
          <circle cx="12" cy="12" r="1.3" fill={STROKE} stroke="none" />
        </g>
      )
    case 'pra':
      return (
        <g stroke={STROKE} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="3.4" r="1.1" fill={STROKE} stroke="none" />
          <line x1="12" y1="4.5" x2="12" y2="18" />
          <line x1="5" y1="7.5" x2="19" y2="7.5" />
          <line x1="8" y1="20.5" x2="16" y2="20.5" />
          <line x1="12" y1="18" x2="12" y2="20.5" />
          <line x1="5" y1="7.5" x2="5" y2="11" />
          <line x1="19" y1="7.5" x2="19" y2="11" />
          <path d="M2 11a3 3 0 0 0 6 0Z" fill={FILL} />
          <path d="M16 11a3 3 0 0 0 6 0Z" fill={FILL} />
        </g>
      )
  }
}

const INSTITUTIONS = [
  {
    label: 'Pluralita',
    id: 'plu' as const,
    text: 'Rôzne názory majú v tvojej hlave priestor.',
  },
  {
    label: 'Exekutíva',
    id: 'exe' as const,
    text: 'Rozhodneš a naozaj to urobíš.',
  },
  {
    label: 'Slobody',
    id: 'obc' as const,
    text: 'Rešpektuješ hranice iných aj svoje.',
  },
  {
    label: 'Médiá',
    id: 'med' as const,
    text: 'Overuješ, odkiaľ informácia prišla.',
  },
  {
    label: 'Právny štát',
    id: 'pra' as const,
    text: 'Pravidlá platia pre teba rovnako ako pre iných.',
  },
]

function Schematic() {
  return (
    <div
      className="my-10 flex flex-col gap-3"
      role="img"
      aria-label="Päť inštitúcií — pluralita, exekutíva, slobody, médiá, právny štát"
    >
      {INSTITUTIONS.map(({ label, id, text }) => (
        <div
          key={id}
          className="card-glow flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-4"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-wash sm:h-12 sm:w-12">
            <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden>
              <InstitutionGlyph id={id} />
            </svg>
          </div>
          <div className="min-w-0">
            <span className="font-mono text-[0.68rem] tracking-wide text-ink sm:text-[0.78rem]">
              {label}
            </span>
            <p className="text-[0.76rem] leading-snug text-muted">{text}</p>
          </div>
        </div>
      ))}
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
