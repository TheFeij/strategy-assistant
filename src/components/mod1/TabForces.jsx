import { useStrategy } from '../../state/StrategyContext'
import { porterForcesPages } from '../../data/porter'
import { AiConsult, AnswerBadge, Range } from '../ui/Controls'

const forceMeta = [
  { label: 'صفحه نیروی ۱: تهدید ورود', meta: '۸ سوال + چک‌لیست' },
  { label: 'صفحه نیروی ۲: تامین‌کنندگان', meta: '۶ سوال کامل' },
  { label: 'صفحه نیروی ۳: خریداران', meta: '۸ سوال (چانه‌زنی و قیمت)' },
  { label: 'صفحه نیروی ۴: کالای جایگزین', meta: '۴ سوال کامل' },
  { label: 'صفحه نیروی ۵: رقبای موجود', meta: '۱۰ سوال + نوع رقابت' },
]

const rivalryOptions = [
  {
    value: 'zero_sum',
    title: 'رقابت مجموع صفر (Zero-Sum)',
    desc: 'جنگ قیمتی بر سر یک کیک ثابت؛ سود یک شرکت به معنای زیان دیگری است (تشدید فشار رقابت)',
    box: 'border-rose-200 bg-rose-50/60',
    title2: 'text-rose-900',
  },
  {
    value: 'balanced',
    title: 'رقابت ترکیبی متعادل',
    desc: 'ترکیبی از رقابت قیمتی و غیرقیمتی در بخش‌های مختلف بازار',
    box: 'border-slate-200 bg-white',
    title2: 'text-slate-800',
  },
  {
    value: 'positive_sum',
    title: 'رقابت مجموع مثبت (Positive-Sum)',
    desc: 'هر رقیب بخش خاصی از مشتریان را با کیفیت و خدمات متمایز هدف گرفته و سود کل صنعت زیاد می‌شود',
    box: 'border-emerald-200 bg-emerald-50/60',
    title2: 'text-emerald-900',
  },
]

export default function TabForces() {
  const {
    forcePage,
    setForcePage,
    setMod1Tab,
    forceScores,
    answeredForceQs,
    totalForceQs,
    forceAnswers,
    incumbentChecks,
    toggleIncumbent,
    setForceAnswer,
    rivalrySumType,
    setRivalrySumType,
  } = useStrategy()

  const pageData = porterForcesPages[forcePage]

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-600">
            <strong className="text-slate-900">راهنمای پاسخ‌دهی:</strong> هر یک از ۵ نیروی رقابتی در یک صفحه جداگانه قرار
            دارد. سوالات به زبان ساده طراحی شده‌اند؛ برای هر سوال از <strong>۱ (خیلی کم) تا ۵ (خیلی زیاد)</strong> امتیاز
            دهید.
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
            سوالات پاسخ داده شده: {answeredForceQs} از {totalForceQs}
          </span>
        </div>

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
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                } ${p === 5 ? 'col-span-2 sm:col-span-1' : ''}`}
              >
                <div className="text-xs font-black">{f.label}</div>
                <div className={`flex items-center justify-between mt-1.5 text-[11px] ${active ? 'opacity-90' : 'opacity-80'}`}>
                  <span>{f.meta}</span>
                  <strong className={`px-2 py-0.5 rounded ${active ? 'bg-white/20' : 'bg-slate-200 text-slate-800'}`}>
                    {forceScores[idx] != null ? forceScores[idx].toFixed(1) : '—'}
                  </strong>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-indigo-950">{pageData.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{pageData.subtitle}</p>
          </div>
        </div>

        {forcePage === 1 && pageData.incumbentChecklist && (
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 space-y-2.5">
            <div className="text-xs font-extrabold text-indigo-950">
              ☑️ چک‌لیست مزایای شرکت‌های مستقر مستقل از اندازه (موارد موجود در صنعت را تیک بزنید تا به پاسخ سوال ۵ کمک
              کند):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              {pageData.incumbentChecklist.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-indigo-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={!!incumbentChecks[c.id]}
                    onChange={(e) => toggleIncumbent(c.id, e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span className="font-semibold text-slate-700">{c.label}</span>
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
                  answered ? 'border-indigo-300 bg-white' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-black text-slate-900">{q.title}</span>
                  <div className="flex items-center gap-2">
                    {q.source === 'ai' ? (
                      <AiConsult
                        hint={q.aiHint}
                        onApply={() => setForceAnswer(q.id, q.aiRec)}
                        applyLabel={`قرار دادن عدد AI (${q.aiRec.toFixed(1)})`}
                      />
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-bold border border-indigo-200">
                        👤 سوال مستقیم از مدیرعامل
                      </span>
                    )}
                    <AnswerBadge value={value} />
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{q.desc}</p>
                <div className="pt-1">
                  <Range
                    value={value}
                    answered={answered}
                    tone={q.source === 'ai' ? 'ai' : 'indigo'}
                    onChange={(v) => setForceAnswer(q.id, v)}
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold gap-2">
                    <span>{left}</span>
                    <span className="text-left">{right}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {forcePage === 5 && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="text-xs font-extrabold text-slate-900">
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
                    <div className="text-[11px] text-slate-600">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
          {forcePage > 1 ? (
            <button
              type="button"
              onClick={() => setForcePage(forcePage - 1)}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl"
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
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-1.5"
            >
              <span>صفحه نیروی بعدی (نیروی {forcePage + 1})</span>
              <span>←</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMod1Tab(3)}
              className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-1.5"
            >
              <span>اتمام ۵ نیرو و رفتن به تب ۳ (۴ فاکتور محیطی)</span>
              <span>←</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
