import { useState } from 'react'
import { useStrategy } from '../../state/StrategyContext'
import { barneyData, barneyKeys } from '../../data/barney'
import { AiConsult } from '../ui/Controls'
import EvaluationCard from '../ui/EvaluationCard'
import ResourceTabs from './ResourceTabs'
import { toFaNumber } from '../../utils/numbers'

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

  const cards = [
    {
      field: 'I_hist_q',
      number: 1,
      title: 'تاریخ‌مندی منبع',
      question:
        'آیا این منبع در طول سالیان، در مکان/زمان خاص یا با مجوز قدیمی شکل گرفته که رقیب امروز حتی با پول زیاد هم نمی‌تواند سریع بخرد؟',
      lowLabel: 'خرید فوری از بازار',
      highLabel: 'سابقه غیرقابل تکرار',
      tooltips: {
        1: 'امروز در بازار آزاد قابل خرید فوری است',
        5: 'نیازمند دهه‌ها زمان و سابقه تاریخی غیرقابل تکرار',
      },
      detail:
        '۱ = امروز در بازار آزاد قابل خرید فوری است؛ ۵ = نیازمند دهه‌ها زمان و سابقه تاریخی غیرقابل تکرار.',
    },
    {
      field: 'I_soc_q',
      number: 2,
      title: 'پیچیدگی اجتماعی',
      question:
        'چقدر عملکرد این منبع به فرهنگ شرکت، اعتماد متقابل بین افراد و روابط غیررسمی تیم‌ها گره خورده است؟',
      lowLabel: 'مستقل از فرهنگ',
      highLabel: 'وابسته به روابط انسانی',
      tooltips: {
        1: 'مستقل از فرهنگ و روابط افراد',
        5: 'کاملاً متکی به فرهنگ و روابط پیچیده انسانی',
      },
      detail:
        '۱ = مستقل از فرهنگ و روابط افراد؛ ۵ = کاملاً متکی به فرهنگ و روابط پیچیده انسانی.',
    },
    {
      field: 'I_codified_q',
      number: 3,
      title: 'مستندسازی دانش',
      question:
        'چقدر راز موفقیت این منبع به صورت دستورالعمل و کاتالوگ مکتوب قابل نوشتن است؟',
      lowLabel: 'غیرقابل مکتوب‌سازی',
      highLabel: 'کاملاً مکتوب و فرموله',
      tooltips: {
        1: 'اصلاً قابل نوشتن روی کاغذ نیست (ابهام بالا)',
        5: 'کاملاً مکتوب و فرموله است',
      },
      detail:
        '۱ = اصلاً قابل نوشتن روی کاغذ نیست (ابهام بالا)؛ ۵ = کاملاً مکتوب و فرموله است. این معیار برای محاسبه سختی کپی‌برداری استفاده می‌شود.',
      tag: 'تشخیصی',
    },
    {
      field: 'I_poach_q',
      number: 4,
      title: 'وابستگی به افراد کلیدی',
      question:
        'اگر رقیب یکی از مدیران کلیدی شما را با حقوق بالا استخدام کند، چقدر راحت می‌تواند این مزیت را در شرکت رقیب کپی کند؟',
      lowLabel: 'راز پخش‌شده در تیم',
      highLabel: 'کپی با رفتن یک نفر',
      tooltips: {
        1: 'هیچ فردی به تنهایی راز کل سیستم را نمی‌داند (ابهام علی بالا)',
        5: 'با بردن یک نفر کل راز کپی می‌شود',
      },
      detail:
        '۱ = هیچ فردی به تنهایی راز کل سیستم را نمی‌داند (ابهام علی بالا)؛ ۵ = با بردن یک نفر کل راز کپی می‌شود. این معیار برای محاسبه سختی کپی‌برداری استفاده می‌شود.',
      tag: 'تشخیصی',
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
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
          <p className="text-xs font-bold text-muted">هر معیار را با انتخاب یکی از پنج سطح تکمیل کنید.</p>
          <AiConsult
            hint={b.I_aiHint}
            onApply={() => applyAiInimitability(k)}
            applyLabel="تکمیل پیشنهادی AI برای این بخش"
            panelAlign="left"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {cards.map((card) => (
            <EvaluationCard
              key={card.field}
              number={card.number}
              title={card.question}
              value={values[card.field]}
              onChange={(v) => setBarneyAnswer(k, card.field, v)}
              lowLabel={card.lowLabel}
              highLabel={card.highLabel}
              tooltips={card.tooltips}
              sourceLabel="ورودی مدیرعامل · مشورت AI"
              sourceIcon="👤"
              tag={card.tag}
              ariaLabel={card.question}
              detail={
                <div className="space-y-1.5">
                  <p>
                    <strong className="text-midnight-700">هدف سوال: </strong>
                    {card.title}
                  </p>
                  <p>{card.detail}</p>
                </div>
              }
            />
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
