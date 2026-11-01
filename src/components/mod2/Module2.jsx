import { useStrategy } from '../../state/StrategyContext'
import { toFaNumber } from '../../utils/numbers'
import TabChecklist from './TabChecklist'
import TabFactor from './TabFactor'
import TabI from './TabI'
import TabFirmResult from './TabFirmResult'

const tabs = [
  { id: 'CHK', title: 'فهرست منابع بنگاه', sub: '☑️ تیک‌زدن انواع + جزئیات' },
  { id: 'V', title: 'ارزشمند بودن (V)', sub: 'بهره‌برداری فرصت و مهار تهدید' },
  { id: 'R', title: 'کمیاب بودن (R)', sub: 'مدیرعامل + 🤖 مشورت AI' },
  { id: 'I', title: 'تقلیدناپذیری (I)', sub: 'سوالات غیرمستقیم و ابهام علی' },
  { id: 'N', title: 'جایگزین‌ناپذیری (N)', sub: 'نبود هم‌ارز + 🤖 مشورت AI' },
  { id: 'RES', title: 'امتیاز نهایی بنگاه', sub: 'کارنامه پایداری منابع' },
]

export default function Module2() {
  const { mod2Tab, setMod2Tab, FS } = useStrategy()

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3 mb-3">
          <div>
            <span className="text-xs font-bold text-brand-700">
              تحلیل سطح بنگاه (مقاله منابع بنگاه و مزیت رقابتی پایدار بارنی ۱۹۹۱)
            </span>
            <h2 className="text-lg sm:text-xl font-black text-midnight-900">
              انتخاب مصادیق منابع سه‌گانه و سنجش ۴ شاخص تجربی (ارزشمند، کمیاب، تقلیدناپذیر، جایگزین‌ناپذیر)
            </h2>
          </div>
          <div className="bg-brand-50 px-4 py-2 rounded-2xl border border-brand-200 text-center">
            <div className="text-xs text-brand-800">امتیاز کل پایداری بنگاه</div>
            <div className="text-xl font-black text-brand-900">{FS != null ? toFaNumber(FS) : '—'}</div>
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
                    ? 'subtab-active-brand border-brand-700'
                    : 'bg-white hover:bg-brand-50 text-midnight-700 border-line'
                }`}
              >
                <div className="text-sm font-extrabold">{t.title}</div>
                <div className={`text-xs mt-0.5 ${active ? 'opacity-80' : 'opacity-70'}`}>{t.sub}</div>
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
