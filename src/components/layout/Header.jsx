import { useStrategy } from '../../state/StrategyContext'

export default function Header() {
  const { navigate, IS_current, FS, combinedScore, isBlank, resetToBlank, fillSample } = useStrategy()

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <button type="button" className="flex items-center gap-3 text-right" onClick={() => navigate('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-teal-500 flex items-center justify-center shadow-md shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" opacity="0.35" />
              <path d="M12 3v9l7 4" />
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-black tracking-tight text-white">
                StratBI <span className="text-teal-400">Pro v3.0</span>
              </span>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                  isBlank
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {isBlank ? 'حالت فرم خام (پرنشده)' : 'در حال محاسبه زنده'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              پورتر (۲۰۰۸) • بارنی (۱۹۹۱) • مک‌گاهان و پورتر (۱۹۹۷) • نسخه بومی ROIC صنایع ایران
            </p>
          </div>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden xl:flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-1.5 text-xs">
            <span className="text-slate-400">امتیاز صنعت:</span>
            <strong className="text-indigo-400 font-black text-sm">{IS_current ?? '—'}</strong>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">امتیاز بنگاه:</span>
            <strong className="text-emerald-400 font-black text-sm">{FS ?? '—'}</strong>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">ترکیب مک‌گاهان:</span>
            <strong className="text-amber-400 font-black text-sm">{combinedScore ?? '—'}</strong>
          </div>

          <button
            type="button"
            onClick={resetToBlank}
            className="flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 text-xs font-bold px-3 py-2 rounded-xl transition"
          >
            <span>🧹</span>
            <span>پاک‌سازی فرم (حالت خام)</span>
          </button>

          <button
            type="button"
            onClick={fillSample}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-sm"
          >
            <span>✨</span>
            <span>پر کردن نمونه آزمایشی (تست سریع)</span>
          </button>
        </div>
      </div>
    </header>
  )
}
