import { useStrategy } from '../../state/StrategyContext'
import { envFactorsMulti, forceNames } from '../../data/porter'
import { AiConsult, AnswerBadge, ScaleInfo, SegmentedScale } from '../ui/Controls'
import { toFaNumber } from '../../utils/numbers'

export default function TabEnv() {
  const {
    envAnswers,
    envMultipliers,
    envEffects,
    setEnvAnswer,
    applyAiEnvFactor,
    forceScores,
    F_fut_arr,
    setMod1Tab,
  } = useStrategy()

  const hasForces = forceScores.some((x) => x !== null)

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {envFactorsMulti.map((ef) => (
            <div
              key={ef.id}
              className="bg-white rounded-xl p-4 border border-line border-r-4 !border-r-industry-400 flex h-full flex-col gap-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-line pb-2.5">
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-midnight-900">{ef.title}</h4>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-[0.7rem] text-muted">
                    <span aria-hidden="true">🤖</span>
                    <span>مشورت AI</span>
                  </span>
                </div>
                <AiConsult
                  buttonLabel="🤖 مشورت با AI و درج خودکار"
                  hint={ef.aiSummary}
                  onApply={() => applyAiEnvFactor(ef.id)}
                  applyLabel="قرار دادن اعداد پیشنهادی AI برای این فاکتور"
                  panelAlign="left"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3">
                {ef.questions.map((q) => {
                  const value = envAnswers[q.id] ?? null
                  return (
                    <div key={q.id} className="flex flex-1 flex-col gap-2 rounded-lg border border-line bg-canvas/60 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-6 text-midnight-800">{q.text}</p>
                        <AnswerBadge value={value} emptyText="بدون پاسخ" />
                      </div>
                      <SegmentedScale
                        value={value}
                        onChange={(v) => setEnvAnswer(q.id, v)}
                        lowLabel="خیلی کم"
                        highLabel="خیلی زیاد"
                        ariaLabel={q.text}
                        tooltips={{
                          1: 'کاملاً مخالفم / خیلی کم',
                          2: 'مخالفم / کم',
                          3: 'بی‌نظر / متوسط',
                          4: 'موافقم / زیاد',
                          5: 'کاملاً موافقم / خیلی زیاد',
                        }}
                      />
                      <ScaleInfo>
                        ۱ = کاملاً مخالفم / خیلی کم؛ ۲ = مخالفم / کم؛ ۳ = بی‌نظر / متوسط؛ ۴ = موافقم / زیاد؛ ۵ =
                        کاملاً موافقم / خیلی زیاد. این پاسخ در محاسبه اثر فاکتور «{ef.title}» بر پنج نیروی پورتر استفاده
                        می‌شود.
                      </ScaleInfo>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-canvas rounded-2xl p-4 border border-line overflow-x-auto">
          <h4 className="text-xs font-extrabold text-midnight-800 mb-3">
            جدول محاسبه اثر ۴ فاکتور محیطی بر تغییر شدت هر یک از ۵ نیرو در آینده
          </h4>
          <table className="w-full text-xs text-right border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-line text-midnight-700 bg-midnight-50">
                <th className="py-2.5 px-3">نیروی رقابتی پورتر</th>
                <th className="py-2.5 px-2 text-center">فشار فعلی نیرو</th>
                <th className="py-2.5 px-2 text-center">۱. اثر نرخ رشد صنعت</th>
                <th className="py-2.5 px-2 text-center">۲. اثر فناوری و نوآوری</th>
                <th className="py-2.5 px-2 text-center">۳. اثر قوانین دولت</th>
                <th className="py-2.5 px-2 text-center">۴. اثر محصولات مکمل</th>
                <th className="py-2.5 px-3 text-center font-black text-industry-900">فشار آینده نیرو (۱ تا ۵)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {forceNames.map((fn, fIdx) => (
                <tr key={fn}>
                  <td className="py-2 px-3 font-bold">{fn}</td>
                  <td className="py-2 px-2 text-center tabular-nums font-bold">
                    {forceScores[fIdx] != null ? toFaNumber(forceScores[fIdx].toFixed(2)) : '—'}
                  </td>
                  {envEffects[fIdx].map((eff, eIdx) => (
                    <td
                      key={eIdx}
                      className={`py-2 px-2 text-center tabular-nums ${
                        eff < 0 ? 'text-brand-700 font-bold' : eff > 0 ? 'text-gold-800 font-bold' : 'text-muted'
                      }`}
                    >
                      {eff > 0 ? '+' : ''}
                      {toFaNumber(eff.toFixed(2))}
                    </td>
                  ))}
                  <td className="py-2 px-3 text-center tabular-nums font-black text-industry-800">
                    {hasForces ? toFaNumber(F_fut_arr[fIdx].toFixed(2)) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted mt-2">
            ضریب هر فاکتور از میانگین پاسخ‌ها در بازه ۱− تا ۱+ نرمال می‌شود؛ مقادیر خنثی (بدون پاسخ) صفر در نظر گرفته
            می‌شوند.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3">
        <button
          type="button"
          onClick={() => setMod1Tab(2)}
          className="bg-canvas hover:bg-line text-ink text-xs font-bold px-4 py-2.5 rounded-xl border border-line transition"
        >
          بازگشت به سنجش ۵ نیرو
        </button>
        <button
          type="button"
          onClick={() => setMod1Tab(4)}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-sm flex items-center gap-2 transition"
        >
          <span>مشاهده امتیاز نهایی صنعت و استراتژی پورتر</span>
          <span>←</span>
        </button>
      </div>

      <p className="sr-only">میانگین ضرایب: {envMultipliers.map((x) => toFaNumber(x.toFixed(2))).join('، ')}</p>
    </div>
  )
}
