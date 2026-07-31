import type { OpenQuestion } from '../types'

// One open question per dimension. Free text, never scored, always shown.
// IDs are assigned (the spec leaves them unnamed): <DIM>-O.
export const OPEN_QUESTIONS: readonly OpenQuestion[] = [
  {
    kind: 'open',
    id: 'PLU-O',
    dimension: 'PLU',
    scored: false,
    text: 'Spomeň si na rozhodnutie z posledného mesiaca, pri ktorom si mal v sebe dva protichodné hlasy. Ako sa to skončilo — vyhral jeden, alebo si našiel niečo tretie?',
  },
  {
    kind: 'open',
    id: 'EXE-O',
    dimension: 'EXE',
    scored: false,
    text: 'Čo je vec, ktorú si si za posledný mesiac naplánoval a neurobil? Čo tomu podľa teba naozaj stálo v ceste?',
  },
  {
    kind: 'open',
    id: 'OBC-O',
    dimension: 'OBC',
    scored: false,
    text: 'Spomeň si na moment z posledného mesiaca, keď si cítil niečo, čo sa ti cítiť nechcelo. Čo si s tým urobil?',
  },
  {
    kind: 'open',
    id: 'MED-O',
    dimension: 'MED',
    scored: false,
    text: 'Kedy si naposledy niekomu priznal, že mal pravdu a ty nie? Koľko času odvtedy prešlo?',
  },
  {
    kind: 'open',
    id: 'PRA-O',
    dimension: 'PRA',
    scored: false,
    text: 'Napadá ti pravidlo, ktoré vyžaduješ od seba prísnejšie než od kohokoľvek iného? Odkiaľ sa vzalo?',
  },
] as const
