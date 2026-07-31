// In-progress questionnaire state and its sessionStorage mirror. Survives a
// refresh, disappears when the tab closes. No network, no analytics.
import { ITEMS_VERSION } from './content'

export type AnswerValue = number | boolean | string | string[]
export type Answers = Record<string, AnswerValue>

export type SessionState = {
  itemsVersion: string
  seed: number
  startedAt: number | null // set when the intro is dismissed
  completedAt: number | null // stamped when the last step is finished
  currentIndex: number
  answers: Answers
}

const STORAGE_KEY = 'dim.session.v1'

export function createSession(seed: number): SessionState {
  return {
    itemsVersion: ITEMS_VERSION,
    seed,
    startedAt: null,
    completedAt: null,
    currentIndex: 0,
    answers: {},
  }
}

export function loadSession(): SessionState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SessionState
    // Ignore state from a different item set; the sequence would not match.
    if (parsed.itemsVersion !== ITEMS_VERSION) return null
    if (typeof parsed.seed !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

export function saveSession(state: SessionState): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable — the app still works from memory
  }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
