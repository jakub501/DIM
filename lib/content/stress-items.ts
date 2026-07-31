import type { StressItem } from '../types'

// Stress magnitude is a property of the whole profile, not of any single
// dimension (a dimension only has three states). It is the count of dimensions
// showing a shift. Threshold kept here for post-pilot tuning, not as a literal.
export const STRESS_CONFIG = {
  largeShiftMinCount: 3, // 0-2 shifts -> 'small', 3+ -> 'large'
} as const

// One stress-branch item per dimension. Produces an arrow (lean A / B / none),
// never a number. Combined with the recovery item at result time.
export const STRESS_ITEMS: readonly StressItem[] = [
  {
    kind: 'stress',
    id: 'PLU-S',
    dimension: 'PLU',
    prompt:
      'Keď som vyčerpaný alebo pod tlakom, moje rozhodovanie sa posúva skôr k:',
    options: {
      A: 'rýchlemu uzavretiu, nech je pokoj',
      B: 'úplnému zaseknutiu',
      none: 'nemení sa výrazne',
    },
  },
  {
    kind: 'stress',
    id: 'EXE-S',
    dimension: 'EXE',
    prompt: 'Keď som vyčerpaný alebo pod tlakom, moje konanie sa posúva skôr k:',
    options: {
      A: 'mechanickému dodržiavaniu plánu bez ohľadu na zmysel',
      B: 'úplnému rozpadu plánov',
      none: 'nemení sa výrazne',
    },
  },
  {
    kind: 'stress',
    id: 'OBC-S',
    dimension: 'OBC',
    prompt: 'Keď som vyčerpaný alebo pod tlakom, moje pocity sú skôr:',
    options: {
      A: 'úplne umlčané',
      B: 'úplne mimo kontroly',
      none: 'približne ako inak',
    },
  },
  {
    kind: 'stress',
    id: 'MED-S',
    dimension: 'MED',
    prompt: 'Keď som vyčerpaný alebo pod tlakom, spätná väzba na mňa:',
    options: {
      A: 'vôbec neprejde, uzavriem sa',
      B: 'zasiahne ma dvojnásobne',
      none: 'nemení sa výrazne',
    },
  },
  {
    kind: 'stress',
    id: 'PRA-S',
    dimension: 'PRA',
    prompt: 'Keď som vyčerpaný alebo pod tlakom, môj meter sa posúva skôr k:',
    options: {
      A: 'ešte tvrdšiemu na seba',
      B: 'ešte tvrdšiemu na ostatných',
      none: 'nemení sa výrazne',
    },
  },
] as const
