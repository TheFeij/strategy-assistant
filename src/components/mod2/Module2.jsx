import { useStrategy } from '../../state/StrategyContext'
import TabChecklist from './TabChecklist'
import TabFactor from './TabFactor'
import TabI from './TabI'
import TabFirmResult from './TabFirmResult'

const tabs = [
  { id: 'CHK', title: 'گام ۰: فهرست منابع بنگاه', sub: '☑️ تیک‌زدن انواع + جزئیات' },
  { id: 'V', title: 'تب ۱: ارزشمند بودن (V)', sub: 'بهره‌برداری فرصت و مهار تهدید' },
  { id: 'R', title: 'تب ۲: کمیاب بودن (R)', sub: 'مدیرعامل + 🤖 مشورت AI' },
  { id: 'I', title: 'تب ۳: تقلیدناپذیری (I)', sub: 'سوالات غیرمستقیم و ابهام علی' },
  { id: 'N', title: 'تب ۴: جایگزین‌ناپذیری (N)', sub: 'نبود هم‌ارز + 🤖 مشورت AI' },
  { id: 'RES', title: 'تب ۵: امتیاز نهایی بنگاه', sub: 'کارنامه پایداری منابع' },
]

export default function Module2() {
  const { mod2Tab, setMod2Tab, FS } = useStrategy()

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <span className="text-xs font-bold text-emerald-600">
              ماژول ۲ • تحلیل سطح بنگاه (مقاله منابع بنگاه و مزیت رقابتی پایدار بارنی ۱۹۹۱)
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              انتخاب مصادیق منابع سه‌گانه و سنجش ۴ شاخص تجربی (ارزشمند، کمیاب، تقلیدناپذیر، جایگزین‌ناپذیر)
            </h2>
          </div>
          <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-center">
            <div className="text-[10px] text-emerald-800">امتیاز کل پایداری بنگاه</div>
            <div className="text-xl font-black text-emerald-900">{FS ?? '—'}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {tabs.map((t) => {
            const active = mod2Tab === t.id
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setMod2Tab(t.id)}
                className={`rounded-xl p-2.5 text-right transition border ${
                  active
                    ? 'subtab-active-emerald border-slate-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="text-xs font-extrabold">{t.title}</div>
                <div className={`text-[10px] mt-0.5 ${active ? 'opacity-80' : 'opacity-70'}`}>{t.sub}</div>
              </button>
            )
          })}
        </div>
      </div>

      {mod2Tab === 'CHK' && <TabChecklist />}
      {mod2Tab === 'V' && <TabFactor mode="V" />}
      {mod2Tab === 'R' && <TabFactor mode="R" />}
      {mod2Tab === 'I' && <TabI />}
      {mod2Tab === 'N' && <TabFactor mode="N" />}
      {mod2Tab === 'RES' && <TabFirmResult />}
    </div>
  )
}
