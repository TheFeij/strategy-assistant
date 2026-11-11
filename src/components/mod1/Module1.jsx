import { useStrategy } from '../../state/StrategyContext'
import TabRoic from './TabRoic'
import TabForces from './TabForces'
import TabEnv from './TabEnv'
import TabResult from './TabResult'

const tabs = [
  { id: 1, title: 'مرز صنعت و ROIC ایران' },
  { id: 2, title: 'سنجش ۵ نیروی رقابتی' },
  { id: 3, title: '۴ فاکتور تغییرات محیطی' },
  { id: 4, title: 'امتیاز و استراتژی صنعت' },
]

export default function Module1() {
  const { mod1Tab, setMod1Tab } = useStrategy()

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {tabs.map((t) => {
            const active = mod1Tab === t.id
            return (
              <button
                type="button"
                key={t.id}
                onClick={() => setMod1Tab(t.id)}
                className={`rounded-xl p-3 text-right transition flex items-center gap-2.5 border ${
                  active
                    ? 'subtab-active border-industry-700'
                    : 'bg-white hover:bg-industry-50 text-midnight-700 border-line'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                    active ? 'bg-white/20 text-white' : 'bg-industry-50 text-industry-700'
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

      {mod1Tab === 1 && <TabRoic />}
      {mod1Tab === 2 && <TabForces />}
      {mod1Tab === 3 && <TabEnv />}
      {mod1Tab === 4 && <TabResult />}
    </div>
  )
}
