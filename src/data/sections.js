import { FORCES } from './forces'
import { RESOURCE_CATEGORIES } from './resources'

// Anchors for the contextual sub-navigation shown in the sidebar.
// Every id must exist as an element id in the matching tab component.
const forceSections = FORCES.map((force) => ({
  id: `sec-force-${force.key}`,
  label: force.label,
}))

const resourceSections = (category) => [
  { id: `sec-m2-${category.code}-basics`, label: 'مشخصات منبع' },
  { id: `sec-m2-${category.code}-evidence`, label: 'شواهد و تقلید' },
  { id: `sec-m2-${category.code}-vrin`, label: 'معیارهای VRIN' },
  { id: `sec-m2-${category.code}-list`, label: 'منابع ثبت‌شده' },
]

export const SECTIONS = {
  m1: {
    a1: [
      { id: 'sec-m1-identity', label: 'نام صنعت و بنگاه' },
      { id: 'sec-m1-scope', label: 'دامنه، جغرافیا و افق' },
      { id: 'sec-m1-sources', label: 'منابع داده' },
    ],
    a2: [...forceSections, { id: 'sec-m1-weights', label: 'وزن‌ها و شواهد' }],
    a3: [
      { id: 'sec-m1-financial', label: 'داده‌های مالی' },
      { id: 'sec-m1-matrix', label: 'ماتریس تغییرات' },
      { id: 'sec-m1-drivers', label: 'عوامل سودآوری' },
      { id: 'sec-m1-data-warning', label: 'هشدار داده' },
    ],
    a4: [
      { id: 'sec-m1-kpis', label: 'شاخص‌های کلیدی' },
      { id: 'sec-m1-gauge', label: 'شاخص جذابیت' },
      { id: 'sec-m1-bars', label: 'شدت پنج نیرو' },
      { id: 'sec-m1-advice', label: 'پیشنهاد اولیه' },
    ],
  },
  m2: {
    b1: resourceSections(RESOURCE_CATEGORIES[0]),
    b2: resourceSections(RESOURCE_CATEGORIES[1]),
    b3: resourceSections(RESOURCE_CATEGORIES[2]),
    b4: [
      { id: 'sec-m2-categories', label: 'امتیاز دسته‌ها' },
      { id: 'sec-m2-totals', label: 'شاخص‌های کلیدی' },
      { id: 'sec-m2-gauge', label: 'امتیاز پایداری' },
      { id: 'sec-m2-bars', label: 'امتیاز دسته‌های منابع' },
      { id: 'sec-m2-interpretation', label: 'تفسیر نتیجه' },
      { id: 'sec-m2-formula', label: 'فرمول امتیازدهی' },
    ],
  },
  m3: {
    c1: [{ id: 'sec-m3-overview', label: 'مرور امتیازها' }],
    c2: [
      { id: 'sec-m3-logic', label: 'منطق ترکیب' },
      { id: 'sec-m3-evidence', label: 'یافته‌های تجربی' },
      { id: 'sec-m3-weights', label: 'وزن‌های ترکیب' },
      { id: 'sec-m3-formula', label: 'فرمول شاخص' },
    ],
    c3: [
      { id: 'sec-m3-kpis', label: 'امتیازها' },
      { id: 'sec-m3-gauge', label: 'امتیاز ترکیبی' },
      { id: 'sec-m3-compare', label: 'مقایسه اجزا' },
      { id: 'sec-m3-advice', label: 'پیشنهاد راهبردی' },
      { id: 'sec-m3-ai', label: 'دستیار هوش مصنوعی' },
      { id: 'sec-m3-matrix', label: 'ماتریس تصمیم' },
    ],
  },
}
