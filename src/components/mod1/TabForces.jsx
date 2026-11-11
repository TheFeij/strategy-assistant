import { useStrategy } from '../../state/StrategyContext'
import { porterForcesPages } from '../../data/porter'
import { AiConsult, AnswerBadge, Range } from '../ui/Controls'
import { toFaNumber } from '../../utils/numbers'

const forceMeta = [
  { label: 'تهدید ورود' },
  { label: 'تامین‌کنندگان' },
  { label: 'خریداران' },
  { label: 'کالای جایگزین' },
  { label: 'رقبای موجود' },
]

const rivalryOptions = [
  {
    value: 'zero_sum',
    title: 'رقابت مجموع صفر (Zero-Sum)',
    desc: 'جنگ قیمتی بر سر یک کیک ثابت؛ سود یک شرکت به معنای زیان دیگری است (تشدید فشار رقابت)',
    box: 'border-gold-200 bg-gold-50/60',
    title2: 'text-gold-900',
  },
  {
    value: 'balanced',
    title: 'رقابت ترکیبی متعادل',
    desc: 'ترکیبی از رقابت قیمتی و غیرقیمتی در بخش‌های مختلف بازار',
    box: 'border-line bg-white',
    title2: 'text-midnight-800',
  },
  {
    value: 'positive_sum',
    title: 'رقابت مجموع مثبت (Positive-Sum)',
    desc: 'هر رقیب بخش خاصی از مشتریان را با کیفیت و خدمات متمایز هدف گرفته و سود کل صنعت زیاد می‌شود',
    box: 'border-brand-200 bg-brand-50/60',
    title2: 'text-brand-900',
  },
]

export default function TabForces() {
  const {
    forcePage,
    setForcePage,
    setMod1Tab,
    forceAnswers,
    incumbentChecks,
    toggleIncumbent,
    setForceAnswer,
    rivalrySumType,
    setRivalrySumType,
  } = useStrategy()

  const pageData = porterForcesPages[forcePage]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {forceMeta.map((f, idx) => {
            const p = idx + 1
            const active = forcePage === p
            return (
              <button
                type="button"
                key={p}
                onClick={() => setForcePage(p)}
                className={`rounded-2xl p-3 text-right border transition flex flex-col justify-between ${
                  active
                    ? 'force-page-btn-active'
                    : 'bg-white hover:bg-industry-50 text-midnight-700 border-line'
                } ${p === 5 ? 'col-span-2 sm:col-span-1' : ''}`}
              >
                <div className="text-xs font-black">{f.label}</div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm space-y-4">
        {forcePage === 1 && pageData.incumbentChecklist && (
          <div className="bg-industry-50/70 border border-industry-200 rounded-2xl p-4 space-y-2.5">
            <div className="text-xs font-extrabold text-industry-950">
              ☑️ چک‌لیست مزایای شرکت‌های مستقر مستقل از اندازه (موارد موجود در صنعت را تیک بزنید تا به پاسخ سوال ۵ کمک
              کند):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              {pageData.incumbentChecklist.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-industry-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={!!incumbentChecks[c.id]}
                    onChange={(e) => toggleIncumbent(c.id, e.target.checked)}
                    className="rounded accent-industry-600"
                  />
                  <span className="font-semibold text-midnight-700">{c.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pageData.questions.map((q) => {
            const value = forceAnswers[q.id] ?? null
            const answered = value != null
            const [left, right] = q.anchor.split('|')
            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border space-y-2 transition ${
                  answered ? 'border-industry-300 bg-white' : 'border-line bg-canvas'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-black text-midnight-900">{q.title}</span>
                  <div className="flex items-center gap-2">
                    {q.source === 'ai' ? (
                      <AiConsult
                        hint={q.aiHint}
                        onApply={() => setForceAnswer(q.id, q.aiRec)}
                        applyLabel={`قرار دادن عدد AI (${toFaNumber(q.aiRec.toFixed(1))})`}
                      />
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-industry-50 text-industry-800 font-bold border border-industry-200">
                        👤 سوال مستقیم از مدیرعامل
                      </span>
                    )}
                    <AnswerBadge value={value} />
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed">{q.desc}</p>
                <div className="pt-1">
                  <Range
                    value={value}
                    answered={answered}
                    tone={q.source === 'ai' ? 'ai' : 'industry'}
                    onChange={(v) => setForceAnswer(q.id, v)}
                  />
                  <div className="flex justify-between text-xs text-muted mt-1 font-semibold gap-2">
                    <span>{left}</span>
                    <span className="text-left">{right}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {forcePage === 5 && (
          <div className="bg-canvas border border-line rounded-2xl p-4 space-y-2">
            <div className="text-xs font-extrabold text-midnight-900">
              ج) انتخاب نوع رقابت حاکم بر صنعت (مجموع صفر در برابر مجموع مثبت):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {rivalryOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-2 p-3 rounded-xl border cursor-pointer ${opt.box}`}
                >
                  <input
                    type="radio"
                    name="rivSumRadio"
                    value={opt.value}
                    checked={rivalrySumType === opt.value}
                    onChange={() => setRivalrySumType(opt.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <div className={`font-black ${opt.title2}`}>{opt.title}</div>
                    <div className="text-xs text-muted">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-line gap-2">
          {forcePage > 1 ? (
            <button
              type="button"
              onClick={() => setForcePage(forcePage - 1)}
              className="bg-canvas hover:bg-line text-ink text-xs font-bold px-4 py-2.5 rounded-xl border border-line transition"
            >
              → صفحه نیروی قبلی
            </button>
          ) : (
            <div />
          )}
          {forcePage < 5 ? (
            <button
              type="button"
              onClick={() => setForcePage(forcePage + 1)}
              className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition"
            >
              <span>صفحه نیروی بعدی (نیروی {forcePage + 1})</span>
              <span>←</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMod1Tab(3)}
              className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition"
            >
              <span>اتمام ۵ نیرو و رفتن به ۴ فاکتور محیطی</span>
              <span>←</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
