import { useStrategy } from '../../state/StrategyContext'
import { toFaNumber } from '../../utils/numbers'

function ScorePill({ label, value, dotClass, valueClass }) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition hover:bg-canvas dark:hover:bg-white/5">
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      <span className="text-xs text-muted dark:text-muted">{label}</span>
      <strong className={`text-sm font-black ${valueClass}`}>{value != null ? toFaNumber(value) : '—'}</strong>
    </div>
  )
}

export default function Header() {
  const { navigate, IS_current, FS, combinedScore, resetToBlank, fillSample, theme, toggleTheme } =
    useStrategy()

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 text-ink shadow-sm backdrop-blur dark:border-midnight-700 dark:bg-midnight-950/90 dark:text-white">
      <div className="relative mx-auto flex min-h-16 max-w-[84rem] flex-wrap items-center justify-between gap-3 px-3 py-2.5 sm:px-5">
        <button type="button" className="flex items-center gap-3 text-right" onClick={() => navigate('home')}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-midnight via-midnight-800 to-brand-700 text-white shadow-sm ring-1 ring-midnight-900/10">
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
              <span className="bg-gradient-to-l from-brand-700 to-industry-700 bg-clip-text text-transparent dark:from-brand-300 dark:to-industry-300">
                Pro
              </span>
              <span className="mr-1.5 align-middle text-xs font-bold text-muted dark:text-muted">
                v3.0
              </span>
            </div>
          </div>
        </button>

        <div className="pointer-events-none order-3 flex w-full items-center justify-center gap-1 rounded-2xl border border-line bg-canvas p-1 lg:absolute lg:left-1/2 lg:top-1/2 lg:order-none lg:w-auto lg:-translate-x-1/2 lg:-translate-y-1/2 dark:border-white/10 dark:bg-white/[0.04]">
          <ScorePill
            label="صنعت"
            value={IS_current}
            dotClass="bg-industry-500 dark:bg-industry-400"
            valueClass="text-industry-700 dark:text-industry-300"
          />
          <ScorePill
            label="بنگاه"
            value={FS}
            dotClass="bg-brand-500 dark:bg-brand-400"
            valueClass="text-brand-700 dark:text-brand-300"
          />
          <ScorePill
            label="ترکیب"
            value={combinedScore}
            dotClass="bg-gold-500 dark:bg-gold-400"
            valueClass="text-gold-800 dark:text-gold-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={resetToBlank}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 text-xs font-bold text-muted transition hover:border-gold-300 hover:bg-gold-50 hover:text-gold-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-midnight-300 dark:hover:border-gold-400/40 dark:hover:bg-gold-500/10 dark:hover:text-gold-200"
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
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-black text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
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
            className="inline-flex items-center justify-center rounded-xl border border-line bg-canvas p-2.5 text-muted transition hover:border-industry-300 hover:bg-industry-50 hover:text-industry-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-midnight-300 dark:hover:border-industry-400/40 dark:hover:bg-industry-500/10 dark:hover:text-industry-200"
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
      <div className="h-px bg-gradient-to-l from-transparent via-brand-500/30 to-transparent" />
    </header>
  )
}
