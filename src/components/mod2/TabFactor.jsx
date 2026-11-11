import { useState } from 'react'
import { useStrategy } from '../../state/StrategyContext'
import { barneyData, barneyKeys } from '../../data/barney'
import { AiConsult } from '../ui/Controls'
import EvaluationCard from '../ui/EvaluationCard'
import { toFaNumber } from '../../utils/numbers'
import ResourceTabs from './ResourceTabs'

const configs = {
  V: {
    title: 'شاخص ارزشمند بودن (Valuable) — بهره‌برداری از فرصت‌ها و خنثی کردن تهدیدهای محیطی (SWOT)',
    description:
      'منابع بنگاه زمانی ارزشمند هستند که به شرکت کمک کنند هزینه‌ها را کاهش دهد، درآمد را بالا ببرد یا تهدیدهای ۵ نیروی پورتر را خنثی کند. به سوالات زیر درباره هر ۳ دسته منبع پاسخ دهید:',
    box: 'bg-white border-line border-r-4 !border-r-industry-400 text-ink',
    titleColor: 'text-industry-800',
    tone: 'brand',
    next: 'R',
    nextLabel: 'ادامه به سنجش کمیاب بودن (Rare)',
    prev: 'CHK',
    prevLabel: 'بازگشت به فهرست منابع',
  },
  R: {
    title: 'شاخص کمیاب بودن (Rare) — چقدر این منابع بین رقبای فعلی و بالقوه نادر است؟',
    description:
      'منبع ارزشمندی که اکثر رقبا هم آن را داشته باشند، مزیت رقابتی نمی‌آورد بلکه فقط باعث بقای معمولی می‌شود. در هر کارت می‌توانید با دکمه «🤖 مشورت با AI» وضعیت رقبا را بررسی کنید.',
    box: 'bg-white border-line border-r-4 !border-r-brand-400 text-ink',
    titleColor: 'text-brand-800',
    tone: 'brand',
    next: 'I',
    nextLabel: 'ادامه به سنجش غیرقابل تقلید بودن (I)',
    prev: 'V',
    prevLabel: 'بازگشت به ارزشمند بودن (V)',
  },
  N: {
    title: 'شاخص نبود جایگزین راهبردی هم‌ارز (Non-Substitutability)',
    description:
      'آیا رقیب می‌تواند بدون کپی کردن منبع شما، از یک راه یا فناوری کاملاً متفاوت به همان نتیجه برسد؟ با کلیک روی «🤖 مشورت با AI» جایگزین‌های احتمالی صنعت را بررسی کنید.',
    box: 'bg-white border-line border-r-4 !border-r-gold-400 text-ink',
    titleColor: 'text-gold-800',
    tone: 'industry',
    next: 'RES',
    nextLabel: 'مشاهده کارنامه نهایی پایداری منابع بنگاه',
    prev: 'I',
    prevLabel: 'بازگشت به تقلیدناپذیری (I)',
  },
}

export default function TabFactor({ mode }) {
  const { barney, setBarneyAnswer, setMod2Tab } = useStrategy()
  const cfg = configs[mode]
  const [activeKey, setActiveKey] = useState(barneyKeys[0])

  const k = activeKey
  const b = barneyData[k]
  const values = barney[k]

  return (
    <div className="bg-white rounded-2xl p-4 border border-line shadow-sm space-y-4">
      <div className={`border rounded-2xl p-4 text-sm ${cfg.box}`}>
        <span className={`font-extrabold block mb-1 ${cfg.titleColor}`}>{cfg.title}</span>
        <p className="leading-relaxed text-muted">{cfg.description}</p>
      </div>

      <ResourceTabs activeKey={activeKey} onChange={setActiveKey} />

      <div className="bg-white rounded-2xl p-4 border border-line border-r-4 !border-r-brand-400 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
          <p className="text-xs font-bold text-muted">یکی از پنج سطح را برای هر معیار انتخاب کنید.</p>
          {mode !== 'V' && (
            <AiConsult
              hint={mode === 'R' ? b.R_aiHint : b.N_aiHint}
              onApply={() => setBarneyAnswer(k, mode === 'R' ? 'R_q1' : 'N_q1', mode === 'R' ? b.R_aiRec : b.N_aiRec)}
              applyLabel={`قرار دادن عدد AI (${toFaNumber((mode === 'R' ? b.R_aiRec : b.N_aiRec).toFixed(1))})`}
              panelAlign="left"
            />
          )}
        </div>

        {mode === 'V' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['V_q1', 'V_q2'].map((field, idx) => {
              const value = values[field]
              return (
                <EvaluationCard
                  key={field}
                  number={idx + 1}
                  title={
                    idx === 0
                      ? 'چقدر این منبع به کاهش هزینه‌ها یا دریافت قیمت بالاتر از مشتری کمک می‌کند؟'
                      : 'چقدر این منبع مستقیماً تهدیدها و فشار ۵ نیروی صنعت را برای شرکت شما خنثی می‌کند؟'
                  }
                  value={value}
                  onChange={(v) => setBarneyAnswer(k, field, v)}
                  lowLabel="خیلی کم"
                  highLabel="خیلی زیاد"
                  tooltips={{ 1: 'خیلی کم', 2: 'کم', 3: 'متوسط', 4: 'زیاد', 5: 'خیلی زیاد' }}
                  sourceLabel="ورودی مدیرعامل"
                  sourceIcon="👤"
                  ariaLabel={
                    idx === 0
                      ? 'چقدر این منبع به کاهش هزینه‌ها یا دریافت قیمت بالاتر از مشتری کمک می‌کند؟'
                      : 'چقدر این منبع مستقیماً تهدیدها و فشار ۵ نیروی صنعت را برای شرکت شما خنثی می‌کند؟'
                  }
                  detail={
                    <div className="space-y-1.5">
                      <p>
                        <strong className="text-midnight-700">هدف سوال: </strong>
                        {idx === 0 ? 'ارزش‌آفرینی اقتصادی' : 'خنثی‌سازی تهدیدها'}
                      </p>
                      <p>
                        مقیاس پنج‌سطحی از «خیلی کم» (۱) تا «خیلی زیاد» (۵). عدد انتخاب‌شده مستقیماً در محاسبه ارزشمند
                        بودن منبع استفاده می‌شود.
                      </p>
                    </div>
                  }
                />
              )
            })}
          </div>
        )}

        {mode === 'R' && (
          <div className="grid grid-cols-1 gap-3">
            <EvaluationCard
              number={1}
              title="چقدر این منبع شما در مقایسه با رقبای فعلی و بالقوه صنعت کمیاب و منحصربه‌فرد است؟"
              value={values.R_q1}
              onChange={(v) => setBarneyAnswer(k, 'R_q1', v)}
              lowLabel="اکثر رقبا دارند"
              highLabel="فقط شرکت ما دارد"
              tooltips={{ 1: 'اکثر رقبا دارند', 5: 'فقط شرکت ما دارد' }}
              sourceLabel="مشورت AI"
              sourceIcon="🤖"
              ariaLabel="چقدر این منبع شما در مقایسه با رقبای فعلی و بالقوه صنعت کمیاب و منحصربه‌فرد است؟"
              detail={
                <div className="space-y-1.5">
                  <p>
                    <strong className="text-midnight-700">هدف سوال: </strong>
                    کمیابی منبع در برابر رقبا
                  </p>
                  <p>
                    ۱ = اکثر رقبا این منبع را دارند؛ ۵ = فقط شرکت ما به آن دسترسی دارد. منبعی که رقبا نیز دارند مزیت
                    رقابتی پایدار نمی‌سازد.
                  </p>
                </div>
              }
            />
          </div>
        )}

        {mode === 'N' && (
          <div className="grid grid-cols-1 gap-3">
            <EvaluationCard
              number={1}
              title="چقدر این منبع در برابر جایگزینی با یک فناوری یا مدل کسب‌وکار دیگر (هم‌ارز استراتژیک) مصون و جایگزین‌ناپذیر است؟"
              value={values.N_q1}
              onChange={(v) => setBarneyAnswer(k, 'N_q1', v)}
              lowLabel="قابل دور زدن"
              highLabel="بدون جایگزین هم‌ارز"
              tooltips={{
                1: 'به راحتی با روش دیگری دور زده می‌شود',
                5: 'هیچ جایگزین هم‌ارزی ندارد',
              }}
              sourceLabel="مشورت AI"
              sourceIcon="🤖"
              ariaLabel="چقدر این منبع در برابر جایگزینی با یک فناوری یا مدل کسب‌وکار دیگر (هم‌ارز استراتژیک) مصون و جایگزین‌ناپذیر است؟"
              detail={
                <div className="space-y-1.5">
                  <p>
                    <strong className="text-midnight-700">هدف سوال: </strong>
                    جایگزین‌ناپذیری راهبردی
                  </p>
                  <p>
                    ۱ = رقیب به راحتی با روش یا فناوری دیگری به همان نتیجه می‌رسد؛ ۵ = هیچ جایگزین هم‌ارزی برای این منبع
                    وجود ندارد.
                  </p>
                </div>
              }
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setMod2Tab(cfg.prev)}
          className="bg-canvas hover:bg-line text-ink text-xs font-bold px-4 py-2.5 rounded-xl border border-line transition"
        >
          {cfg.prevLabel}
        </button>
        <button
          type="button"
          onClick={() => setMod2Tab(cfg.next)}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-sm flex items-center gap-2 transition"
        >
          <span>{cfg.nextLabel}</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
