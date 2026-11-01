import { useStrategy } from '../../state/StrategyContext'

const titles = {
  mod1: 'تحلیل جذابیت صنعت (مقاله پورتر ۲۰۰۸ + ROIC صنایع ایران)',
  mod2: 'تحلیل جذابیت بنگاه (مقاله پایداری منابع بارنی ۱۹۹۱)',
  mod3: 'ترکیب امتیاز صنعت و بنگاه (مقاله مک‌گاهان و پورتر ۱۹۹۷)',
}

export default function BreadcrumbBar() {
  const { view, navigate } = useStrategy()
  if (view === 'home') return null

  return (
    <div className="bg-white border-b border-line shadow-sm">
      <div className="max-w-[84rem] mx-auto px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="flex items-center gap-1.5 text-industry-700 hover:text-industry-900 font-extrabold bg-industry-50 hover:bg-industry-100 px-3 py-1.5 rounded-lg transition border border-industry-200"
          >
            <span>▦</span>
            <span>بازگشت به صفحه اول</span>
          </button>
          <span className="text-muted">‹</span>
          <span className="font-extrabold text-midnight-800">{titles[view]}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => navigate('mod1')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              view === 'mod1' ? 'bg-industry-600 text-white' : 'text-muted hover:bg-canvas'
            }`}
          >
            تحلیل صنعت (پورتر)
          </button>
          <button
            type="button"
            onClick={() => navigate('mod2')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              view === 'mod2' ? 'bg-brand-600 text-white' : 'text-muted hover:bg-canvas'
            }`}
          >
            تحلیل بنگاه (بارنی)
          </button>
          <button
            type="button"
            onClick={() => navigate('mod3')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              view === 'mod3' ? 'bg-gold-500 text-midnight' : 'text-muted hover:bg-canvas'
            }`}
          >
            ترکیب و استراتژی (مک‌گاهان)
          </button>
        </div>
      </div>
    </div>
  )
}
