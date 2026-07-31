import type {
  OverclaimTerm,
  ConsistencyItem,
  ConsistencyPair,
  FogConfig,
} from '../types'

// H1 — Overclaiming checklist. All terms are shown (order shuffled at render
// time). Selecting a term whose id is in `overclaimingKeyed` adds one fog point.
// The keyed ids are kept as an opaque Set with a neutral name and are never
// surfaced in the UI.
export const OVERCLAIM_TERMS: readonly OverclaimTerm[] = [
  { id: 'oc-01', label: 'kognitívna disonancia' },
  { id: 'oc-02', label: 'konfirmačné skreslenie' },
  { id: 'oc-03', label: 'atribučná chyba' },
  { id: 'oc-04', label: 'Dunningov–Krugerov efekt' },
  { id: 'oc-05', label: 'mentalizácia' },
  { id: 'oc-06', label: 'emočná granularita' },
  { id: 'oc-07', label: 'vytesnenie' },
  { id: 'oc-08', label: 'locus of control' },
  { id: 'oc-09', label: 'reflexívna valencia' },
  { id: 'oc-10', label: 'Rautova škála sebahodnotenia' },
  { id: 'oc-11', label: 'Halvorsenov paradox' },
  { id: 'oc-12', label: 'index kognitívnej kongruencie' },
] as const

export const OVERCLAIM_PROMPT =
  'Ktoré z týchto pojmov poznáš aspoň natoľko, že by si ich vedel vysvetliť? Označ všetky, ktoré sedia.'

export const overclaimingKeyed: ReadonlySet<string> = new Set([
  'oc-09',
  'oc-10',
  'oc-11',
  'oc-12',
])

// H2 — Consistency items. Placed far apart in the questionnaire. Pair 2's
// counter is the core item EXE-B1 (not repeated here) to avoid a near-duplicate
// question; it also gets a fixed first-third placement (see PLACEMENT_OVERRIDES
// in ./index).
export const CONSISTENCY_ITEMS: readonly ConsistencyItem[] = [
  {
    kind: 'consistency',
    id: 'H2-1-counter',
    answerType: 'frequency',
    placement: 'first-third',
    text: 'Za posledný mesiac sa stalo, že mi niekto ukázal, že sa mýlim.',
  },
  {
    kind: 'consistency',
    id: 'H2-1-claim',
    answerType: 'yesno',
    placement: 'last-third',
    text: 'Za posledný mesiac som sa nemýlil v ničom podstatnom.',
  },
  {
    kind: 'consistency',
    id: 'H2-2-claim',
    answerType: 'yesno',
    placement: 'last-third',
    text: 'Všetko, čo som si za posledný mesiac naplánoval, som aj urobil.',
  },
] as const

export const CONSISTENCY_PAIRS: readonly ConsistencyPair[] = [
  { id: '1', claimItemId: 'H2-1-claim', counterItemId: 'H2-1-counter', triggerAtCount: 2 },
  { id: '2', claimItemId: 'H2-2-claim', counterItemId: 'EXE-B1', triggerAtCount: 1 },
] as const

// H3/H4 thresholds and result banding. Derived in scoring, not authored items.
export const FOG_CONFIG: FogConfig = {
  extremity: { onePointAtOrBelow: 8, twoPointsAtOrBelow: 4 }, // H3, of max 90
  time: { twoPointsBelowMs: 4 * 60 * 1000 }, // H4: under 4 minutes
  bands: { clearMax: 1, hazeMax: 3 }, // 0-1 clear, 2-3 haze, 4+ dense
}
