import { useStrategy } from '../../state/StrategyContext'
import { pfiCompChecklist, pfiComplementaryAssets } from '../../data/pfi'
import { toFaNumber } from '../../utils/numbers'
import PfiQuestionCard from './PfiQuestionCard'

export default function TabComplementary() {
  const {
    pfiAnswers,
    setPfiAnswer,
    pfiChecklist,
    togglePfiCheck,
    pfiDistMonopolized,
    pfiDistVal,
    setMod4Tab,
  } = useStrategy()

  const checkedCount = pfiCompChecklist.filter((item) => pfiChecklist[item.id]).length
  const q7 = pfiAnswers.q7
  const fullyOwned = q7 != null && q7 >= 4.5

  return (
    <div className="bg-white rounded-2xl p-4 border border-line shadow-sm space-y-4">
      <div className="bg-canvas border border-line border-r-4 !border-r-midnight-400 rounded-2xl p-4 text-sm space-y-1">
        <span className="font-extrabold text-midnight-900 block">
          حلقه‌های لازم برای تبدیل محصول به پول دست چه کسی است؟
        </span>
        <p className="leading-relaxed text-muted">
          حلقه‌های حیاتی فروش و اجرا را مشخص کنید تا معلوم شود سود به بنگاه می‌رسد یا به شرکای بیرونی.
        </p>
      </div>

      {pfiDistMonopolized && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold-200 bg-gold-50 px-3 py-2.5 text-xs text-gold-900">
          <span className="leading-relaxed">
            <strong className="font-black">هشدار از تحلیل صنعت:</strong> کانال‌های توزیع در انحصار شرکت‌های قدیمی
            است ({toFaNumber(Number(pfiDistVal).toFixed(1))} از ۵)؛ شبکه پخش می‌تواند بخش عمده سود نوآوری را تصاحب
            کند.
          </span>
          {!pfiChecklist.dist && (
            <button
              type="button"
              onClick={() => togglePfiCheck('dist', true)}
              className="shrink-0 rounded-lg bg-gold-600 px-2.5 py-1.5 text-xs font-extrabold text-white transition hover:bg-gold-700"
            >
              تیک زدن شبکه پخش
            </button>
          )}
        </div>
      )}

      <div className="bg-canvas border border-line rounded-2xl p-4 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-extrabold text-midnight-900">
            کدام حلقه‌ها برای رساندن محصول به مشتری حیاتی‌اند؟
          </span>
          <span className="text-xs font-bold text-midnight-800 bg-midnight-50 border border-midnight-200 rounded-full px-2.5 py-0.5">
            {toFaNumber(checkedCount)} حلقه انتخاب شده
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {pfiCompChecklist.map((item) => {
            const checked = !!pfiChecklist[item.id]
            return (
              <label
                key={item.id}
                className={`flex items-center justify-between gap-2 rounded-xl border p-2.5 cursor-pointer transition ${
                  checked ? 'bg-midnight-50 border-midnight-300' : 'bg-white border-line hover:border-midnight-200'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => togglePfiCheck(item.id, e.target.checked)}
                    className="rounded accent-midnight-700"
                  />
                  <span className="font-semibold text-midnight-800">{item.label}</span>
                </span>
                {item.isDist && pfiDistMonopolized && (
                  <span className="shrink-0 rounded-full bg-gold-100 px-2 py-0.5 text-[0.7rem] font-black text-gold-800">
                    گلوگاه صنعت
                  </span>
                )}
              </label>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pfiComplementaryAssets.map((q, idx) => {
          const isConditional = !!q.conditionalOnQ7
          return (
            <PfiQuestionCard
              key={q.id}
              question={q}
              number={idx + 1}
              value={pfiAnswers[q.id]}
              onChange={(v) => setPfiAnswer(q.id, v)}
              disabled={isConditional && fullyOwned}
              className={isConditional ? 'lg:col-span-2' : ''}
              note={
                isConditional && fullyOwned
                  ? 'چون در سوال ۷ مالکیت کامل داخلی را انتخاب کردید، ریسک تصاحب سود توسط شریک بیرونی موضوعیت ندارد و اثر این سوال صفر می‌شود.'
                  : undefined
              }
            />
          )
        })}
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-3">
        <button
          type="button"
          onClick={() => setMod4Tab(2)}
          className="bg-canvas hover:bg-line text-ink text-xs font-bold px-4 py-2.5 rounded-xl border border-line transition"
        >
          بازگشت به استاندارد بازار
        </button>
        <button
          type="button"
          onClick={() => setMod4Tab(4)}
          className="bg-midnight hover:bg-midnight-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-sm flex items-center gap-2 transition"
        >
          <span>مشاهده سهم سود و استراتژی نهایی</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
