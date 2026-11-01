import { useState } from 'react'
import { toFaNumber } from '../../utils/numbers'

export function AiConsult({ hint, onApply, applyLabel, children, buttonLabel = '🤖 مشورت با AI', className = '' }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-300 px-2.5 py-1 rounded-lg font-extrabold inline-flex items-center gap-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <span>{buttonLabel}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[80vw] z-40 bg-midnight text-white p-3 rounded-xl text-xs space-y-2 border border-midnight-600 shadow-raised text-right">
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

export function Range({ value, onChange, tone = 'industry', answered = value != null, ...rest }) {
  const toneClass =
    tone === 'ai' ? 'ai-range' : tone === 'brand' ? 'brand-range' : tone === 'industry' ? 'industry-range' : ''
  return (
    <input
      type="range"
      min="1"
      max="5"
      step="0.5"
      value={answered ? value : 3.0}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={`${answered ? '' : 'unanswered-range'} ${toneClass}`}
      {...rest}
    />
  )
}

export function AnswerBadge({ value, tone = 'industry', emptyText = 'پاسخ داده نشده' }) {
  const answered = value != null
  const toneClass =
    tone === 'brand'
      ? 'bg-brand-600 text-white'
      : tone === 'gold'
        ? 'bg-gold-500 text-midnight'
        : 'bg-industry-600 text-white'
  return (
    <span
      className={`text-xs font-black px-2.5 py-1 rounded-lg shrink-0 ${
        answered ? toneClass : 'bg-gold-100 text-gold-800 border border-gold-200'
      }`}
    >
      {answered ? toFaNumber(Number(value).toFixed(1)) : emptyText}
    </span>
  )
}
