import { useStrategy } from '../../state/StrategyContext'
import { pfiAppropriability } from '../../data/pfi'
import { toFaNumber } from '../../utils/numbers'
import PfiQuestionCard from './PfiQuestionCard'

export default function TabAppropriability() {
  const {
    pfiAnswers,
    setPfiAnswer,
    setMod4Tab,
    pfiBarneySupport,
    pfiBarneyAmbigPct,
  } = useStrategy()

  const support = pfiBarneySupport != null ? Math.round(pfiBarneySupport * 2) / 2 : null

  return (
    <div className="bg-white rounded-2xl p-4 border border-line shadow-sm space-y-4">
      <div className="bg-canvas border border-line border-r-4 !border-r-midnight-400 rounded-2xl p-4 text-sm space-y-1">
        <span className="font-extrabold text-midnight-900 block">چقدر می‌توانید جلوی کپی کردن رقبا را بگیرید؟</span>
        <p className="leading-relaxed text-muted">
          توان قانونی، راز تجاری پنهان و زمان لازم برای تقلید را بسنجید.
        </p>
      </div>

      {support != null && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-xs text-brand-900">
          <span className="leading-relaxed">
            <strong className="font-black">پشتوانه تقلیدناپذیری از تحلیل بنگاه:</strong> پیچیدگی اجتماعی{' '}
            {toFaNumber(support.toFixed(1))} از ۵
            {pfiBarneyAmbigPct != null && <> و ابهام علی استنتاج‌شده {toFaNumber(pfiBarneyAmbigPct)}٪</>}
          </span>
          <button
            type="button"
            onClick={() => setPfiAnswer('q2', support)}
            className="shrink-0 rounded-lg bg-brand-700 px-2.5 py-1.5 text-xs font-extrabold text-white transition hover:bg-brand-800"
          >
            اعمال در سوال ۲ ({toFaNumber(support.toFixed(1))})
          </button>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {pfiAppropriability.map((q, idx) => (
          <PfiQuestionCard
            key={q.id}
            question={q}
            number={idx + 1}
            value={pfiAnswers[q.id]}
            onChange={(v) => setPfiAnswer(q.id, v)}
            className="w-full lg:w-[calc(50%-0.5rem)]"
          />
        ))}
      </div>

      <div className="flex justify-end border-t border-line pt-3">
        <button
          type="button"
          onClick={() => setMod4Tab(2)}
          className="bg-midnight hover:bg-midnight-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-sm flex items-center gap-2 transition"
        >
          <span>ادامه به استاندارد بازار و معیار مشتری</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
