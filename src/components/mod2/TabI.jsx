import { useStrategy } from '../../state/StrategyContext'
import { barneyData, barneyKeys } from '../../data/barney'
import { AiConsult, AnswerBadge, Range } from '../ui/Controls'

export default function TabI() {
  const { barney, setBarneyAnswer, applyAiInimitability, setMod2Tab } = useStrategy()

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5">
        <span className="font-extrabold text-amber-900 block">
          تب ۳: سنجش غیرقابل تقلید بودن (Imperfectly Imitable) با سوالات غیرمستقیم و کشف هوشمند «ابهام علی»
        </span>
        <p className="leading-relaxed">
          همان‌طور که اشاره کردید، پرسیدن مستقیم از مدیرعامل که «چند درصد ابهام علی دارید؟» نادرست است؛ زیرا ابهام علی
          یعنی حتی خود مدیران داخل شرکت هم فرمول دقیق موفقیت را به طور فرموله نمی‌دانند! بنابراین در زیر، ما{' '}
          <strong>سابقه تاریخی، روابط اجتماعی، میزان مکتوب بودن فرآیندها و آزمون انتقال مدیر کلیدی به شرکت رقیب</strong> را
          از شما می‌پرسیم (به همراه <strong>🤖 مشورت با AI</strong>) و موتور داشبورد خودش به صورت هوشمند{' '}
          <strong>درصد ابهام علی و امتیاز تقلیدناپذیری</strong> را استنتاج می‌کند:
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {barneyKeys.map((k) => {
          const b = barneyData[k]
          const values = barney[k]
          const codAns = values.I_codified_q != null
          const poachAns = values.I_poach_q != null
          let inferred = null
          let pct = null
          if (codAns || poachAns) {
            const cod = codAns ? values.I_codified_q : 3.0
            const poach = poachAns ? values.I_poach_q : 3.0
            inferred = 6.0 - (cod + poach) / 2.0
            pct = Math.round(((inferred - 1.0) / 4.0) * 100)
          }

          const questions = [
            {
              field: 'I_hist_q',
              label:
                '۱. (مسیر تاریخی) آیا این منبع در طول سالیان، در مکان/زمان خاص یا با مجوز قدیمی شکل گرفته که رقیب امروز حتی با پول زیاد هم نمی‌تواند سریع بخرد؟',
              left: '۱ = امروز در بازار آزاد قابل خرید فوری است',
              right: '۵ = نیازمند دهه‌ها زمان و سابقه تاریخی غیرقابل تکرار',
              tone: 'indigo',
              badge: 'indigo',
            },
            {
              field: 'I_soc_q',
              label:
                '۲. (پیچیدگی اجتماعی) چقدر عملکرد این منبع به فرهنگ شرکت، اعتماد متقابل بین افراد و روابط غیررسمی تیم‌ها گره خورده است؟',
              left: '۱ = مستقل از فرهنگ و روابط افراد',
              right: '۵ = کاملاً متکی به فرهنگ و روابط پیچیده انسانی',
              tone: 'indigo',
              badge: 'indigo',
            },
          ]

          const diagnostics = [
            {
              field: 'I_codified_q',
              label: '۳. چقدر راز موفقیت این منبع به صورت دستورالعمل و کاتالوگ مکتوب قابل نوشتن است؟',
              left: '۱ = اصلاً قابل نوشتن روی کاغذ نیست (ابهام بالا)',
              right: '۵ = کاملاً مکتوب و فرموله است',
            },
            {
              field: 'I_poach_q',
              label:
                '۴. اگر رقیب یکی از مدیران کلیدی شما را با حقوق بالا استخدام کند، چقدر راحت می‌تواند این مزیت را در شرکت رقیب کپی کند؟',
              left: '۱ = هیچ فردی به تنهایی راز کل سیستم را نمی‌داند (ابهام علی بالا)',
              right: '۵ = با بردن یک نفر کل راز کپی می‌شود',
            },
          ]

          return (
            <div key={k} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-black text-slate-900">{b.title}</h4>
                <AiConsult
                  hint={b.I_aiHint}
                  onApply={() => applyAiInimitability(k)}
                  applyLabel="تکمیل پیشنهادی AI برای این بخش"
                />
              </div>

              {questions.map((q) => (
                <div key={q.field} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold">{q.label}</span>
                    <AnswerBadge value={values[q.field]} tone={q.badge} emptyText="خالی" />
                  </div>
                  <Range value={values[q.field]} onChange={(v) => setBarneyAnswer(k, q.field, v)} />
                  <div className="flex justify-between text-[10px] text-slate-400 gap-2">
                    <span>{q.left}</span>
                    <span className="text-left">{q.right}</span>
                  </div>
                </div>
              ))}

              <div className="bg-amber-50/90 p-3 rounded-xl border border-amber-200 space-y-2 text-xs">
                <div className="font-extrabold text-amber-950">
                  🔍 سوالات تشخیصی کشف «ابهام علی» (بدون پرسش مستقیم درصد ابهام):
                </div>
                {diagnostics.map((q) => (
                  <div key={q.field}>
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800">{q.label}</span>
                      <AnswerBadge value={values[q.field]} tone="amber" emptyText="خالی" />
                    </div>
                    <Range value={values[q.field]} onChange={(v) => setBarneyAnswer(k, q.field, v)} />
                    <div className="flex justify-between text-[10px] text-slate-500 gap-2">
                      <span>{q.left}</span>
                      <span className="text-left">{q.right}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-1 border-t border-amber-200 flex items-center justify-between gap-2 font-bold text-amber-900">
                  <span>نتیجه استنتاج هوشمند ابهام علی:</span>
                  <span className="text-left">
                    {inferred !== null
                      ? `امتیاز ${inferred.toFixed(1)} از ۵ (${pct}% ابهام علی)`
                      : 'منتظر پاسخ سوالات ۳ و ۴'}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setMod2Tab('R')}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl"
        >
          بازگشت به تب ۲ (R)
        </button>
        <button
          type="button"
          onClick={() => setMod2Tab('N')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md flex items-center gap-2"
        >
          <span>ادامه به تب ۴: سنجش غیرقابل جایگزینی (N)</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
