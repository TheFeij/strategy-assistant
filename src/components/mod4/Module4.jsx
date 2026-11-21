import { useStrategy } from '../../state/StrategyContext'
import TabAppropriability from './TabAppropriability'
import TabDominantDesign from './TabDominantDesign'
import TabComplementary from './TabComplementary'
import TabPfiResult from './TabPfiResult'

const tabs = [
  { id: 1, title: 'محافظت در برابر کپی' },
  { id: 2, title: 'استاندارد بازار و مشتری' },
  { id: 3, title: 'حلقه‌های فروش و اجرا' },
  { id: 4, title: 'سهم سود و استراتژی' },
]

export default function Module4() {
  const { mod4Tab, setMod4Tab } = useStrategy()

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {tabs.map((t) => {
            const active = mod4Tab === t.id
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setMod4Tab(t.id)}
                className={`rounded-xl p-3 text-right transition flex items-center gap-2.5 border ${
                  active
                    ? 'subtab-active-midnight border-midnight-700'
                    : 'bg-white hover:bg-midnight-50 text-midnight-700 border-line'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                    active ? 'bg-white/15 text-white' : 'bg-midnight-50 text-midnight-700'
                  }`}
                >
                  {t.id}
                </span>
                <div>
                  <div className="text-sm font-extrabold">{t.title}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {mod4Tab === 1 && <TabAppropriability />}
      {mod4Tab === 2 && <TabDominantDesign />}
      {mod4Tab === 3 && <TabComplementary />}
      {mod4Tab === 4 && <TabPfiResult />}
    </div>
  )
}
