import { useStrategy } from '../../state/StrategyContext'
import TabChecklist from './TabChecklist'
import TabFactor from './TabFactor'
import TabI from './TabI'
import TabFirmResult from './TabFirmResult'

const tabs = [
  { id: 'CHK', title: 'فهرست منابع بنگاه' },
  { id: 'V', title: 'ارزشمند بودن (V)' },
  { id: 'R', title: 'کمیاب بودن (R)' },
  { id: 'I', title: 'تقلیدناپذیری (I)' },
  { id: 'N', title: 'جایگزین‌ناپذیری (N)' },
  { id: 'RES', title: 'امتیاز نهایی بنگاه' },
]

export default function Module2() {
  const { mod2Tab, setMod2Tab } = useStrategy()

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {tabs.map((t) => {
            const active = mod2Tab === t.id
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setMod2Tab(t.id)}
                className={`rounded-xl p-3 text-center transition border ${
                  active
                    ? 'subtab-active-brand border-brand-700'
                    : 'bg-white hover:bg-brand-50 text-midnight-700 border-line'
                }`}
              >
                <div className="text-sm font-extrabold">{t.title}</div>
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
