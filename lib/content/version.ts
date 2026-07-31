import type { ItemsVersion } from '../types'

// Bump when the item set changes. Stored in every SessionResult so results can
// be interpreted against the item set that produced them.
export const ITEMS_VERSION: ItemsVersion = 'v1'
