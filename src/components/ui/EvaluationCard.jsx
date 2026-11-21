import { ScaleInfo, SegmentedScale } from './Controls'
import { toFaNumber } from '../../utils/numbers'

/**
 * Shared presentation shell for one ordinal evaluation item.
 * All criterion-specific copy is supplied through props.
 */
export default function EvaluationCard({
  number,
  title,
  question,
  value,
  onChange,
  lowLabel,
  highLabel,
  scaleLabels,
  tooltips,
  sourceIcon,
  sourceLabel,
  tag,
  detail,
  detailLabel = 'توضیح کامل معیار',
  note,
  ariaLabel,
  action,
  disabled = false,
  className = '',
}) {
  return (
    <article
      className={`flex h-full min-w-0 flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm transition-[box-shadow,border-color] duration-200 hover:border-brand-200 hover:shadow-card sm:p-5 ${className}`}
    >
      <header className="flex items-start gap-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          {number != null && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm font-black text-brand-700">
              {toFaNumber(number)}
            </span>
          )}
          <h4 className="min-w-0 text-sm font-extrabold leading-6 text-midnight-900">{title}</h4>
        </div>
      </header>

      {(sourceLabel || tag) && (
        <div className="-mt-1.5 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[0.7rem] text-muted">
          <div className="flex flex-wrap items-center gap-2">
            {sourceLabel && (
              <span className="inline-flex items-center gap-1">
                {sourceIcon && <span aria-hidden="true">{sourceIcon}</span>}
                <span>{sourceLabel}</span>
              </span>
            )}
            {tag && (
              <span className="rounded-md border border-line bg-canvas px-1.5 py-0.5 font-semibold text-muted">
                {tag}
              </span>
            )}
          </div>
        </div>
      )}

      {question && <p className="text-sm leading-6 text-midnight-800">{question}</p>}

      {note && (
        <div className="rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-2 text-xs leading-relaxed text-brand-900">
          {note}
        </div>
      )}

      <div className="mt-auto space-y-3 pt-1">
        <SegmentedScale
          value={value}
          onChange={onChange}
          lowLabel={lowLabel}
          highLabel={highLabel}
          labels={scaleLabels}
          tooltips={tooltips}
          ariaLabel={ariaLabel || title || question}
          disabled={disabled}
        />
        {(detail || action) && (
          <div className="flex min-h-9 flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
            {detail ? (
              <ScaleInfo label={detailLabel} title={detailLabel}>
                {detail}
              </ScaleInfo>
            ) : (
              <span aria-hidden="true" />
            )}
            {action}
          </div>
        )}
      </div>
    </article>
  )
}
