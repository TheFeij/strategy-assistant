const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

export function toFaNumber(value) {
  return String(value)
    .replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[digit])
    .replace('.', '٫')
}

/** Convert Persian/Arabic digits and decimal separators back to ASCII. */
export function toEnNumber(value) {
  return String(value ?? '')
    .replace(/[۰-۹٠-٩]/g, (digit) => {
      const persianIndex = PERSIAN_DIGITS.indexOf(digit)
      if (persianIndex >= 0) return String(persianIndex)
      const arabicIndex = ARABIC_DIGITS.indexOf(digit)
      return arabicIndex >= 0 ? String(arabicIndex) : digit
    })
    .replace(/٫/g, '.')
}
