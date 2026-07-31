import type { FrequencyValue } from '../types'

// The single frequency scale shared by every scored core item and by the
// filter items. Framing: "how many times in the last month did this happen?"
export type FrequencyOption = {
  value: FrequencyValue
  label: string
}

export const FREQUENCY_SCALE: readonly FrequencyOption[] = [
  { value: 0, label: 'ani raz' },
  { value: 1, label: '1–2×' },
  { value: 2, label: '3–5×' },
  { value: 3, label: 'viac ako 5×' },
] as const

// Max points a single frequency item can contribute. Used by pole normalisation.
export const MAX_PER_ITEM = 3

// Intro instruction shown above the frequency items.
export const FREQUENCY_INTRO =
  'Nasledujúce vety opisujú konkrétne situácie. Pri každej odhadni, koľkokrát sa ti to za posledný mesiac stalo. Nepýtame sa, aký si — pýtame sa, čo sa stalo.'
