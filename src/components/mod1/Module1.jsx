import { useStrategy } from '../../state/StrategyContext'
import TabRoic from './TabRoic'
import TabForces from './TabForces'
import TabEnv from './TabEnv'
import TabResult from './TabResult'

const tabs = [
  { id: 1, title: 'تب ۱: مرز صنعت و ROIC ایران', sub: '۲۰ صنعت بورس ایران (کدال)' },
  { id: 2, title: 'تب ۲: سنجش ۵ نیروی رقابتی', sub: '۵ صفحه مجزا با سوالات ساده' },
  { id: 3, title: 'تب ۳: ۴ فاکتور تغییرات محیطی', sub: '۱۲ سوال تشخیصی + مشورت AI' },
  { id: 4, title: 'تب ۴: امتیاز و استراتژی صنعت', sub: 'رادار نیروها و نسخه تجویزی پورتر' },
]

export default function Module1() {
  const { mod1Tab, setMod1Tab, IS_current, IS_future } = useStrategy()

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <span className="text-xs font-bold text-indigo-600">ماژول ۱ • تحلیل جذابیت صنعت (مقاله پورتر ۲۰۰۸)</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              سنجش ۵ نیروی رقابتی (هر نیرو در یک صفحه مجزا)، ۴ فاکتور محیطی و ROIC صنایع ایران
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 text-center">
            <div>
              <div className="text-[10px] text-slate-500">امتیاز فعلی صنعت</div>
              <div className="text-xl font-black text-indigo-700">{IS_current ?? '—'}</div>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <div className="text-[10px] text-slate-500">امتیاز آینده صنعت</div>
              <div className="text-xl font-black text-teal-600">{IS_future ?? '—'}</div>
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
                  active ? 'subtab-active border-slate-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                    active ? 'bg-white/20' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {t.id}
                </span>
                <div>
                  <div className="text-xs font-extrabold">{t.title}</div>
                  <div className={`text-[10px] ${active ? 'opacity-80' : 'opacity-70'}`}>{t.sub}</div>
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
