import { useStrategy } from '../../state/StrategyContext'
import { getPfiAiBenchmark } from '../../data/pfi'
import AiConsult from '../ai/AiConsult'
import EvaluationCard from '../ui/EvaluationCard'

const stripScore = (raw = '') => raw.replace(/^\s*[۰-۹]+\s*=\s*/, '').trim()

export default function PfiQuestionCard({ question, number, value, onChange, disabled = false, note, className = '' }) {
  const { selectedIranIndustryId, pfiAnswers } = useStrategy()
  const isAi = question.source === 'ai'
  const benchmark = isAi ? getPfiAiBenchmark(selectedIranIndustryId, question.aiKey) : null
  const [lowDetail, highDetail] = question.anchor.split('|').map(stripScore)

  const aiContext = {
    module: 'mod4',
    tab: 'PFI — سهم سود نوآوری',
    subject: question.title,
    criterion: question.question,
    scale: { min: 1, max: 5, low: question.lowLabel, high: question.highLabel },
    currentValue: value,
    relatedAnswers: Object.fromEntries(
      Object.entries(pfiAnswers || {}).filter(([, answer]) => answer != null && answer !== ''),
    ),
  }

  return (
    <EvaluationCard
      number={number}
      title={question.question}
      value={value}
      onChange={onChange}
      lowLabel={question.lowLabel}
      highLabel={question.highLabel}
      scaleLabels={question.scaleLabels}
      tooltips={{ 1: lowDetail, 5: highDetail }}
      sourceIcon={isAi ? null : '👤'}
      sourceLabel={isAi ? null : 'سوال مستقیم از مدیرعامل · مشورت AI'}
      ariaLabel={`${question.title} — امتیاز از ۱ تا ۵`}
      detail={
        <div className="space-y-1.5">
          <p>
            <strong className="text-midnight-700">هدف سوال: </strong>
            {question.title}
          </p>
          <p>
            <strong className="text-midnight-700">مقیاس کامل: </strong>
            {lowDetail}؛ {highDetail}
          </p>
          {isAi && benchmark?.hint && <p className="text-midnight-600">{benchmark.hint}</p>}
        </div>
      }
      action={
        <AiConsult
          consultKey={`pfi:${question.id}`}
          context={aiContext}
          fallbackValue={isAi ? benchmark?.rec : undefined}
          onApply={
            disabled
              ? undefined
              : (score) => {
                  const next = score ?? (isAi ? benchmark?.rec : undefined)
                  if (next != null) onChange(next)
                }
          }
        />
      }
      note={note}
      disabled={disabled}
      className={className}
    />
  )
}
