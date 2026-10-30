// Static option lists and reference figures used across the dashboard.

export const PAGES = [
  { id: 'home', label: 'نمای کلی / انتخاب ماژول' },
  { id: 'm1', label: 'ماژول ۱ · تحلیل صنعت' },
  { id: 'm2', label: 'ماژول ۲ · تحلیل بنگاه' },
  { id: 'm3', label: 'ماژول ۳ · ترکیب امتیازها' },
]

export const GEO_OPTIONS = ['ایران', 'منطقه‌ای', 'جهانی', 'تعریف سفارشی']

// Shared 1–5 rating scale. Use this everywhere a user rates something from 1 to 5
// so the numbers always carry the same meaning (1 = very low, 5 = very high).
export const FIVE_POINT_SCALE = [
  { value: 1, label: '۱ · خیلی کم' },
  { value: 2, label: '۲ · کم' },
  { value: 3, label: '۳ · متوسط' },
  { value: 4, label: '۴ · زیاد' },
  { value: 5, label: '۵ · خیلی زیاد' },
]

export const HORIZON_OPTIONS = [
  '۳ تا ۵ سال',
  'یک چرخه کامل کسب‌وکار',
  '۱۰ سال یا بیشتر',
]

export const FINANCIAL_PERIOD_OPTIONS = [
  '۵ سال اخیر',
  '۳ سال اخیر',
  'یک چرخه کامل صنعت',
  'داده ناکافی',
]

export const FINANCIAL_QUALITY_OPTIONS = [
  'قوی: صورت مالی رسمی',
  'متوسط: منبع ثانویه معتبر',
  'ضعیف: تخمین یا داده ناقص',
]

// Approximate Iranian industry ROIC figures carried over from the previous version.
// They are illustrative, not audited data.
export const ROIC_PRESETS = [
  { value: '39', label: 'بنچمارک فرضی نسخه قبلی — ۳۹٪' },
  { value: '46', label: 'داروسازی — ۴۶٪' },
  { value: '45.5', label: 'نرم‌افزار، فناوری اطلاعات و اینترنت — ۴۵٫۵٪' },
  { value: '44', label: 'پتروشیمی و پایین‌دستی — ۴۴٪' },
  { value: '42', label: 'فلزات اساسی (فولاد و مس) — ۴۲٪' },
  { value: '40.5', label: 'سیمان، آهک و گچ — ۴۰٫۵٪' },
  { value: '40', label: 'فرآورده‌های نفتی — ۴۰٪' },
  { value: '38.5', label: 'مواد شیمیایی و پلاستیک — ۳۸٫۵٪' },
  { value: '34', label: 'خودرو و قطعات — ۳۴٪' },
  { value: '33.5', label: 'محصولات کانی غیرفلزی — ۳۳٫۵٪' },
  { value: '32', label: 'لوازم خانگی — ۳۲٪' },
  { value: '30', label: 'مبلمان و دکوراسیون — ۳۰٪' },
  { value: '28.5', label: 'حمل‌ونقل، ریلی و لجستیک — ۲۸٫۵٪' },
  { value: '27.5', label: 'غذایی — ۲۷٫۵٪' },
  { value: '26', label: 'کشاورزی و محصولات غذایی پایه — ۲۶٪' },
  { value: '25', label: 'بانکداری و خدمات مالی — ۲۵٪ (با احتیاط)' },
  { value: '24', label: 'ساخت‌وساز و املاک — ۲۴٪' },
  { value: '22', label: 'خرده‌فروشی و عمده‌فروشی — ۲۲٪' },
  { value: '20.5', label: 'نفت و گاز — ۲۰٫۵٪' },
  { value: '20', label: 'معدن غیرفلزی و سرامیک — ۲۰٪' },
  { value: '12', label: 'شرکت‌های هواپیمایی — ۱۲٪' },
]

// Four change drivers that act on the five forces; they are not a sixth force.
export const CHANGE_FACTORS = [
  'رشد صنعت',
  'فناوری و نوآوری',
  'قوانین دولت',
  'محصولات مکمل',
]

export const MATRIX_IMPACTS = [
  { value: 3, label: '۳ خنثی' },
  { value: 1, label: '۱ کاهش فشار' },
  { value: 2, label: '۲ کاهش اندک' },
  { value: 4, label: '۴ افزایش اندک' },
  { value: 5, label: '۵ افزایش فشار' },
]

// McGahan & Porter (1997) variance decomposition reported in module 3.
export const MCGAHAN_KPIS = [
  { label: 'اثر پایدار صنعت', value: '۱۸٫۶۸٪ ≈ ۱۹٪' },
  { label: 'اثر اختصاصی بخش کسب‌وکار', value: '۳۱٫۷۱٪ ≈ ۳۲٪' },
  { label: 'اثر شرکت مادر', value: '۴٫۳۳٪ ≈ ۴٪' },
  { label: 'اثر سال / شوک‌های عمومی', value: '۲٫۳۹٪ ≈ ۲٪' },
  { label: 'هم‌تغییری صنعت و شرکت مادر', value: '−۵٫۵۱٪' },
  { label: 'سهم مدل / اثرهای توضیح‌داده‌شده', value: '۵۱٫۶۰٪' },
  { label: 'خطای مدل', value: '۴۸٫۴۰٪' },
]

export const DECISION_MATRIX = [
  { industry: 'بالا', firm: 'بالا', direction: 'رشد هدفمند و حفاظت از مزیت' },
  { industry: 'بالا', firm: 'پایین', direction: 'ورود مرحله‌ای، ساخت قابلیت یا شراکت' },
  { industry: 'پایین', firm: 'بالا', direction: 'تمایز، دفاع از ارزش یا تغییر بخش هدف' },
  { industry: 'پایین', firm: 'پایین', direction: 'احتیاط، بازنگری ورود یا تخصیص مجدد منابع' },
]

// Threshold used to place a score in the high/low quadrant of the decision matrix.
export const QUADRANT_THRESHOLD = 50
