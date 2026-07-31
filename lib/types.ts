// Core domain types for DIM (Democratic Index of Thinking).
// Content lives in typed data files (lib/content/*), never in JSX.
// All IDs are stable and taken verbatim from the specification.

export type Dimension = 'PLU' | 'EXE' | 'OBC' | 'MED' | 'PRA'
export type Pole = 'A' | 'B'

// Fixed slot in the questionnaire, honoured by the randomizer as an exception.
export type Placement = 'first-third' | 'last-third'

// ---------------------------------------------------------------------------
// Answer scales
// ---------------------------------------------------------------------------

// The single frequency scale shared by every scored core item and by the
// filter items. Its shared nature is what makes N = A - B meaningful.
// 0 = "ani raz", 1 = "1-2x", 2 = "3-5x", 3 = "viac ako 5x".
export type FrequencyValue = 0 | 1 | 2 | 3

// ---------------------------------------------------------------------------
// Scored core items (30: 5 dimensions x 2 poles x 3 items)
// ---------------------------------------------------------------------------

export type CoreItem = {
  kind: 'core'
  id: string // e.g. 'PLU-A1'
  dimension: Dimension
  pole: Pole
  text: string
  scored: true
}

// ---------------------------------------------------------------------------
// Stress branch (5: one per dimension). Produces an ARROW, not a number:
// a lean toward pole A, pole B, or "no meaningful change".
// ---------------------------------------------------------------------------

export type StressLean = 'A' | 'B' | 'none'

// Derived per-dimension stress info. `lean` drives the arrow (drawn only when
// not 'none'); `reversal` is true when the stress direction points to the
// opposite pole from the calm lean (N > 0 & stress -> B, or N < 0 & stress -> A).
export type DimensionStress = {
  dimension: Dimension
  lean: StressLean
  reversal: boolean
}

export type StressItem = {
  kind: 'stress'
  id: string // e.g. 'PLU-S'
  dimension: Dimension
  prompt: string
  options: Record<StressLean, string> // Slovak label per lean
}

// ---------------------------------------------------------------------------
// Recovery item (1, whole questionnaire). Combines with stress leans to read
// as stable / emergency / permanent-exception.
// ---------------------------------------------------------------------------

export type RecoveryValue = 'immediately' | 'days' | 'weeks' | 'never'

export type RecoveryItem = {
  kind: 'recovery'
  id: 'REC'
  prompt: string
  options: { value: RecoveryValue; label: string }[]
}

// ---------------------------------------------------------------------------
// Open questions (5, one per dimension). Free text, never scored, always shown.
// ---------------------------------------------------------------------------

export type OpenQuestion = {
  kind: 'open'
  id: string // e.g. 'PLU-O'
  dimension: Dimension // grouping only
  text: string
  scored: false
}

// ---------------------------------------------------------------------------
// Filter items (5, pilot). Reverse-worded, same frequency scale.
// Not scored in v1 — collected for later acquiescence analysis only.
// ---------------------------------------------------------------------------

export type FilterItem = {
  kind: 'filter'
  id: string // 'F1'..'F5'
  text: string
  scored: false
}

// ---------------------------------------------------------------------------
// Fog index (Index hmly). Never changes numbers — only reframes the result.
// ---------------------------------------------------------------------------

// H1 - Overclaiming. A flat checklist of terms; some are keyed (selecting a
// keyed term adds one fog point). The keyed set is kept as a Set of IDs with a
// neutral name and is never rendered or labelled as such in the UI.
export type OverclaimTerm = {
  id: string
  label: string
}

// H2 - Consistency pairs. Each pair is an absolute yes/no CLAIM plus a counted
// episode on the frequency scale, placed far apart. A fog point is added when
// the claim is affirmed AND the counted episode reaches its trigger — a
// logically impossible combination.
export type ConsistencyAnswerType = 'yesno' | 'frequency'

export type ConsistencyItem = {
  kind: 'consistency'
  id: string // e.g. 'H2-1-counter', 'H2-1-claim', 'H2-2-claim'
  text: string
  answerType: ConsistencyAnswerType
  placement: Placement
}

// The scoring linkage between a claim item and its counter item.
// Fog point when: claim === true (affirmed) && counterCount >= triggerAtCount.
// The counter may be a dedicated consistency item OR a normally-scored core
// item (pair 2 reuses EXE-B1 to avoid showing a near-duplicate question); in
// that case the item only feeds the contradiction and never adds a point twice.
// Thresholds differ by design ("everything" trips on the first slip; "nothing
// substantial" tolerates one or two trivial corrections) and stay as data so
// they can be tuned after the pilot.
export type ConsistencyPair = {
  id: string // '1' | '2'
  claimItemId: string // yes/no absolute claim, placed in last third
  counterItemId: string // frequency 0-3 item (consistency or core), first third
  triggerAtCount: 1 | 2
}

// H3 (extremity of profile) and H4 (time) are derived in scoring from the core
// sum and elapsed time; their thresholds live in a config object, not as items.
export type FogConfig = {
  extremity: { onePointAtOrBelow: number; twoPointsAtOrBelow: number } // H3
  time: { twoPointsBelowMs: number } // H4
  bands: {
    clearMax: number // 0-1 -> clear
    hazeMax: number // 2-3 -> haze; above -> dense fog (score hidden)
  }
}

// ---------------------------------------------------------------------------
// Content bundle + versioning
// ---------------------------------------------------------------------------

export type DimensionMeta = {
  id: Dimension
  name: string // Slovak display name, e.g. "Pluralita"
  question: string // the framing question under the name
}

export type ItemsVersion = string // e.g. 'v1'
