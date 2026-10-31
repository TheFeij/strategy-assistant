import { useStrategy } from '../../state/StrategyContext'
import { envFactorsMulti, forceNames } from '../../data/porter'
import { AiConsult, AnswerBadge, Range } from '../ui/Controls'

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
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900">
              سنجش ۴ فاکتور محیطی مؤثر بر نیروهای رقابتی (هر فاکتور با ۳ سوال ملموس + مشورت با AI)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              به جای یک سوال کلی، برای هر فاکتور به ۳ سوال ساده پاسخ دهید (یا با کلیک روی{' '}
              <strong>«🤖 مشورت با AI»</strong>، تحلیل صنعت و اعداد پیشنهادی هوش مصنوعی را اعمال کنید) تا اثر هر فاکتور بر
              ۵ نیرو محاسبه شود.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {envFactorsMulti.map((ef) => (
            <div key={ef.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-black text-slate-900">{ef.title}</h4>
                <AiConsult
                  buttonLabel="🤖 مشورت با AI و درج خودکار"
                  hint={ef.aiSummary}
                  onApply={() => applyAiEnvFactor(ef.id)}
                  applyLabel="قرار دادن اعداد پیشنهادی AI برای این فاکتور"
                />
              </div>
              <div className="space-y-2">
                {ef.questions.map((q) => {
                  const value = envAnswers[q.id] ?? null
                  const answered = value != null
                  return (
                    <div
                      key={q.id}
                      className={`bg-white p-3 rounded-xl border space-y-1.5 ${answered ? 'border-indigo-200' : 'border-slate-200'}`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-slate-800">{q.text}</span>
                        <AnswerBadge value={value} />
                      </div>
                      <Range value={value} answered={answered} onChange={(v) => setEnvAnswer(q.id, v)} />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>۱ = کاملاً مخالفم / خیلی کم</span>
                        <span>۵ = کاملاً موافقم / خیلی زیاد</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 overflow-x-auto">
          <h4 className="text-xs font-extrabold text-slate-800 mb-3">
            جدول محاسبه اثر ۴ فاکتور محیطی بر تغییر شدت هر یک از ۵ نیرو در آینده
          </h4>
          <table className="w-full text-xs text-right border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 bg-slate-100">
                <th className="py-2.5 px-3">نیروی رقابتی پورتر</th>
                <th className="py-2.5 px-2 text-center">فشار فعلی نیرو</th>
                <th className="py-2.5 px-2 text-center">۱. اثر نرخ رشد صنعت</th>
                <th className="py-2.5 px-2 text-center">۲. اثر فناوری و نوآوری</th>
                <th className="py-2.5 px-2 text-center">۳. اثر قوانین دولت</th>
                <th className="py-2.5 px-2 text-center">۴. اثر محصولات مکمل</th>
                <th className="py-2.5 px-3 text-center font-black text-indigo-900">فشار آینده نیرو (۱ تا ۵)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {forceNames.map((fn, fIdx) => (
                <tr key={fn}>
                  <td className="py-2 px-3 font-bold">{fn}</td>
                  <td className="py-2 px-2 text-center font-mono font-bold">
                    {forceScores[fIdx] != null ? forceScores[fIdx].toFixed(2) : '—'}
                  </td>
                  {envEffects[fIdx].map((eff, eIdx) => (
                    <td
                      key={eIdx}
                      className={`py-2 px-2 text-center font-mono ${
                        eff < 0 ? 'text-emerald-700 font-bold' : eff > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {eff > 0 ? '+' : ''}
                      {eff.toFixed(2)}
                    </td>
                  ))}
                  <td className="py-2 px-3 text-center font-mono font-black text-indigo-800">
                    {hasForces ? F_fut_arr[fIdx].toFixed(2) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-slate-400 mt-2">
            ضریب هر فاکتور از میانگین پاسخ‌ها در بازه ۱− تا ۱+ نرمال می‌شود؛ مقادیر خنثی (بدون پاسخ) صفر در نظر گرفته
            می‌شوند.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3">
        <button
          type="button"
          onClick={() => setMod1Tab(2)}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl"
        >
          بازگشت به تب ۲ (۵ نیرو)
        </button>
        <button
          type="button"
          onClick={() => setMod1Tab(4)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md flex items-center gap-2"
        >
          <span>مشاهده تب ۴: امتیاز نهایی صنعت و استراتژی پورتر</span>
          <span>←</span>
        </button>
      </div>

      <p className="sr-only">میانگین ضرایب: {envMultipliers.map((x) => x.toFixed(2)).join(', ')}</p>
    </div>
  )
}
