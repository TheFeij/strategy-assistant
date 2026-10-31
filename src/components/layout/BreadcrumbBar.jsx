import { useStrategy } from '../../state/StrategyContext'

const titles = {
  mod1: 'ماژول ۱: تحلیل جذابیت صنعت (مقاله پورتر ۲۰۰۸ + ROIC صنایع ایران)',
  mod2: 'ماژول ۲: تحلیل جذابیت بنگاه (مقاله پایداری منابع بارنی ۱۹۹۱)',
  mod3: 'ماژول ۳: ترکیب امتیاز صنعت و بنگاه (مقاله مک‌گاهان و پورتر ۱۹۹۷)',
}

export default function BreadcrumbBar() {
  const { view, navigate } = useStrategy()
  if (view === 'home') return null

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="flex items-center gap-1.5 text-indigo-700 hover:text-indigo-900 font-extrabold bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition border border-indigo-200"
          >
            <span>▦</span>
            <span>بازگشت به صفحه اول (۳ ماژول اصلی)</span>
          </button>
          <span className="text-slate-400">‹</span>
          <span className="font-extrabold text-slate-800">{titles[view]}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => navigate('mod1')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              view === 'mod1' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ماژول ۱: صنعت (پورتر)
          </button>
          <button
            type="button"
            onClick={() => navigate('mod2')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              view === 'mod2' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ماژول ۲: بنگاه (بارنی)
          </button>
          <button
            type="button"
            onClick={() => navigate('mod3')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              view === 'mod3' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ماژول ۳: ترکیب (مک‌گاهان)
          </button>
        </div>
      </div>
    </div>
  )
}
