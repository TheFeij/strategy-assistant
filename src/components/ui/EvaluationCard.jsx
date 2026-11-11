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
  tooltips,
  sourceIcon,
  sourceLabel,
  tag,
  detail,
  detailLabel = 'توضیح کامل معیار',
  ariaLabel,
  action,
  className = '',
}) {
  return (
    <article
      className={`flex h-full min-w-0 flex-col gap-3 rounded-xl border border-line bg-white p-4 transition-colors duration-200 hover:border-brand-200 ${className}`}
    >
      <header className="flex items-start gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {number != null && (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-midnight-50 text-[0.7rem] font-black text-midnight-700">
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

      <p className="text-sm leading-6 text-midnight-800">{question}</p>

      <div className="mt-auto space-y-2.5 pt-1">
        <SegmentedScale
          value={value}
          onChange={onChange}
          lowLabel={lowLabel}
          highLabel={highLabel}
          tooltips={tooltips}
          ariaLabel={ariaLabel || title || question}
        />
        {(detail || action) && (
          <div className="flex min-h-9 flex-wrap items-center justify-between gap-2">
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
