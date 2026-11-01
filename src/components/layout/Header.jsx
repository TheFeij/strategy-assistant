import { useStrategy } from '../../state/StrategyContext'
import { toFaNumber } from '../../utils/numbers'

function ScorePill({ label, value, dotClass, valueClass }) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition hover:bg-slate-200/70 dark:hover:bg-white/5">
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      <strong className={`text-sm font-black ${valueClass}`}>{value != null ? toFaNumber(value) : '—'}</strong>
    </div>
  )
}

export default function Header() {
  const { navigate, IS_current, FS, combinedScore, resetToBlank, fillSample, theme, toggleTheme } =
    useStrategy()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 text-slate-900 shadow-lg shadow-slate-900/10 backdrop-blur dark:border-white/10 dark:bg-slate-950/80 dark:text-white dark:shadow-slate-950/30">
      <div className="relative mx-auto flex min-h-16 max-w-[84rem] flex-wrap items-center justify-between gap-3 px-3 py-2.5 sm:px-5">
        <button type="button" className="flex items-center gap-3 text-right" onClick={() => navigate('home')}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-teal-500 shadow-lg shadow-indigo-950/50 ring-1 ring-white/15">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" opacity="0.35" />
              <path d="M12 3v9l7 4" />
              <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-base font-black tracking-tight sm:text-lg">
              StratBI{' '}
              <span className="bg-gradient-to-l from-teal-600 to-indigo-600 bg-clip-text text-transparent dark:from-teal-300 dark:to-indigo-300">
                Pro
              </span>
              <span className="mr-1.5 align-middle text-xs font-bold text-slate-400 dark:text-slate-500">
                v3.0
              </span>
            </div>
          </div>
        </button>

        <div className="pointer-events-none order-3 flex w-full items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1 lg:absolute lg:left-1/2 lg:top-1/2 lg:order-none lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2 dark:border-white/10 dark:bg-white/[0.04]">
          <ScorePill
            label="صنعت"
            value={IS_current}
            dotClass="bg-indigo-500 dark:bg-indigo-400"
            valueClass="text-indigo-600 dark:text-indigo-300"
          />
          <ScorePill
            label="بنگاه"
            value={FS}
            dotClass="bg-emerald-500 dark:bg-emerald-400"
            valueClass="text-emerald-600 dark:text-emerald-300"
          />
          <ScorePill
            label="ترکیب"
            value={combinedScore}
            dotClass="bg-amber-500 dark:bg-amber-400"
            valueClass="text-amber-600 dark:text-amber-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={resetToBlank}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-rose-400/40 dark:hover:bg-rose-500/10 dark:hover:text-rose-200"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v5M14 11v5" />
            </svg>
            <span>پاک‌سازی فرم</span>
          </button>

          <button
            type="button"
            onClick={fillSample}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-teal-600 to-emerald-500 px-3.5 py-2 text-xs font-black text-white shadow-lg shadow-teal-950/40 transition hover:brightness-110"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3l1.8 4.6L18.5 9.4 13.8 11.2 12 16l-1.8-4.8L5.5 9.4l4.7-1.8L12 3z" />
              <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
            </svg>
            <span>پر کردن نمونه آزمایشی</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
            title={theme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-indigo-400/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-200"
          >
            {theme === 'dark' ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="h-px bg-gradient-to-l from-transparent via-indigo-400/60 to-transparent" />
    </header>
  )
}
