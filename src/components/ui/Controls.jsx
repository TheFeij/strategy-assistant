import { useState } from 'react'
import { toFaNumber } from '../../utils/numbers'

export function AiConsult({ hint, onApply, applyLabel, children, buttonLabel = '🤖 مشورت با AI', className = '' }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 px-2.5 py-1 rounded-lg font-extrabold inline-flex items-center gap-1 transition"
      >
        <span>{buttonLabel}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[80vw] z-40 bg-teal-950 text-teal-50 p-3 rounded-xl text-xs space-y-2 border border-teal-700 shadow-2xl text-right">
          {children}
          {hint && <p className="text-xs leading-relaxed text-teal-100">{hint}</p>}
          {onApply && (
            <button
              type="button"
              onClick={onApply}
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold px-2.5 py-1 rounded-lg text-xs"
            >
              {applyLabel || 'قرار دادن عدد پیشنهادی AI'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function Range({ value, onChange, tone = 'indigo', answered = value != null, ...rest }) {
  const toneClass = tone === 'ai' ? 'ai-range' : tone === 'emerald' ? 'emerald-range' : ''
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

export function AnswerBadge({ value, tone = 'indigo', emptyText = 'پاسخ داده نشده' }) {
  const answered = value != null
  const toneClass =
    tone === 'emerald'
      ? 'bg-emerald-600 text-white'
      : tone === 'teal'
        ? 'bg-teal-600 text-white'
        : tone === 'amber'
          ? 'bg-amber-600 text-white'
          : tone === 'purple'
            ? 'bg-purple-600 text-white'
            : 'bg-indigo-600 text-white'
  return (
    <span
      className={`text-xs font-black px-2.5 py-1 rounded-lg shrink-0 ${
        answered ? toneClass : 'bg-amber-100 text-amber-800'
      }`}
    >
      {answered ? toFaNumber(Number(value).toFixed(1)) : emptyText}
    </span>
  )
}
