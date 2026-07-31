import type { DimensionMeta } from '../types'

export const DIMENSIONS: readonly DimensionMeta[] = [
  {
    id: 'PLU',
    name: 'Pluralita',
    question:
      'Dostanú konkurenčné pohľady férové vypočutie, alebo je výsledok vopred daný?',
  },
  {
    id: 'EXE',
    name: 'Exekutíva',
    question: 'Dokážeš sa rozhodnúť a to rozhodnutie vykonať?',
  },
  {
    id: 'OBC',
    name: 'Občianske slobody',
    question: 'Ktoré emócie majú povolené existovať?',
  },
  {
    id: 'MED',
    name: 'Slobodné médiá',
    question: 'Dostávaš o sebe pravdivé informácie?',
  },
  {
    id: 'PRA',
    name: 'Právny štát',
    question: 'Platí na teba rovnaký meter ako na ostatných?',
  },
] as const
