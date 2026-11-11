import { useEffect, useId, useRef, useState } from 'react'
import { toFaNumber } from '../../utils/numbers'

const DEFAULT_SCALE_OPTIONS = [1, 2, 3, 4, 5]

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
        className="text-xs bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-300 px-2.5 py-1 rounded-lg font-extrabold inline-flex items-center gap-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
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
 * Discrete five-point evaluation control.
 *
 * Keeps the ordinal 1..5 contract while making the whole segment clickable.
 * Values coming from older/AI data can be fractional; the closest segment is
 * highlighted for display, but every user selection writes an integer.
 */
export function SegmentedScale({
  value,
  onChange,
  options = DEFAULT_SCALE_OPTIONS,
  lowLabel,
  highLabel,
  tooltips = {},
  ariaLabel = 'امتیاز ارزیابی',
  className = '',
  disabled = false,
}) {
  const buttonRefs = useRef([])
  const numericValue = value == null || value === '' ? null : Number(value)
  const selected =
    numericValue == null || Number.isNaN(numericValue)
      ? null
      : options.reduce((closest, option) =>
          Math.abs(option - numericValue) < Math.abs(closest - numericValue) ? option : closest,
        )
  const selectedIndex = selected == null ? -1 : options.indexOf(selected)

  const choose = (option) => {
    onChange?.(option)
  }

  const selectAt = (index) => {
    buttonRefs.current[index]?.focus()
    choose(options[index])
  }

  const handleKeyDown = (event, index) => {
    let nextIndex = null
    // The grid is rendered in RTL (۱ on the right). Arrow keys therefore move
    // with the visual direction, not the numeric order, which is what users see.
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = index - 1
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = index + 1
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = options.length - 1
    else return

    event.preventDefault()
    selectAt(Math.max(0, Math.min(options.length - 1, nextIndex)))
  }

  return (
    <div className={`relative w-full ${className}`}>
      {(lowLabel || highLabel) && (
        <div className="mb-1.5 flex items-start justify-between gap-3 text-[0.7rem] leading-5 text-muted">
          <span className="max-w-[48%] text-right font-semibold">{lowLabel}</span>
          <span className="max-w-[48%] text-left font-semibold">{highLabel}</span>
        </div>
      )}

      <div
        role="radiogroup"
        aria-label={ariaLabel}
        dir="rtl"
        className="grid grid-cols-5 gap-0.5 rounded-lg border border-line bg-canvas p-0.5"
      >
        {options.map((option, index) => {
          const isSelected = selected === option
          const tooltip = tooltips[option]
          const isTabStop = selectedIndex === -1 ? index === 0 : selectedIndex === index
          return (
            <button
              key={option}
              ref={(node) => {
                buttonRefs.current[index] = node
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${toFaNumber(option)}${tooltip ? ` — ${tooltip}` : ''}`}
              tabIndex={isTabStop ? 0 : -1}
              disabled={disabled}
              onClick={() => choose(option)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`flex h-8 min-w-0 items-center justify-center rounded-md text-xs font-extrabold tabular-nums transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected
                  ? 'border border-brand-600 bg-brand-600 text-white'
                  : 'border border-transparent bg-white text-midnight-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800'
              }`}
            >
              {toFaNumber(option)}
            </button>
          )
        })}
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
