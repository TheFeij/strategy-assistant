export function toFaNumber(value) {
  return String(value)
    .replace(/[0-9]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[digit])
    .replace('.', '٫')
}
