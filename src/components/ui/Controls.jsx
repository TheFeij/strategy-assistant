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
      'text-midnight-600 bg-midnight-50 border-midnight-200 dark:text-midnight-200 dark:bg-white/10 dark:border-white/15',
  },
  2: {
    label: 'کم',
    badgeClass:
      'text-midnight-700 bg-midnight-50 border-midnight-200 dark:text-midnight-100 dark:bg-white/10 dark:border-white/15',
  },
  3: {
    label: 'حد وسط',
    badgeClass:
      'text-midnight-700 bg-midnight-100 border-midnight-300 dark:text-midnight-100 dark:bg-white/10 dark:border-white/20',
  },
  4: {
    label: 'زیاد',
    badgeClass:
      'text-midnight-800 bg-midnight-100 border-midnight-300 dark:text-midnight-100 dark:bg-white/15 dark:border-white/20',
  },
  5: {
    label: 'بسیار زیاد',
    badgeClass:
      'text-midnight-900 bg-midnight-200 border-midnight-400 dark:text-white dark:bg-white/15 dark:border-white/25',
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

/**
 * Numberless, RTL-aware five-point evaluation control.
 *
 * Renders a continuous neutral track (light → dark) that snaps to the five
 * ordinal steps, with a qualitative status pill and clickable tick dots. The
 * neutral palette deliberately avoids green/red so higher values are not
 * visually framed as inherently good or bad.
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
                        ? 'h-2 w-2 bg-midnight-800 dark:bg-midnight-100'
                        : 'h-1.5 w-1.5 bg-midnight-300 group-hover:bg-midnight-500 dark:bg-midnight-500 dark:group-hover:bg-midnight-300'
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
