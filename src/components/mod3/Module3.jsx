import { useStrategy } from '../../state/StrategyContext'
import { toFaNumber } from '../../utils/numbers'
import TabWeights from './TabWeights'
import TabStrategy from './TabStrategy'

const tabs = [
  {
    id: 1,
    title: 'جدول ضرایب مک‌گاهان و پورتر و انتخاب بخش اقتصادی',
    sub: 'انتخاب ضریب وابسته به صنعت یا «همه صنایع (میانگین کل)»',
  },
  {
    id: 2,
    title: 'نتیجه نهایی، ماتریس موقعیت‌یابی و استراتژی ورود به صنعت',
    sub: 'گزارش جامع ترکیب پورتر، بارنی و مک‌گاهان',
  },
]

export default function Module3() {
  const { mod3Tab, setMod3Tab, combinedScore } = useStrategy()

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3 mb-3">
          <div>
            <span className="text-xs font-bold text-gold-800">
              ترکیب امتیاز صنعت و بنگاه (مقاله مک‌گاهان و پورتر ۱۹۹۷)
            </span>
            <h2 className="text-lg sm:text-xl font-black text-midnight-900">
              وزن‌دهی به امتیاز صنعت و بنگاه بر اساس جدول ضرایب صنایع و صدور بیانیه استراتژی
            </h2>
          </div>
          <div className="bg-gold-50 px-4 py-2 rounded-2xl border border-gold-200 text-center">
            <div className="text-xs text-gold-900">امتیاز موزون مک‌گاهان-پورتر</div>
            <div className="text-xl font-black text-gold-800">
              {combinedScore != null ? toFaNumber(combinedScore) : '—'}
            </div>
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
                    ? 'subtab-active-gold border-gold-600'
                    : 'bg-white hover:bg-gold-50 text-midnight-700 border-line'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                    active ? 'bg-midnight/10 text-midnight' : 'bg-gold-50 text-gold-800'
                  }`}
                >
                  {t.id}
                </span>
                <div>
                  <div className="text-sm sm:text-base font-extrabold">{t.title}</div>
                  <div className={`text-xs ${active ? 'opacity-85' : 'opacity-75'}`}>{t.sub}</div>
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
