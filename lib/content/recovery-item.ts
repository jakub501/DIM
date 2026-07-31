import type { RecoveryItem } from '../types'

// Single recovery item for the whole questionnaire. Decides whether a stress
// shift reads as a temporary emergency or a permanent exceptional state.
export const RECOVERY_ITEM: RecoveryItem = {
  kind: 'recovery',
  id: 'REC',
  prompt:
    'Keď náročné obdobie pominie, ako dlho trvá, kým sa veci vrátia do normálu?',
  options: [
    { value: 'immediately', label: 'takmer hneď' },
    { value: 'days', label: 'pár dní' },
    { value: 'weeks', label: 'týždne' },
    {
      value: 'never',
      label: 'úprimne, nespomínam si, kedy to naposledy bolo „normálne“',
    },
  ],
}
