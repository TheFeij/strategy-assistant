// Barney resource categories (1991): physical, human and organisational resources.
// `code` is kept as a readable suffix in DOM ids and matches the legacy export format.
export const RESOURCE_CATEGORIES = [
  {
    code: 'P',
    type: 'فیزیکی',
    title: 'منابع فیزیکی',
    chartLabel: 'منابع فیزیکی',
    description:
      'فناوری فیزیکی، کارخانه و تجهیزات، موقعیت جغرافیایی و دسترسی به مواد خام.',
    nameLabel: 'نام منبع فیزیکی',
    namePlaceholder: 'مثلاً فناوری اختصاصی یا خط تولید',
    effectPlaceholder: 'کاهش هزینه، کیفیت، سرعت یا تمایز',
    evidencePlaceholder: 'داده، سند، شاخص یا مقایسه قابل راستی‌آزمایی',
    imitationPlaceholder: 'تاریخچه، پیچیدگی فنی، دسترسی خاص یا ابهام علّی',
    addLabel: 'ثبت منبع فیزیکی',
  },
  {
    code: 'H',
    type: 'انسانی',
    title: 'منابع انسانی',
    chartLabel: 'منابع انسانی',
    description:
      'آموزش، تجربه، قضاوت، هوش، روابط و بینش مدیران و کارکنان.',
    nameLabel: 'نام منبع انسانی / قابلیت',
    namePlaceholder: 'مثلاً تخصص تیم یا تجربه انباشته',
    effectPlaceholder: 'کاهش خطا، نوآوری، کیفیت یا سرعت',
    evidencePlaceholder: 'شاخص، عملکرد، سوابق یا مقایسه مستقل',
    imitationPlaceholder: 'تجربه تاریخی، روابط پیچیده، دانش ضمنی یا ابهام علّی',
    addLabel: 'ثبت منبع انسانی',
  },
  {
    code: 'O',
    type: 'سازمانی',
    title: 'منابع سازمانی',
    chartLabel: 'منابع سازمانی',
    description:
      'ساختار رسمی گزارش‌دهی، سیستم‌های برنامه‌ریزی و کنترل و هماهنگی، و روابط غیررسمی گروه‌ها.',
    nameLabel: 'نام منبع سازمانی / قابلیت',
    namePlaceholder: 'مثلاً سیستم هماهنگی یا فرهنگ همکاری',
    effectPlaceholder: 'هماهنگی بهتر، اجرای سریع‌تر یا یادگیری سازمانی',
    evidencePlaceholder: 'رویه، داده عملکرد، شاخص یا مثال مشخص',
    imitationPlaceholder: 'پیچیدگی اجتماعی، فرهنگ، تاریخچه یا ابهام علّی',
    addLabel: 'ثبت منبع سازمانی',
  },
]

export const RESOURCE_TYPES = RESOURCE_CATEGORIES.map((category) => category.type)
