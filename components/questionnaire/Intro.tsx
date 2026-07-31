'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const STROKE = 'var(--accent)'
const FILL = 'var(--surface)'
const SW = 1.6

// Glyphs on a standard 24×24 grid, round joins/caps throughout.
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

type Institution = {
  id: 'plu' | 'exe' | 'obc' | 'med' | 'pra'
  name: string
  question: string
  left: string
  right: string
}

const INSTITUTIONS: Institution[] = [
  { id: 'plu', name: 'Pluralita', question: 'Ako rýchlo meníš názory?', left: 'Impulzívne', right: 'Overthinkujem' },
  {
    id: 'exe',
    name: 'Exekutíva',
    question: 'Premieňaš svoje myšlienky na činy?',
    left: 'Držím sa striktného plánu',
    right: 'Plány idú mimo mňa',
  },
  {
    id: 'obc',
    name: 'Osobná sloboda',
    question: 'Ako si dovolíš cítiť emócie?',
    left: 'Necítim nič',
    right: 'Cítim príliš',
  },
  {
    id: 'med',
    name: 'Sloboda informácií',
    question: 'Dostávaš o sebe pravdivé informácie?',
    left: 'Kritika ma nezaujíma',
    right: 'Moja sebahodnota padá na kritike',
  },
  {
    id: 'pra',
    name: 'Právny štát',
    question: 'Platí na teba rovnaký meter?',
    left: 'Som na seba prísny, na ostatných nie',
    right: 'Mierny na seba, prísny na iných',
  },
]

// Reveal-on-scroll (once). Visible immediately under reduced motion / no IO.
function useInView(ref: RefObject<Element>, threshold = 0.4): boolean {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, threshold])
  return inView
}

const SPRING = 'ease-[cubic-bezier(.34,1.56,.64,1)]'

function InstitutionSection({ inst }: { inst: Institution }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, 0.4)
  return (
    <section
      ref={ref}
      className="flex min-h-[68vh] flex-col justify-center"
      aria-label={inst.name}
    >
      {/* icon — assembles into place on scroll */}
      <div
        className={cn(
          'mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-wash transition-all duration-500',
          SPRING,
          inView ? 'rotate-0 scale-100 opacity-100' : '-rotate-12 scale-50 opacity-0',
        )}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden>
          <InstitutionGlyph id={inst.id} />
        </svg>
      </div>

      <p
        className={cn(
          'font-mono text-xs uppercase tracking-[0.16em] text-accent transition-all duration-500',
          inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}
      >
        {inst.name}
      </p>
      <h2
        className={cn(
          'mt-2 font-display text-[1.9rem] font-extrabold leading-tight tracking-tightish transition-all delay-75 duration-500 sm:text-[2.2rem]',
          inView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}
      >
        {inst.question}
      </h2>

      {/* animated spectrum bar with two poles */}
      <div className="mt-8">
        <div className="relative h-2 rounded-full bg-track">
          <div
            className={cn(
              'grad-bar glow-soft h-full origin-center rounded-full transition-transform delay-150 duration-700 ease-out',
              inView ? 'scale-x-100' : 'scale-x-0',
            )}
          />
          <span
            aria-hidden
            className={cn(
              'absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-accent bg-surface transition-all delay-200 duration-700 ease-out',
              inView ? 'left-1/2 -translate-x-1/2 opacity-100' : 'left-0 opacity-0',
            )}
            style={{ boxShadow: '0 0 10px rgba(42,70,232,0.35)' }}
          />
        </div>
        <div
          className={cn(
            'mt-3 flex justify-between gap-6 text-[0.82rem] leading-snug text-muted transition-opacity delay-300 duration-700',
            inView ? 'opacity-100' : 'opacity-0',
          )}
        >
          <span className="max-w-[45%]">{inst.left}</span>
          <span className="max-w-[45%] text-right">{inst.right}</span>
        </div>
      </div>
    </section>
  )
}

export function Intro({ onStart }: { onStart: () => void }) {
  const rulesRef = useRef<HTMLDivElement>(null)
  const passed = useInView(rulesRef, 0.3)

  return (
    <>
      <div className="mx-auto max-w-2xl px-5 pb-40">
        {/* Hero */}
        <section className="step-enter flex min-h-[82vh] flex-col justify-center">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent">
            Demokratický index myslenia
          </p>
          <h1 className="mt-3 font-display text-[2.3rem] font-extrabold leading-[1.03] tracking-tighter2 sm:text-[3rem]">
            Aké je to žiť v{' '}
            <span className="font-serif font-medium italic text-accent">tvojej hlave?</span>
          </h1>
          <p className="mt-6 text-[1.08rem] leading-relaxed text-muted">
            Spokojný život sa začína spokojným vnútorným prežívaním. Už Platón tvrdil, že svet
            okolo nás je produktom našej mysle.
          </p>
          <p className="mt-4 text-[1.08rem] leading-relaxed text-muted">
            Máš svoj vnútorný svet v rovnováhe?
          </p>
          <p className="mt-10 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-faint">
            skroluj ↓
          </p>
        </section>

        {/* Institutions — one section each, revealed on scroll */}
        {INSTITUTIONS.map((inst) => (
          <InstitutionSection key={inst.id} inst={inst} />
        ))}

        {/* Closing — the answering rule (triggers the CTA glow) */}
        <section
          ref={rulesRef}
          className={cn(
            'flex min-h-[50vh] flex-col justify-center transition-all duration-700 ease-out',
            passed ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
          )}
        >
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-faint">
            Pravidlá
          </p>
          <p className="mt-3 font-serif text-[1.3rem] italic leading-snug text-ink">
            Pri každej vete odhadni, koľkokrát sa ti to za posledný mesiac stalo. Odpovedaj bez
            cenzúry — prvý impulz býva najpresnejší.
          </p>
          <p className="mt-6 font-mono text-[0.82rem] text-muted">
            5 inštitúcií · 50 otázok · zhodnotenie vplyvu stresu
          </p>
        </section>
      </div>

      {/* Sticky bottom CTA (glows once the reader reaches the rules) */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl flex-col gap-1.5 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onStart} className={passed ? 'cta-ready' : undefined}>
              Začať <span aria-hidden>→</span>
            </Button>
            <span className="font-mono text-sm text-faint">≈ 12–15 min</span>
          </div>
          {/* TODO: privacy copy — withheld until the data-collection decision is made. */}
          <p className="max-w-md text-[0.74rem] leading-snug text-faint">
            Nie je to psychologický test ani diagnostika — nehovorí nič o tvojom duševnom zdraví.
          </p>
        </div>
      </div>
    </>
  )
}
