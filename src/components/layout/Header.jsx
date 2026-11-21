import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useStrategy } from '../../state/StrategyContext'
import { toFaNumber } from '../../utils/numbers'
import AiStatusBadge from '../ai/AiStatusBadge'

function ScorePill({ label, value, dotClass, valueClass }) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition hover:bg-canvas dark:hover:bg-white/5">
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      <span className="text-xs text-muted dark:text-muted">{label}</span>
      <strong className={`text-sm font-black ${valueClass}`}>{value != null ? toFaNumber(value) : '—'}</strong>
    </div>
  )
}

const displayModes = [
  {
    id: 'light',
    label: 'روشن',
    hint: 'حالت پیش‌فرض',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    id: 'dark',
    label: 'تاریک',
    hint: 'محیط کم‌نور',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    ),
  },
  {
    id: 'contrast',
    label: 'کنتراست بالا',
    hint: 'مناسب نمایش با پروژکتور',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

export default function Header() {
  const {
    navigate,
    IS_current,
    FS,
    combinedScore,
    pfiFirmShare,
    resetToBlank,
    fillSample,
    theme,
    setTheme,
    highContrast,
    setHighContrast,
  } = useStrategy()
  const [modeOpen, setModeOpen] = useState(false)

  useEffect(() => {
    if (!modeOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setModeOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [modeOpen])

  const activeMode = highContrast ? 'contrast' : theme
  const activeModeDef = displayModes.find((mode) => mode.id === activeMode) ?? displayModes[0]

  const chooseMode = (mode) => {
    if (mode === 'contrast') {
      setHighContrast(true)
    } else {
      setHighContrast(false)
      setTheme(mode)
    }
    setModeOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 text-ink shadow-sm backdrop-blur dark:border-midnight-700 dark:bg-midnight-950/90 dark:text-white">
      <div className="relative mx-auto flex min-h-16 max-w-[84rem] flex-wrap items-center justify-between gap-3 px-3 py-2.5 sm:px-5 xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <button type="button" className="flex items-center gap-3 text-right xl:min-w-0 xl:justify-self-start" onClick={() => navigate('home')}>
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

        <div className="pointer-events-none order-3 flex w-full flex-wrap items-center justify-center gap-1 rounded-2xl border border-line bg-canvas p-1 xl:order-none xl:w-auto xl:min-w-0 xl:justify-self-center dark:border-white/10 dark:bg-white/[0.04]">
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
          <ScorePill
            label="سهم سود"
            value={pfiFirmShare != null ? `${toFaNumber(pfiFirmShare)}٪` : null}
            dotClass="bg-midnight-400 dark:bg-midnight-300"
            valueClass="text-midnight-800 dark:text-midnight-200"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 xl:min-w-0 xl:justify-self-end">
          <AiStatusBadge />
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
            onClick={() => setModeOpen((open) => !open)}
            aria-haspopup="dialog"
            aria-expanded={modeOpen}
            aria-label="انتخاب حالت نمایش"
            title="حالت نمایش: روشن، تاریک یا کنتراست بالا"
            className={`inline-flex items-center justify-center rounded-xl border p-2.5 transition ${
              highContrast
                ? 'border-midnight bg-midnight text-white dark:border-brand-300 dark:bg-brand-300 dark:text-midnight-950'
                : 'border-line bg-canvas text-muted hover:border-industry-300 hover:bg-industry-50 hover:text-industry-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-midnight-300 dark:hover:border-industry-400/40 dark:hover:bg-industry-500/10 dark:hover:text-industry-200'
            }`}
          >
            <span className="[&>svg]:h-4 [&>svg]:w-4">{activeModeDef.icon}</span>
          </button>
        </div>
      </div>

      {modeOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-midnight-950/45 p-4 backdrop-blur-sm"
            onClick={() => setModeOpen(false)}
            role="presentation"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="display-mode-title"
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-xs overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-card dark:border-midnight-700 dark:bg-midnight-900 dark:text-white"
            >
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 dark:border-white/10">
                <div>
                  <h2 id="display-mode-title" className="text-sm font-black">
                    حالت نمایش
                  </h2>
                  <p className="mt-0.5 text-[11px] text-muted">یک حالت را انتخاب کنید</p>
                </div>
                <button
                  type="button"
                  onClick={() => setModeOpen(false)}
                  aria-label="بستن"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-canvas hover:text-ink dark:hover:bg-white/10 dark:hover:text-white"
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
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>

              <div className="space-y-1.5 p-2.5">
                {displayModes.map((mode) => {
                  const selected = activeMode === mode.id
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => chooseMode(mode.id)}
                      aria-pressed={selected}
                      className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-right transition ${
                        selected
                          ? 'border-brand-500 bg-brand-50 dark:border-brand-300 dark:bg-brand-500/15'
                          : 'border-transparent hover:border-line hover:bg-canvas dark:hover:border-white/10 dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg [&>svg]:h-5 [&>svg]:w-5 ${
                          selected
                            ? 'bg-brand-600 text-white'
                            : 'bg-canvas text-muted dark:bg-white/[0.06] dark:text-midnight-200'
                        }`}
                      >
                        {mode.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-extrabold">{mode.label}</span>
                        <span className="mt-0.5 block text-xs text-muted">{mode.hint}</span>
                      </span>
                      {selected && (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12.5l4.5 4.5L19 7" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>,
          document.body
        )}
      <div className="h-px bg-gradient-to-l from-transparent via-brand-500/30 to-transparent" />
    </header>
  )
}
