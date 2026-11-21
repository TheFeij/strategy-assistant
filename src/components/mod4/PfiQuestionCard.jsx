import { useStrategy } from '../../state/StrategyContext'
import { getPfiAiBenchmark } from '../../data/pfi'
import { AiConsult } from '../ui/Controls'
import EvaluationCard from '../ui/EvaluationCard'
import { toFaNumber } from '../../utils/numbers'

const stripScore = (raw = '') => raw.replace(/^\s*[۰-۹]+\s*=\s*/, '').trim()

export default function PfiQuestionCard({ question, number, value, onChange, disabled = false, note, className = '' }) {
  const { selectedIranIndustryId } = useStrategy()
  const isAi = question.source === 'ai'
  const benchmark = isAi ? getPfiAiBenchmark(selectedIranIndustryId, question.aiKey) : null
  const [lowDetail, highDetail] = question.anchor.split('|').map(stripScore)

  return (
    <EvaluationCard
      number={number}
      title={question.question}
      value={value}
      onChange={onChange}
      lowLabel={question.lowLabel}
      highLabel={question.highLabel}
      tooltips={{ 1: lowDetail, 5: highDetail }}
      sourceIcon={isAi ? '🤖' : '👤'}
      sourceLabel={isAi ? 'مشورت AI' : 'سوال مستقیم از مدیرعامل'}
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
        isAi ? (
          <AiConsult
            hint={benchmark.hint}
            onApply={() => onChange(benchmark.rec)}
            applyLabel={`قرار دادن عدد AI (${toFaNumber(benchmark.rec.toFixed(1))})`}
            panelAlign="left"
          />
        ) : null
      }
      note={note}
      disabled={disabled}
      className={className}
    />
  )
}
