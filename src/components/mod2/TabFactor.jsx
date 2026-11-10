import { useState } from 'react'
import { useStrategy } from '../../state/StrategyContext'
import { barneyData, barneyKeys } from '../../data/barney'
import { AiConsult, AnswerBadge, Range } from '../ui/Controls'
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
        {mode !== 'V' && (
          <div className="flex items-center justify-end gap-2 border-b border-line pb-2">
            <AiConsult
              hint={mode === 'R' ? b.R_aiHint : b.N_aiHint}
              onApply={() => setBarneyAnswer(k, mode === 'R' ? 'R_q1' : 'N_q1', mode === 'R' ? b.R_aiRec : b.N_aiRec)}
              applyLabel={`قرار دادن عدد AI (${toFaNumber((mode === 'R' ? b.R_aiRec : b.N_aiRec).toFixed(1))})`}
            />
          </div>
        )}

        {mode === 'V' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['V_q1', 'V_q2'].map((field, idx) => {
              const value = values[field]
              return (
                <div key={field} className="min-w-0 bg-canvas p-3 rounded-xl border border-line space-y-1.5 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold min-w-0">
                      {idx === 0
                        ? '۱. چقدر این منبع به کاهش هزینه‌ها یا دریافت قیمت بالاتر از مشتری کمک می‌کند؟'
                        : '۲. چقدر این منبع مستقیماً تهدیدها و فشار ۵ نیروی صنعت را برای شرکت شما خنثی می‌کند؟'}
                    </span>
                    <AnswerBadge value={value} tone="brand" emptyText="خالی" />
                  </div>
                  <Range value={value} tone="brand" onChange={(v) => setBarneyAnswer(k, field, v)} />
                </div>
              )
            })}
          </div>
        )}

        {mode === 'R' && (
          <div className="bg-canvas p-3 rounded-xl border border-line space-y-1.5 text-sm">
            <div className="flex justify-between items-center gap-2">
              <span className="font-bold">
                چقدر این منبع شما در مقایسه با رقبای فعلی و بالقوه صنعت کمیاب و منحصربه‌فرد است؟
              </span>
              <AnswerBadge value={values.R_q1} tone="brand" emptyText="خالی" />
            </div>
            <Range value={values.R_q1} tone="ai" onChange={(v) => setBarneyAnswer(k, 'R_q1', v)} />
            <div className="flex justify-between text-xs text-muted">
              <span>۱ = اکثر رقبا دارند</span>
              <span>۵ = فقط شرکت ما دارد</span>
            </div>
          </div>
        )}

        {mode === 'N' && (
          <div className="bg-canvas p-3 rounded-xl border border-line space-y-1.5 text-sm">
            <div className="flex justify-between items-center gap-2">
              <span className="font-bold">
                چقدر این منبع در برابر جایگزینی با یک فناوری یا مدل کسب‌وکار دیگر (هم‌ارز استراتژیک) مصون و
                جایگزین‌ناپذیر است؟
              </span>
              <AnswerBadge value={values.N_q1} tone="industry" emptyText="خالی" />
            </div>
            <Range value={values.N_q1} tone="ai" onChange={(v) => setBarneyAnswer(k, 'N_q1', v)} />
            <div className="flex justify-between text-xs text-muted">
              <span>۱ = به راحتی با روش دیگری دور زده می‌شود</span>
              <span>۵ = هیچ جایگزین هم‌ارزی ندارد</span>
            </div>
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
