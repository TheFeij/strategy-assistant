import { useStrategy } from '../../state/StrategyContext'
import TabWeights from './TabWeights'
import TabStrategy from './TabStrategy'

const tabs = [
  {
    id: 1,
    title: 'تب ۱: جدول ضرایب مک‌گاهان و پورتر و انتخاب بخش اقتصادی',
    sub: 'انتخاب ضریب وابسته به صنعت یا «همه صنایع (میانگین کل)»',
  },
  {
    id: 2,
    title: 'تب ۲: نتیجه نهایی، ماتریس موقعیت‌یابی و استراتژی ورود به صنعت',
    sub: 'گزارش جامع ترکیب پورتر، بارنی و مک‌گاهان',
  },
]

export default function Module3() {
  const { mod3Tab, setMod3Tab, combinedScore } = useStrategy()

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <span className="text-xs font-bold text-amber-600">
              ماژول ۳ • ترکیب امتیاز صنعت و بنگاه (مقاله مک‌گاهان و پورتر ۱۹۹۷)
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              وزن‌دهی به امتیاز صنعت و بنگاه بر اساس جدول ضرایب صنایع و صدور بیانیه استراتژی
            </h2>
          </div>
          <div className="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 text-center">
            <div className="text-[10px] text-amber-900">امتیاز موزون مک‌گاهان-پورتر</div>
            <div className="text-xl font-black text-amber-700">{combinedScore ?? '—'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tabs.map((t) => {
            const active = mod3Tab === t.id
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setMod3Tab(t.id)}
                className={`rounded-xl p-3.5 text-right transition flex items-center gap-3 border ${
                  active
                    ? 'subtab-active-amber border-slate-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                    active ? 'bg-white/20' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {t.id}
                </span>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold">{t.title}</div>
                  <div className={`text-[11px] ${active ? 'opacity-85' : 'opacity-75'}`}>{t.sub}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {mod3Tab === 1 && <TabWeights />}
      {mod3Tab === 2 && <TabStrategy />}
    </div>
  )
}
