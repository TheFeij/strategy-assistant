import { useStrategy } from '../../state/StrategyContext'

const moduleCards = [
  {
    id: 'mod1',
    badge: 'ماژول ۱ • نگاه بیرون به درون',
    tag: '۴ تب + ۵ صفحه نیروها',
    title: 'ماژول ۱: تحلیل جذابیت صنعت',
    subtitle: 'بر اساس مقاله ۵ نیروی رقابتی پورتر (۲۰۰۸) + ROIC صنایع ایران',
    header: 'bg-gradient-to-l from-indigo-600 to-indigo-800',
    footer: 'bg-indigo-50 border-indigo-100 text-indigo-700 group-hover:bg-indigo-600',
    stats: [
      { label: 'امتیاز فعلی و آینده صنعت', key: 'ind' },
      { label: 'تنگنای اصلی سود:', key: 'bottleneck', left: true },
    ],
    bullets: [
      ['تب ۱:', 'انتخاب صنعت از لیست ۲۰ صنعت بورس ایران و بارگذاری خودکار ROIC'],
      ['تب ۲:', '۵ صفحه مجزا برای ۵ نیرو (۳۶ سوال به زبان ساده برای مدیرعامل)'],
      ['تب ۳:', 'پرسشنامه ۱۲ سوالی ۴ فاکتور محیطی + مشورت با AI'],
      ['تب ۴:', 'کارنامه نهایی جذابیت صنعت و استراتژی پورتر'],
    ],
    footerLabel: 'ورود به ماژول ۱: تحلیل جذابیت صنعت',
  },
  {
    id: 'mod2',
    badge: 'ماژول ۲ • نگاه درون به بیرون',
    tag: '۵ تب تخصصی',
    title: 'ماژول ۲: تحلیل جذابیت بنگاه',
    subtitle: 'بر اساس مقاله منابع بنگاه و مزیت رقابتی پایدار بارنی (۱۹۹۱)',
    header: 'bg-gradient-to-l from-emerald-600 to-teal-800',
    footer: 'bg-emerald-50 border-emerald-100 text-emerald-800 group-hover:bg-emerald-600',
    stats: [
      { label: 'امتیاز پایداری منابع بنگاه', key: 'firm' },
      { label: 'وضعیت مزیت رقابتی:', key: 'badge', left: true },
    ],
    bullets: [
      ['چک‌لیست مصادیق منابع:', 'انتخاب انواع منابع فیزیکی، انسانی و سازمانی + جزئیات'],
      ['تب ۱ و ۲:', 'سنجش ارزشمند بودن (V) و کمیاب بودن (R) به همراه مشورت AI'],
      ['تب ۳ (تقلیدناپذیری I):', 'کشف غیرمستقیم «ابهام علی» از طریق سوالات تشخیصی'],
      ['تب ۴ و ۵:', 'جایگزین‌ناپذیری (N) و کارنامه قیف پایداری منابع'],
    ],
    footerLabel: 'ورود به ماژول ۲: تحلیل جذابیت بنگاه',
  },
  {
    id: 'mod3',
    badge: 'ماژول ۳ • سنتز نهایی',
    tag: '۲ تب تخصصی',
    title: 'ماژول ۳: ترکیب صنعت و منابع بنگاه',
    subtitle: 'بر اساس ضرایب مقاله مک‌گاهان و پورتر (۱۹۹۷)',
    header: 'bg-gradient-to-l from-amber-600 via-orange-600 to-slate-900',
    footer: 'bg-amber-50 border-amber-100 text-amber-900 group-hover:bg-amber-600',
    stats: [
      { label: 'امتیاز موزون مک‌گاهان-پورتر', key: 'combined' },
      { label: 'بخش اقتصادی فعال:', key: 'sector', left: true },
    ],
    bullets: [
      ['تب ۱:', 'جدول ضرایب ۷ بخش اقتصادی مک‌گاهان و پورتر (یا میانگین کل صنایع)'],
      ['اعمال اثر صنعت، بنگاه و شرکت مادر:', 'محاسبه وزن نرمال‌شده هر عامل'],
      ['تب ۲:', 'ماتریس موقعیت‌یابی استراتژیک و صدور بیانیه استراتژی ورود و رقابت'],
    ],
    footerLabel: 'ورود به ماژول ۳: ترکیب تحلیل‌ها و استراتژی',
  },
]

function StatValue({ card, s }) {
  const { IS_current, IS_future, bindingForceName, FS, bestBadge, combinedScore, secObj, isBlank } = useStrategy()

  if (s.key === 'ind') {
    return (
      <div className="flex items-baseline gap-2 mt-0.5">
        <span className="text-2xl font-black text-indigo-700">{IS_current ?? '—'}</span>
        <span className="text-xs text-slate-400">فعلی | آینده:</span>
        <span className="text-xl font-extrabold text-teal-600">{IS_future ?? '—'}</span>
      </div>
    )
  }
  if (s.key === 'bottleneck') {
    return <div className="text-xs font-extrabold text-rose-600 mt-0.5">{bindingForceName}</div>
  }
  if (s.key === 'firm') {
    return (
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-2xl font-black text-emerald-700">{FS ?? '—'}</span>
        <span className="text-xs text-slate-400">/ ۱۰۰</span>
      </div>
    )
  }
  if (s.key === 'badge') {
    return (
      <span className="inline-block text-xs font-extrabold px-2 py-0.5 rounded bg-slate-200 text-slate-700 mt-0.5">
        {isBlank ? 'در انتظار تکمیل فرم' : bestBadge}
      </span>
    )
  }
  if (s.key === 'combined') {
    return (
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-2xl font-black text-amber-600">{combinedScore ?? '—'}</span>
        <span className="text-xs text-slate-400">/ ۱۰۰</span>
      </div>
    )
  }
  if (s.key === 'sector') {
    return <div className="text-xs font-extrabold text-slate-800 mt-0.5">{secObj.name}</div>
  }
  return null
}

export default function HomeView() {
  const { navigate, IS_current, IS_future, FS, combinedScore } = useStrategy()

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-l from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-teal-300 font-semibold">
              <span>نسخه تجاری تصمیم‌یار مدیران عامل • بدون کدهای فرمول پیچیده • به زبان ساده</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black leading-tight">
              داشبورد مدیریتی محاسبه امتیاز سطح صنعت، بنگاه و استراتژی ورود
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              داشبورد به صورت پیش‌فرض در <strong>«حالت فرم خام (پرنشده)»</strong> قرار دارد تا خودتان اطلاعات صنعت و
              بنگاه را وارد کنید. همچنین می‌توانید با دکمه بالای صفحه یک نمونه آماده را بارگذاری نمایید. روی هر یک از{' '}
              <strong>۳ ماژول زیر</strong> کلیک کنید تا وارد تب‌های تخصصی آن شوید.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-700 rounded-2xl p-4 grid grid-cols-3 gap-3 shrink-0 text-center">
            <div className="px-2">
              <div className="text-[11px] text-slate-400 mb-1">جذابیت صنعت (پورتر)</div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">{IS_current ?? '—'}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">از ۱۰۰</div>
            </div>
            <div className="px-3 border-x border-slate-800">
              <div className="text-[11px] text-slate-400 mb-1">جذابیت بنگاه (بارنی)</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{FS ?? '—'}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">از ۱۰۰</div>
            </div>
            <div className="px-2">
              <div className="text-[11px] text-slate-400 mb-1">امتیاز نهایی (مک‌گاهان)</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">{combinedScore ?? '—'}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">از ۱۰۰</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {moduleCards.map((card) => (
          <button
            type="button"
            key={card.id}
            onClick={() => navigate(card.id)}
            className="module-portal-card text-right cursor-pointer bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className={`${card.header} p-5 text-white`}>
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span className="text-[11px] font-bold bg-white/15 px-2.5 py-0.5 rounded-full">{card.badge}</span>
                  <span className="text-xs font-semibold bg-black/20 px-2.5 py-0.5 rounded-lg">{card.tag}</span>
                </div>
                <h3 className="text-lg font-black">{card.title}</h3>
                <p className="text-xs text-white/80 mt-1">{card.subtitle}</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                  {card.stats.map((s) => (
                    <div key={s.key} className={s.left ? 'text-left' : ''}>
                      <div className="text-xs text-slate-500">{s.label}</div>
                      <StatValue card={card} s={s} />
                    </div>
                  ))}
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {card.bullets.map(([strong, rest]) => (
                    <li key={strong}>
                      • <strong>{strong}</strong> {rest}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              className={`px-5 py-3.5 border-t flex items-center justify-between text-xs font-extrabold transition group-hover:text-white ${card.footer}`}
            >
              <span>{card.footerLabel}</span>
              <span className="text-base">←</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
