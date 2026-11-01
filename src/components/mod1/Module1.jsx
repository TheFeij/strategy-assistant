import { useStrategy } from '../../state/StrategyContext'
import { toFaNumber } from '../../utils/numbers'
import TabRoic from './TabRoic'
import TabForces from './TabForces'
import TabEnv from './TabEnv'
import TabResult from './TabResult'

const tabs = [
  { id: 1, title: 'مرز صنعت و ROIC ایران', sub: '۲۰ صنعت بورس ایران (کدال)' },
  { id: 2, title: 'سنجش ۵ نیروی رقابتی', sub: '۵ صفحه مجزا با سوالات ساده' },
  { id: 3, title: '۴ فاکتور تغییرات محیطی', sub: '۱۲ سوال تشخیصی + مشورت AI' },
  { id: 4, title: 'امتیاز و استراتژی صنعت', sub: 'رادار نیروها و نسخه تجویزی پورتر' },
]

export default function Module1() {
  const { mod1Tab, setMod1Tab, IS_current, IS_future } = useStrategy()

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3 mb-3">
          <div>
            <span className="text-xs font-bold text-industry-700">تحلیل جذابیت صنعت (مقاله پورتر ۲۰۰۸)</span>
            <h2 className="text-lg sm:text-xl font-black text-midnight-900">
              سنجش ۵ نیروی رقابتی (هر نیرو در یک صفحه مجزا)، ۴ فاکتور محیطی و ROIC صنایع ایران
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-canvas px-4 py-2 rounded-2xl border border-line text-center">
            <div>
              <div className="text-xs text-muted">امتیاز فعلی صنعت</div>
              <div className="text-xl font-black text-industry-700">
                {IS_current != null ? toFaNumber(IS_current) : '—'}
              </div>
            </div>
            <div className="h-7 w-px bg-line" />
            <div>
              <div className="text-xs text-muted">امتیاز آینده صنعت</div>
              <div className="text-xl font-black text-brand-700">
                {IS_future != null ? toFaNumber(IS_future) : '—'}
              </div>
            </div>
          </div>
        </div>

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
                  <div className={`text-xs ${active ? 'opacity-80' : 'opacity-70'}`}>{t.sub}</div>
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
