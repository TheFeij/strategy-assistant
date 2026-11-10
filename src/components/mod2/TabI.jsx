import { useState } from 'react'
import { useStrategy } from '../../state/StrategyContext'
import { barneyData, barneyKeys } from '../../data/barney'
import { AiConsult, AnswerBadge, Range } from '../ui/Controls'
import { toFaNumber } from '../../utils/numbers'
import ResourceTabs from './ResourceTabs'

export default function TabI() {
  const { barney, setBarneyAnswer, applyAiInimitability, setMod2Tab } = useStrategy()
  const [activeKey, setActiveKey] = useState(barneyKeys[0])

  const k = activeKey
  const b = barneyData[k]
  const values = barney[k]

  const codAns = values.I_codified_q != null
  const poachAns = values.I_poach_q != null
  let inferred = null
  if (codAns || poachAns) {
    const cod = codAns ? values.I_codified_q : 3.0
    const poach = poachAns ? values.I_poach_q : 3.0
    inferred = 6.0 - (cod + poach) / 2.0
  }
  const copyDifficulty =
    inferred == null
      ? null
      : inferred >= 4.2
        ? 'خیلی سخت'
        : inferred >= 3.2
          ? 'سخت'
          : inferred >= 2.2
            ? 'متوسط'
            : 'نسبتاً ساده'

  const questions = [
    {
      field: 'I_hist_q',
      label:
        '۱. (مسیر تاریخی) آیا این منبع در طول سالیان، در مکان/زمان خاص یا با مجوز قدیمی شکل گرفته که رقیب امروز حتی با پول زیاد هم نمی‌تواند سریع بخرد؟',
      left: '۱ = امروز در بازار آزاد قابل خرید فوری است',
      right: '۵ = نیازمند دهه‌ها زمان و سابقه تاریخی غیرقابل تکرار',
      tone: 'industry',
      badge: 'industry',
    },
    {
      field: 'I_soc_q',
      label:
        '۲. (پیچیدگی اجتماعی) چقدر عملکرد این منبع به فرهنگ شرکت، اعتماد متقابل بین افراد و روابط غیررسمی تیم‌ها گره خورده است؟',
      left: '۱ = مستقل از فرهنگ و روابط افراد',
      right: '۵ = کاملاً متکی به فرهنگ و روابط پیچیده انسانی',
      tone: 'industry',
      badge: 'industry',
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
    <div className="bg-white rounded-2xl p-4 border border-line shadow-sm space-y-4">
      <div className="bg-white border border-line border-r-4 !border-r-gold-400 rounded-2xl p-4 text-sm text-ink space-y-1.5">
        <span className="font-extrabold text-gold-800 block">سنجش تقلیدناپذیری منابع</span>
        <p className="leading-relaxed text-muted">
          به این پرسش‌ها درباره هر دسته از منابع پاسخ دهید تا مشخص شود رقبا چقدر می‌توانند آن را کپی کنند. هرچه کپی‌برداری
          از منبع برای رقبا سخت‌تر باشد، مزیت رقابتی شما پایدارتر است. در صورت نیاز می‌توانید از{' '}
          <strong>🤖 مشورت با AI</strong> هم استفاده کنید.
        </p>
      </div>

      <ResourceTabs activeKey={activeKey} onChange={setActiveKey} />

      <div className="bg-white rounded-2xl p-4 border border-line border-r-4 !border-r-brand-400 space-y-3">
        <div className="flex items-center justify-end gap-2 border-b border-line pb-2">
          <AiConsult
            hint={b.I_aiHint}
            onApply={() => applyAiInimitability(k)}
            applyLabel="تکمیل پیشنهادی AI برای این بخش"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {questions.map((q) => (
            <div key={q.field} className="min-w-0 bg-canvas p-3 rounded-xl border border-line space-y-1 text-sm">
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold min-w-0 break-words">{q.label}</span>
                <AnswerBadge value={values[q.field]} tone={q.badge} emptyText="خالی" />
              </div>
              <Range value={values[q.field]} onChange={(v) => setBarneyAnswer(k, q.field, v)} />
              <div className="flex flex-wrap justify-between text-xs text-muted gap-2">
                <span>{q.left}</span>
                <span className="text-left">{q.right}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {diagnostics.map((q) => (
            <div
              key={q.field}
              className="min-w-0 bg-gold-50/90 p-3 rounded-xl border border-gold-200 space-y-1 text-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-midnight-800 min-w-0 break-words">{q.label}</span>
                <AnswerBadge value={values[q.field]} tone="gold" emptyText="خالی" />
              </div>
              <Range value={values[q.field]} tone="gold" onChange={(v) => setBarneyAnswer(k, q.field, v)} />
              <div className="flex flex-wrap justify-between text-xs text-muted gap-2">
                <span>{q.left}</span>
                <span className="text-left">{q.right}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gold-50/90 p-3 rounded-xl border border-gold-200 flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-gold-900">
          <span>سختی کپی‌برداری این منبع برای رقبا:</span>
          <span className="text-left">
            {inferred !== null
              ? `${copyDifficulty} (${toFaNumber(inferred.toFixed(1))} از ۵)`
              : 'بعد از پاسخ به سوالات ۳ و ۴ نمایش داده می‌شود'}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setMod2Tab('R')}
          className="bg-canvas hover:bg-line text-ink text-xs font-bold px-4 py-2.5 rounded-xl border border-line transition"
        >
          بازگشت به کمیاب بودن (R)
        </button>
        <button
          type="button"
          onClick={() => setMod2Tab('N')}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-sm flex items-center gap-2 transition"
        >
          <span>ادامه به سنجش غیرقابل جایگزینی (N)</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
