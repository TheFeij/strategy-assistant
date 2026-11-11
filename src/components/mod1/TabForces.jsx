import { useStrategy } from '../../state/StrategyContext'
import { porterForcesPages } from '../../data/porter'
import { AiConsult } from '../ui/Controls'
import EvaluationCard from '../ui/EvaluationCard'
import { toFaNumber } from '../../utils/numbers'

const persianDigit = '۰-۹'

// Short endpoint labels for the card layout. The complete original wording is
// still available from the AI hint and the expandable criterion explanation.
const SHORT_ANCHORS = {
  f1_q1: ['ورود سخت', 'ورود آسان'],
  f1_q2: ['فقط شبکه بزرگ', 'بدون تعصب'],
  f1_q3: ['تغییر پرهزینه', 'تغییر آسان'],
  f1_q4: ['سرمایه کلان', 'سرمایه کم'],
  f1_q5: ['انحصار قدیمی‌ها', 'دسترسی آزاد'],
  f1_q6: ['کانال بسته', 'کانال باز'],
  f1_q7: ['قوانین سخت', 'بدون مانع'],
  f1_q8: ['واکنش تهاجمی', 'واکنش آرام'],

  f2_q1: ['تامین‌کننده پراکنده', 'تامین‌کننده متمرکز'],
  f2_q2: ['وابسته به ما', 'بی‌نیاز از ما'],
  f2_q3: ['تغییر آسان', 'تغییر پرهزینه'],
  f2_q4: ['کالای معمولی', 'کاملاً تخصصی'],
  f2_q5: ['جایگزین زیاد', 'بدون جایگزین'],
  f2_q6: ['غیرممکن', 'بسیار محتمل'],

  f3_q1: ['مشتریان خرد', 'چند مشتری بزرگ'],
  f3_q2: ['محصول متمایز', 'محصول یکسان'],
  f3_q3: ['تغییر سخت', 'تغییر آسان'],
  f3_q4: ['توان تولید ندارد', 'خودش تولید می‌کند'],
  f3_q5: ['سهم ناچیز', 'سهم سنگین'],
  f3_q6: ['مشتری مرفه', 'فشار قیمتی'],
  f3_q7: ['کیفیت وابسته', 'کیفیت بی‌اثر'],
  f3_q8: ['کاهش هزینه', 'بدون صرفه‌جویی'],

  f4_q1: ['بدون جایگزین', 'جایگزین متعدد'],
  f4_q2: ['کاملاً ضروری', 'قابل حذف'],
  f4_q3: ['بازار دست‌دوم نیست', 'بازار دست‌دوم داغ'],
  f4_q4: ['خودش نمی‌تواند', 'خودش انجام می‌دهد'],

  f5_q1: ['رقبای کم', 'رقبای زیاد'],
  f5_q2: ['بازار در حال رشد', 'بازار راکد'],
  f5_q3: ['خروج آسان', 'خروج پرهزینه'],
  f5_q4: ['رقبای منطقی', 'رقبای غیرمنطقی'],
  f5_q5: ['رفتار قابل پیش‌بینی', 'رفتار هیجانی'],
  f5_q6: ['محصول متمایز', 'محصول یکسان'],
  f5_q7: ['هزینه ثابت کم', 'هزینه ثابت بالا'],
  f5_q8: ['ظرفیت تدریجی', 'ظرفیت پله‌ای'],
  f5_q9: ['ماندگاری بالا', 'فاسدشدنی'],
  f5_q10: ['رقابت قیمتی', 'رقابت کیفی'],
}

function splitQuestionTitle(title = '') {
  const match = title.match(new RegExp(`^([${persianDigit}]+)\\.\\s*(.*)$`))
  return match ? { number: match[1], title: match[2] } : { number: null, title }
}

function shortenAnchor(raw = '') {
  const withoutScore = raw.replace(new RegExp(`^\\s*[${persianDigit}]+\\s*=\\s*`), '').trim()
  const withoutParens = withoutScore.replace(/\s*\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim()
  if (!withoutParens) return ''
  const firstClause = withoutParens.split('؛')[0].split('،')[0].trim()
  const concise = firstClause.split(' ').filter(Boolean).length >= 3 ? firstClause : withoutParens
  const words = concise.split(' ').filter(Boolean)
  return words.length > 6 ? `${words.slice(0, 6).join(' ')}…` : concise
}

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
            const [left, right] = q.anchor.split('|')
            const { number, title } = splitQuestionTitle(q.title)
            const isAi = q.source === 'ai'
            const shortAnchor = SHORT_ANCHORS[q.id]
            return (
              <EvaluationCard
                key={q.id}
                number={number}
                title={title}
                question={q.desc}
                value={value}
                onChange={(v) => setForceAnswer(q.id, v)}
                lowLabel={shortAnchor?.[0] || shortenAnchor(left)}
                highLabel={shortAnchor?.[1] || shortenAnchor(right)}
                tooltips={{
                  1: left?.replace(/^\s*[۰-۹]+\s*=\s*/, '').trim(),
                  5: right?.replace(/^\s*[۰-۹]+\s*=\s*/, '').trim(),
                }}
                sourceIcon={isAi ? '🤖' : '👤'}
                sourceLabel={isAi ? 'مشورت AI' : 'سوال مستقیم از مدیرعامل'}
                ariaLabel={`${title} — امتیاز از ۱ تا ۵`}
                detail={
                  <div className="space-y-1.5">
                    <p>
                      <strong className="text-midnight-700">مقیاس کامل: </strong>
                      {left}؛ {right}
                    </p>
                    <p>
                      <strong className="text-midnight-700">شرح سوال: </strong>
                      {q.desc}
                    </p>
                    {isAi && q.aiHint && <p className="text-midnight-600">{q.aiHint}</p>}
                  </div>
                }
                action={
                  isAi ? (
                    <AiConsult
                      hint={q.aiHint}
                      onApply={() => setForceAnswer(q.id, q.aiRec)}
                      applyLabel={`قرار دادن عدد AI (${toFaNumber(q.aiRec.toFixed(1))})`}
                      panelAlign="left"
                    />
                  ) : null
                }
              />
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
