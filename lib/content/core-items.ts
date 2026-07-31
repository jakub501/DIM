import type { CoreItem } from '../types'

// 30 scored core items: 5 dimensions x 2 poles x 3 items. All use the shared
// frequency scale (see scale.ts). IDs are verbatim from the specification.
export const CORE_ITEMS: readonly CoreItem[] = [
  // 1. PLURALITA
  // Pole A — jeden hlas prehlasuje ostatné
  {
    kind: 'core',
    id: 'PLU-A1',
    dimension: 'PLU',
    pole: 'A',
    scored: true,
    text: 'Rozhodol som sa v priebehu chvíle a až potom hľadal dôvody, prečo to bolo správne.',
  },
  {
    kind: 'core',
    id: 'PLU-A2',
    dimension: 'PLU',
    pole: 'A',
    scored: true,
    text: 'Neistota ma ťažila tak, že som sa rozhodol hlavne preto, aby už bolo rozhodnuté.',
  },
  {
    kind: 'core',
    id: 'PLU-A3',
    dimension: 'PLU',
    pole: 'A',
    scored: true,
    text: 'Pri téme, kde mám jasný názor, som protiargument odbil bez toho, aby som ho naozaj domyslel.',
  },
  // Pole B — žiadny záver
  {
    kind: 'core',
    id: 'PLU-B1',
    dimension: 'PLU',
    pole: 'B',
    scored: true,
    text: 'Prehodnocoval som už uzavreté rozhodnutie tak dlho, že mi to bralo čas a energiu na iné veci.',
  },
  {
    kind: 'core',
    id: 'PLU-B2',
    dimension: 'PLU',
    pole: 'B',
    scored: true,
    text: 'Nedokázal som povedať, čo si vlastne myslím, lebo každý pohľad mi prišiel rovnako platný.',
  },
  {
    kind: 'core',
    id: 'PLU-B3',
    dimension: 'PLU',
    pole: 'B',
    scored: true,
    text: 'Prikláňal som sa raz k jednému názoru, raz k opačnému — podľa toho, s kým som naposledy hovoril.',
  },

  // 2. EXEKUTÍVA
  // Pole A — rigidný plán bez revízie
  {
    kind: 'core',
    id: 'EXE-A1',
    dimension: 'EXE',
    pole: 'A',
    scored: true,
    text: 'Držal som sa plánu aj potom, čo bolo jasné, že už nedáva zmysel.',
  },
  {
    kind: 'core',
    id: 'EXE-A2',
    dimension: 'EXE',
    pole: 'A',
    scored: true,
    text: 'Odmietol som zmeniť postup, hoci sa objavila lepšia možnosť — lebo som to už mal rozbehnuté.',
  },
  {
    kind: 'core',
    id: 'EXE-A3',
    dimension: 'EXE',
    pole: 'A',
    scored: true,
    text: 'Dokončil som niečo hlavne preto, že som si to sľúbil, nie preto, že to ešte malo hodnotu.',
  },
  // Pole B — rozhodnutie sa nepremení na čin
  {
    kind: 'core',
    id: 'EXE-B1',
    dimension: 'EXE',
    pole: 'B',
    scored: true,
    text: 'Naplánoval som si niečo konkrétne a potom som to jednoducho neurobil.',
  },
  {
    kind: 'core',
    id: 'EXE-B2',
    dimension: 'EXE',
    pole: 'B',
    scored: true,
    text: 'Odkladal som úlohu tak dlho, že sa medzitým stala naliehavou alebo bezpredmetnou.',
  },
  {
    kind: 'core',
    id: 'EXE-B3',
    dimension: 'EXE',
    pole: 'B',
    scored: true,
    text: 'Vedel som presne, čo mám urobiť — a namiesto toho som robil niečo iné.',
  },

  // 3. OBČIANSKE SLOBODY
  // Pole A — útlak
  {
    kind: 'core',
    id: 'OBC-A1',
    dimension: 'OBC',
    pole: 'A',
    scored: true,
    text: 'Povedal som si o vlastnom pocite, že ho nemám mať — že je hlúpy alebo neopodstatnený.',
  },
  {
    kind: 'core',
    id: 'OBC-A2',
    dimension: 'OBC',
    pole: 'A',
    scored: true,
    text: 'Keď na mňa doľahol ťažký pocit, hneď som siahol po niečom, čo ma z toho vytiahne (telefón, práca, jedlo).',
  },
  {
    kind: 'core',
    id: 'OBC-A3',
    dimension: 'OBC',
    pole: 'A',
    scored: true,
    text: 'Na otázku „ako sa cítiš?“ som odpovedal tým, čo si myslím — lebo pocit som nevedel pomenovať.',
  },
  // Pole B — záplava
  {
    kind: 'core',
    id: 'OBC-B1',
    dimension: 'OBC',
    pole: 'B',
    scored: true,
    text: 'Nejaká emócia ma ovládla tak, že som niekoľko hodín nedokázal robiť nič iné.',
  },
  {
    kind: 'core',
    id: 'OBC-B2',
    dimension: 'OBC',
    pole: 'B',
    scored: true,
    text: 'Povedal alebo napísal som v rozčúlení niečo, čo by som o hodinu už nepovedal.',
  },
  {
    kind: 'core',
    id: 'OBC-B3',
    dimension: 'OBC',
    pole: 'B',
    scored: true,
    text: 'Bral som silný pocit ako dôkaz o tom, ako veci naozaj sú („cítim to tak, teda to tak je“).',
  },

  // 4. SLOBODNÉ MÉDIÁ
  // Pole A — spätná väzba sa neprepustí
  {
    kind: 'core',
    id: 'MED-A1',
    dimension: 'MED',
    pole: 'A',
    scored: true,
    text: 'Keď mi niekto povedal kritiku, prvé, čo som urobil, bolo hľadať dôvod, prečo sa mýli.',
  },
  {
    kind: 'core',
    id: 'MED-A2',
    dimension: 'MED',
    pole: 'A',
    scored: true,
    text: 'Pochvalu alebo uznanie som odbil ako zdvorilosť či náhodu.',
  },
  {
    kind: 'core',
    id: 'MED-A3',
    dimension: 'MED',
    pole: 'A',
    scored: true,
    text: 'Vyhol som sa situácii, kde by som sa dozvedel, ako mi to naozaj ide (výsledok, číslo, priama otázka).',
  },
  // Pole B — každý vonkajší názor prepíše sebaobraz
  {
    kind: 'core',
    id: 'MED-B1',
    dimension: 'MED',
    pole: 'B',
    scored: true,
    text: 'Po jednej kritickej poznámke sa mi na niekoľko hodín zmenil pohľad na to, aký som človek.',
  },
  {
    kind: 'core',
    id: 'MED-B2',
    dimension: 'MED',
    pole: 'B',
    scored: true,
    text: 'Podľa reakcií druhých som počas jedného dňa vnímal sám seba raz ako schopného, raz ako neschopného.',
  },
  {
    kind: 'core',
    id: 'MED-B3',
    dimension: 'MED',
    pole: 'B',
    scored: true,
    text: 'Prijal som cudzí názor na seba bez toho, aby som si overil, či vôbec sedí.',
  },

  // 5. PRÁVNY ŠTÁT
  // Pole A — prísny na seba, mierny na iných
  {
    kind: 'core',
    id: 'PRA-A1',
    dimension: 'PRA',
    pole: 'A',
    scored: true,
    text: 'Za chybu, ktorú by som druhému odpustil bez rozmýšľania, som sa v duchu zhadzoval.',
  },
  {
    kind: 'core',
    id: 'PRA-A2',
    dimension: 'PRA',
    pole: 'A',
    scored: true,
    text: 'Ospravedlnil som niekomu správanie, ktoré by som u seba nenechal prejsť.',
  },
  {
    kind: 'core',
    id: 'PRA-A3',
    dimension: 'PRA',
    pole: 'A',
    scored: true,
    text: 'Latku som mal zdvihnutú len pre seba — od ostatných som podobný výkon nečakal.',
  },
  // Pole B — mierny na seba, prísny na iných
  {
    kind: 'core',
    id: 'PRA-B1',
    dimension: 'PRA',
    pole: 'B',
    scored: true,
    text: 'Vlastné zlyhanie som vysvetlil okolnosťami — a rovnaké zlyhanie u druhého jeho povahou.',
  },
  {
    kind: 'core',
    id: 'PRA-B2',
    dimension: 'PRA',
    pole: 'B',
    scored: true,
    text: 'Nahneval ma niekto za niečo, čo sám občas robím.',
  },
  {
    kind: 'core',
    id: 'PRA-B3',
    dimension: 'PRA',
    pole: 'B',
    scored: true,
    text: 'Urobil som pre seba výnimku z pravidla, ktorého dodržanie by som od iných čakal.',
  },
] as const
