import { FIVE_POINT_SCALE } from './constants'

// VRIN scoring scale (Barney, 1991). Reuses the shared 1–5 labels.
export const VRIN_CRITERIA = [
  { key: 'v', label: 'ارزشمندی (۱ تا ۵)', short: 'ارزشمندی' },
  { key: 'r', label: 'کمیابی (۱ تا ۵)', short: 'کمیابی' },
  { key: 'i', label: 'تقلیدناپذیری (۱ تا ۵)', short: 'تقلیدناپذیری' },
  { key: 'n', label: 'جایگزین‌ناپذیری (۱ تا ۵)', short: 'جایگزین‌ناپذیری' },
]

export const VRIN_SCALE = FIVE_POINT_SCALE

export const DEFAULT_VRIN_SCORE = 3
