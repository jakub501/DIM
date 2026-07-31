import type { FilterItem } from '../types'

// Reverse-worded items on the same frequency scale, to detect acquiescence.
// Not scored in v1 — collected for later analysis only.
export const FILTER_ITEMS: readonly FilterItem[] = [
  {
    kind: 'filter',
    id: 'F1',
    scored: false,
    text: 'Za posledný mesiac som zmenil názor na základe dobrého argumentu.',
  },
  {
    kind: 'filter',
    id: 'F2',
    scored: false,
    text: 'Za posledný mesiac som dokončil niečo, čo sa mi veľmi nechcelo.',
  },
  {
    kind: 'filter',
    id: 'F3',
    scored: false,
    text: 'Za posledný mesiac som nechal ťažký pocit chvíľu byť, bez toho, aby som ho hneď riešil.',
  },
  {
    kind: 'filter',
    id: 'F4',
    scored: false,
    text: 'Za posledný mesiac som prijal kritiku a niečo som podľa nej zmenil.',
  },
  {
    kind: 'filter',
    id: 'F5',
    scored: false,
    text: 'Za posledný mesiac som k sebe pristupoval rovnako zhovievavo ako k dobrému priateľovi.',
  },
] as const
