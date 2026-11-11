import { useStrategy } from '../../state/StrategyContext'
import TabWeights from './TabWeights'
import TabStrategy from './TabStrategy'

const tabs = [
  { id: 1, title: 'جدول ضرایب مک‌گاهان و پورتر و انتخاب بخش اقتصادی' },
  { id: 2, title: 'نتیجه نهایی، ماتریس موقعیت‌یابی و استراتژی ورود به صنعت' },
]

export default function Module3() {
  const { mod3Tab, setMod3Tab } = useStrategy()

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm">
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
