import type { Dimension } from '../types'
import type { StressReading } from '../scoring'

// Per-dimension display copy for the result. `domain` feeds the direction
// sentence; the pole labels title the two bars. Deliberately neutral — no
// verdicts, no regime names.
export type DimensionCopy = {
  domain: string
  poleA: string
  poleB: string
}

export const DIMENSION_COPY: Record<Dimension, DimensionCopy> = {
  PLU: {
    domain: 'ako vážiš protichodné pohľady',
    poleA: 'rýchle uzavretie',
    poleB: 'nekonečné prehodnocovanie',
  },
  EXE: {
    domain: 'ako meníš rozhodnutia na činy',
    poleA: 'rigidné plnenie plánu',
    poleB: 'rozhodnutie bez činu',
  },
  OBC: {
    domain: 'ako zaobchádzaš s vlastnými pocitmi',
    poleA: 'potláčanie pocitov',
    poleB: 'zaplavenie pocitmi',
  },
  MED: {
    domain: 'ako prijímaš spätnú väzbu',
    poleA: 'spätná väzba neprejde',
    poleB: 'spätná väzba prepíše sebaobraz',
  },
  PRA: {
    domain: 'aký meter kladieš na seba a na iných',
    poleA: 'prísnosť voči sebe',
    poleB: 'prísnosť voči iným',
  },
}

// Resilience reading (stress shift × recovery). Mechanism, not verdict.
export const STRESS_READING_COPY: Record<StressReading, { title: string; body: string }> = {
  stable: {
    title: 'Stabilné inštitúcie',
    body: 'Pod tlakom sa tvoje vnútorné usporiadanie výrazne nemení.',
  },
  emergency: {
    title: 'Núdzový stav',
    body: 'Pod tlakom sa veci posúvajú, ale rýchlo sa vracajú do normálu. Bežné a dočasné.',
  },
  'permanent-exception': {
    title: 'Trvalý výnimočný stav',
    body: 'Posun pod tlakom sa nevracia rýchlo. To je miesto, ktoré si možno zaslúži pozornosť.',
  },
}

// Fog framing. Never claims answers were "verified". Caught fog is a signal;
// uncaught fog is not proof of honesty.
export const FOG_HAZE_NOTE =
  'Tvoje odpovede vyšli konzistentne priaznivo. Ber výsledok s rezervou — momentka platí len natoľko, nakoľko úprimne si odpovedal.'

export const FOG_DENSE_TITLE = 'Skóre tentokrát nezobrazujeme'

export const FOG_DENSE_BODY =
  'Odpovede vyšli buď veľmi rýchlo, alebo natoľko konzistentne priaznivo, že by číslo skôr klamalo než pomohlo. To nič nedokazuje — možno si sa len ponáhľal. Otázky nižšie ale stoja za zamyslenie aj bez skóre.'

// Section intros.
export const TENSIONS_INTRO =
  'Tieto dvojice tvojich odpovedí idú proti sebe. Nie je to chyba — skôr miesto, kde sa oplatí pristaviť.'

export const SECOND_PASS_QUESTION =
  'Ktorá z týchto odpovedí by najviac prekvapila človeka, ktorý ťa dobre pozná?'

// Closing caution (spec "Pri výsledku").
export const RESULT_CAUTION = [
  'Toto je momentka, nie rozsudok. Zlý mesiac vyzerá v tomto dotazníku podobne ako trvalá vlastnosť — rozdiel spoznáš len tak, že si ho o mesiac zopakuješ.',
  'Ak ťa niečo z výsledku dlhodobo trápi, hovor o tom s niekým — s človekom, ktorému dôveruješ, alebo s odborníkom. Dotazník to nenahradí.',
]
