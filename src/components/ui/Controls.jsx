import { useEffect, useId, useRef, useState } from 'react'

const DEFAULT_SCALE_OPTIONS = [1, 2, 3, 4, 5]

/**
 * Qualitative feedback for each step of an ordinal 1..5 scale.
 * The numeric score stays internal; users only see the label and its tone.
 * `labels` on <SegmentedScale> can override the wording per criterion while
 * the color tone remains consistent across the app.
 */
const SCALE_LEVEL_META = {
  1: {
    label: 'بسیار کم',
    badgeClass:
      'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-500/15 dark:border-rose-400/30',
  },
  2: {
    label: 'کم',
    badgeClass:
      'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/15 dark:border-amber-400/30',
  },
  3: {
    label: 'حد وسط',
    badgeClass:
      'text-midnight-600 bg-white border-midnight-200 dark:text-midnight-200 dark:bg-midnight-800 dark:border-midnight-600',
  },
  4: {
    label: 'زیاد',
    badgeClass:
      'text-brand-800 bg-brand-50 border-brand-200 dark:text-brand-300 dark:bg-brand-500/15 dark:border-brand-400/30',
  },
  5: {
    label: 'بسیار زیاد',
    badgeClass:
      'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/15 dark:border-emerald-400/30',
  },
}

const UNANSWERED_META = {
  label: 'انتخاب نشده',
  badgeClass:
    'text-midnight-500 bg-white border-midnight-200 dark:text-midnight-300 dark:bg-midnight-800 dark:border-midnight-600',
}

function levelMeta(option, index, labels) {
  const base = SCALE_LEVEL_META[option] ?? SCALE_LEVEL_META[index + 1] ?? SCALE_LEVEL_META[1]
  const customLabel = Array.isArray(labels) ? labels[index] : labels?.[option]
  return customLabel ? { ...base, label: customLabel } : base
}

export function AiConsult({
  hint,
  onApply,
  applyLabel,
  children,
  buttonLabel = '🤖 مشورت با AI',
  className = '',
  panelAlign = 'right',
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-extrabold text-brand-800 transition-colors hover:border-brand-300 hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <span>{buttonLabel}</span>
      </button>
      {open && (
        <div
          className={`absolute ${panelAlign === 'left' ? 'left-0' : 'right-0'} top-full mt-2 w-80 max-w-[80vw] z-40 bg-midnight text-white p-3 rounded-xl text-xs space-y-2 border border-midnight-600 shadow-raised text-right`}
        >
          {children}
          {hint && <p className="text-xs leading-relaxed text-midnight-200">{hint}</p>}
          {onApply && (
            <button
              type="button"
              onClick={onApply}
              className="bg-brand-500 hover:bg-brand-400 text-white font-extrabold px-2.5 py-1 rounded-lg text-xs transition"
            >
              {applyLabel || 'قرار دادن عدد پیشنهادی AI'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Numberless, RTL-aware five-point evaluation control.
 *
 * Renders a continuous rose → amber → emerald track that snaps to the five
 * ordinal steps, with a qualitative status pill and clickable tick dots. The
 * numeric 1..5 contract is preserved: values set by AI can be fractional, the
 * closest step is shown, and every user selection writes an integer.
 */
export function SegmentedScale({
  value,
  onChange,
  options = DEFAULT_SCALE_OPTIONS,
  lowLabel,
  highLabel,
  labels,
  tooltips = {},
  ariaLabel = 'امتیاز ارزیابی',
  className = '',
  disabled = false,
}) {
  const min = options[0]
  const max = options[options.length - 1]
  const middleIndex = Math.floor(options.length / 2)
  const numericValue = value == null || value === '' ? null : Number(value)
  const hasValue = numericValue != null && !Number.isNaN(numericValue)
  const snapped = hasValue
    ? options.reduce((closest, option) =>
        Math.abs(option - numericValue) <= Math.abs(closest - numericValue) ? option : closest,
      )
    : null
  const displayIndex = snapped == null ? middleIndex : options.indexOf(snapped)
  const displayValue = options[displayIndex] ?? min
  const currentMeta = hasValue ? levelMeta(displayValue, displayIndex, labels) : UNANSWERED_META

  const commit = (next) => {
    const parsed = Number(next)
    if (!Number.isNaN(parsed)) onChange?.(parsed)
  }

  const handleChange = (event) => commit(event.target.value)

  // A native range always shows a thumb, so tapping the thumb directly fires
  // no change event. Commit the neutral midpoint explicitly in that case.
  const handlePointerDown = () => {
    if (!hasValue) commit(displayValue)
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="rounded-2xl border border-midnight-100 bg-midnight-50 p-3.5 sm:p-4">
        <div
          className={`mb-3 grid items-center gap-2 ${
            lowLabel || highLabel ? 'grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]' : 'grid-cols-1 justify-items-center'
          }`}
        >
          {(lowLabel || highLabel) && (
            <span className="min-w-0 justify-self-start text-right text-[0.72rem] font-bold leading-4 text-muted">
              {lowLabel}
            </span>
          )}

          <span
            aria-hidden="true"
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.72rem] font-extrabold leading-none transition-colors duration-200 ${currentMeta.badgeClass}`}
          >
            {currentMeta.label}
          </span>

          {(lowLabel || highLabel) && (
            <span className="min-w-0 justify-self-end text-left text-[0.72rem] font-bold leading-4 text-muted">
              {highLabel}
            </span>
          )}
        </div>

        <div className="relative">
          <input
            type="range"
            dir="rtl"
            min={min}
            max={max}
            step={1}
            value={displayValue}
            onChange={handleChange}
            onPointerDown={handlePointerDown}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-valuetext={currentMeta.label}
            className={`gradient-scale-slider ${hasValue ? '' : 'is-unanswered'}`}
          />

          {/* Numberless tick marks, aligned with the five snap points. */}
          <div className="mt-1 flex justify-between px-[3px]">
            {options.map((option, index) => {
              const meta = levelMeta(option, index, labels)
              const isActive = hasValue && option === displayValue
              const tooltip = tooltips[option]
              return (
                <button
                  key={option}
                  type="button"
                  tabIndex={-1}
                  disabled={disabled}
                  onClick={() => commit(option)}
                  aria-label={tooltip ? `${meta.label} — ${tooltip}` : meta.label}
                  className="group flex h-6 w-5 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed"
                >
                  <span
                    aria-hidden="true"
                    className={`rounded-full transition-all duration-200 ${
                      isActive
                        ? 'h-2 w-2 bg-brand-600'
                        : 'h-1.5 w-1.5 bg-midnight-300 group-hover:bg-brand-400'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Backwards-compatible wrapper for the previous slider API. */
export function Range({ value, onChange, answered = value != null, tone, ...rest }) {
  return <SegmentedScale value={answered ? value : null} onChange={onChange} {...rest} />
}

/** Compact, accessible disclosure used for full endpoint explanations. */
export function ScaleInfo({ label = 'توضیح کامل مقیاس', title, children, className = '' }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={`relative text-xs ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={panelId}
        title={title}
        className="inline-flex items-center gap-1.5 rounded-md text-xs font-bold text-muted transition hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1"
      >
        <span
          aria-hidden="true"
          className="flex h-4 w-4 items-center justify-center rounded-full border border-line bg-white text-[0.6rem] font-black leading-none text-muted"
        >
          i
        </span>
        <span>{label}</span>
        <span aria-hidden="true" className="text-[0.65rem]">
          {open ? '▲' : '▼'}
        </span>
      </button>
      {open && (
        <div
          id={panelId}
          className="absolute right-0 top-full z-40 mt-2 max-h-[60vh] w-80 max-w-[80vw] overflow-y-auto rounded-xl border border-midnight-600 bg-midnight px-3 py-2.5 text-right text-xs leading-relaxed text-midnight-100 shadow-raised [&_p]:text-midnight-100 [&_strong]:text-brand-300"
        >
          {children}
        </div>
      )}
    </div>
  )
}
