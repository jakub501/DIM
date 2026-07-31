// Builds the questionnaire order from a seed. Pure and deterministic: the same
// seed always yields the same sequence, so going back never reshuffles.
//
// Rules (spec "Pravidlá pre pilot" #3):
//  - the statement block (core + filter + consistency items) is randomized so
//    that two items of the same dimension never sit next to each other;
//  - consistency items (and the core item reused as a consistency counter,
//    EXE-B1) keep fixed placements: first third vs. last third.
// Stress items, recovery, the overclaiming checklist and open questions follow
// as ordered sections after the statement block.
import type {
  Dimension,
  OverclaimTerm,
  OpenQuestion,
  RecoveryItem,
  StressItem,
} from './types'
import {
  CORE_ITEMS,
  FILTER_ITEMS,
  CONSISTENCY_ITEMS,
  STRESS_ITEMS,
  RECOVERY_ITEM,
  OPEN_QUESTIONS,
  OVERCLAIM_TERMS,
  PLACEMENT_CONSTRAINTS,
} from './content'

export type StatementWidget = 'frequency' | 'yesno'

export type Step =
  | {
      kind: 'statement'
      id: string
      dimension: Dimension | null
      widget: StatementWidget
      text: string
    }
  | { kind: 'stress'; id: string; item: StressItem }
  | { kind: 'recovery'; id: 'REC'; item: RecoveryItem }
  | { kind: 'overclaim'; id: 'H1'; terms: readonly OverclaimTerm[] }
  | { kind: 'open'; id: string; item: OpenQuestion }

// --- seeded PRNG -------------------------------------------------------------

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = out[i]!
    out[i] = out[j]!
    out[j] = tmp
  }
  return out
}

function pick<T>(items: T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)]!
}

// --- statement block ---------------------------------------------------------

type StatementItem = {
  id: string
  dimension: Dimension | null
  widget: StatementWidget
  text: string
}

function allStatementItems(): StatementItem[] {
  const core: StatementItem[] = CORE_ITEMS.map((i) => ({
    id: i.id,
    dimension: i.dimension,
    widget: 'frequency',
    text: i.text,
  }))
  const filter: StatementItem[] = FILTER_ITEMS.map((i) => ({
    id: i.id,
    dimension: null,
    widget: 'frequency',
    text: i.text,
  }))
  const consistency: StatementItem[] = CONSISTENCY_ITEMS.map((i) => ({
    id: i.id,
    dimension: null,
    widget: i.answerType,
    text: i.text,
  }))
  return [...core, ...filter, ...consistency]
}

// Grouping key: same dimension collides; dimension-less items are unique
// spacers that never collide.
function groupKey(item: StatementItem): string {
  return item.dimension ?? `solo:${item.id}`
}

// Order items so that no two consecutive share a group. Classic "reorganize by
// most-remaining" scheduling; ties broken randomly for variety.
function arrangeNoAdjacent(items: StatementItem[], rng: () => number): StatementItem[] {
  const groups = new Map<string, StatementItem[]>()
  for (const it of shuffle(items, rng)) {
    const key = groupKey(it)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(it)
  }

  const result: StatementItem[] = []
  let lastKey: string | null = null
  const remaining = () => [...groups.entries()].filter(([, v]) => v.length > 0)

  while (remaining().length > 0) {
    let eligible = remaining().filter(([key]) => key !== lastKey)
    if (eligible.length === 0) eligible = remaining() // forced (shouldn't happen)
    const maxCount = Math.max(...eligible.map(([, v]) => v.length))
    const top = eligible.filter(([, v]) => v.length === maxCount)
    const [key, bucket] = pick(top, rng)
    result.push(bucket.pop()!)
    lastKey = key
  }
  return result
}

// Insert a fixed item at a random valid slot within [lo, hi] (splice indices),
// preferring slots whose neighbours don't share the item's dimension.
function insertInRange(
  seq: StatementItem[],
  item: StatementItem,
  lo: number,
  hi: number,
  rng: () => number,
): void {
  const positions = shuffle(
    Array.from({ length: hi - lo + 1 }, (_, k) => lo + k),
    rng,
  )
  const conflicts = (pos: number): boolean => {
    if (item.dimension === null) return false
    const prev = seq[pos - 1]
    const next = seq[pos]
    return prev?.dimension === item.dimension || next?.dimension === item.dimension
  }
  const chosen = positions.find((p) => !conflicts(p)) ?? positions[0] ?? lo
  seq.splice(chosen, 0, item)
}

function buildStatementBlock(rng: () => number): StatementItem[] {
  const byId = new Map(allStatementItems().map((i) => [i.id, i]))
  const firstIds = PLACEMENT_CONSTRAINTS.filter((c) => c.placement === 'first-third').map(
    (c) => c.itemId,
  )
  const lastIds = PLACEMENT_CONSTRAINTS.filter((c) => c.placement === 'last-third').map(
    (c) => c.itemId,
  )
  const fixedIds = new Set([...firstIds, ...lastIds])

  const free = [...byId.values()].filter((i) => !fixedIds.has(i.id))
  const seq = arrangeNoAdjacent(free, rng)

  const total = free.length + fixedIds.size
  const firstEnd = Math.floor(total / 3) // exclusive upper bound of first third
  const lastStart = Math.ceil((2 * total) / 3) // inclusive lower bound of last third

  // Insert first-third items within a reserved window so that even after they
  // shift one another right, every one keeps a final index < firstEnd.
  const firstHi = Math.max(0, firstEnd - firstIds.length)
  for (const id of shuffle(firstIds, rng)) {
    insertInRange(seq, byId.get(id)!, 0, firstHi, rng)
  }
  for (const id of shuffle(lastIds, rng)) {
    insertInRange(seq, byId.get(id)!, lastStart, seq.length, rng)
  }
  return seq
}

// --- full sequence -----------------------------------------------------------

export function buildSequence(seed: number): Step[] {
  const rng = mulberry32(seed)

  const statement: Step[] = buildStatementBlock(rng).map((i) => ({
    kind: 'statement',
    id: i.id,
    dimension: i.dimension,
    widget: i.widget,
    text: i.text,
  }))

  const stress: Step[] = shuffle(STRESS_ITEMS, rng).map((item) => ({
    kind: 'stress',
    id: item.id,
    item,
  }))

  const recovery: Step = { kind: 'recovery', id: 'REC', item: RECOVERY_ITEM }

  const overclaim: Step = {
    kind: 'overclaim',
    id: 'H1',
    terms: shuffle(OVERCLAIM_TERMS, rng),
  }

  const open: Step[] = shuffle(OPEN_QUESTIONS, rng).map((item) => ({
    kind: 'open',
    id: item.id,
    item,
  }))

  return [...statement, ...stress, recovery, overclaim, ...open]
}

// A fresh seed for a new run.
export function newSeed(): number {
  return (Math.floor(Math.random() * 0xffffffff) >>> 0) || 1
}
