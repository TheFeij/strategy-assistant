import { useStrategy } from '../../state/StrategyContext'
import { barneyData, barneyKeys } from '../../data/barney'
import { AiConsult, AnswerBadge, Range } from '../ui/Controls'

const configs = {
  V: {
    title: 'تب ۱: شاخص ارزشمند بودن (Valuable) — بهره‌برداری از فرصت‌ها و خنثی کردن تهدیدهای محیطی (SWOT)',
    description:
      'منابع بنگاه زمانی ارزشمند هستند که به شرکت کمک کنند هزینه‌ها را کاهش دهد، درآمد را بالا ببرد یا تهدیدهای ۵ نیروی پورتر را خنثی کند. به سوالات زیر درباره هر ۳ دسته منبع پاسخ دهید:',
    box: 'bg-indigo-50 border-indigo-200 text-indigo-950',
    titleColor: 'text-indigo-900',
    tone: 'emerald',
    next: 'R',
    nextLabel: 'ادامه به تب ۲: سنجش کمیاب بودن (Rare)',
    prev: 'CHK',
    prevLabel: 'بازگشت به فهرست منابع',
  },
  R: {
    title: 'تب ۲: شاخص کمیاب بودن (Rare) — چقدر این منابع بین رقبای فعلی و بالقوه نادر است؟',
    description:
      'منبع ارزشمندی که اکثر رقبا هم آن را داشته باشند، مزیت رقابتی نمی‌آورد بلکه فقط باعث بقای معمولی می‌شود. در هر کارت می‌توانید با دکمه «🤖 مشورت با AI» وضعیت رقبا را بررسی کنید.',
    box: 'bg-teal-50 border-teal-200 text-teal-950',
    titleColor: 'text-teal-900',
    tone: 'teal',
    next: 'I',
    nextLabel: 'ادامه به تب ۳: سنجش غیرقابل تقلید بودن (I)',
    prev: 'V',
    prevLabel: 'بازگشت به تب ۱ (V)',
  },
  N: {
    title: 'تب ۴: شاخص نبود جایگزین راهبردی هم‌ارز (Non-Substitutability)',
    description:
      'آیا رقیب می‌تواند بدون کپی کردن منبع شما، از یک راه یا فناوری کاملاً متفاوت به همان نتیجه برسد؟ با کلیک روی «🤖 مشورت با AI» جایگزین‌های احتمالی صنعت را بررسی کنید.',
    box: 'bg-purple-50 border-purple-200 text-purple-950',
    titleColor: 'text-purple-900',
    tone: 'purple',
    next: 'RES',
    nextLabel: 'مشاهده تب ۵: کارنامه نهایی پایداری منابع بنگاه',
    prev: 'I',
    prevLabel: 'بازگشت به تب ۳ (I)',
  },
}

export default function TabFactor({ mode }) {
  const { barney, setBarneyAnswer, setMod2Tab } = useStrategy()
  const cfg = configs[mode]

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div className={`border rounded-2xl p-4 text-xs ${cfg.box}`}>
        <span className={`font-extrabold block mb-1 ${cfg.titleColor}`}>{cfg.title}</span>
        <p className="leading-relaxed">{cfg.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {barneyKeys.map((k) => {
          const b = barneyData[k]
          const values = barney[k]
          return (
            <div key={k} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-black text-slate-900">{b.title}</h4>
                {mode !== 'V' && (
                  <AiConsult
                    hint={mode === 'R' ? b.R_aiHint : b.N_aiHint}
                    onApply={() => setBarneyAnswer(k, mode === 'R' ? 'R_q1' : 'N_q1', mode === 'R' ? b.R_aiRec : b.N_aiRec)}
                    applyLabel={`قرار دادن عدد AI (${(mode === 'R' ? b.R_aiRec : b.N_aiRec).toFixed(1)})`}
                  />
                )}
              </div>

              {mode === 'V' && (
                <>
                  {['V_q1', 'V_q2'].map((field, idx) => {
                    const value = values[field]
                    return (
                      <div key={field} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-bold">
                            {idx === 0
                              ? '۱. چقدر این منبع به کاهش هزینه‌ها یا دریافت قیمت بالاتر از مشتری کمک می‌کند؟'
                              : '۲. چقدر این منبع مستقیماً تهدیدها و فشار ۵ نیروی صنعت را برای شرکت شما خنثی می‌کند؟'}
                          </span>
                          <AnswerBadge value={value} tone="emerald" emptyText="خالی" />
                        </div>
                        <Range value={value} tone="emerald" onChange={(v) => setBarneyAnswer(k, field, v)} />
                      </div>
                    )
                  })}
                </>
              )}

              {mode === 'R' && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold">
                      چقدر این منبع شما در مقایسه با رقبای فعلی و بالقوه صنعت کمیاب و منحصربه‌فرد است؟
                    </span>
                    <AnswerBadge value={values.R_q1} tone="teal" emptyText="خالی" />
                  </div>
                  <Range value={values.R_q1} tone="ai" onChange={(v) => setBarneyAnswer(k, 'R_q1', v)} />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>۱ = اکثر رقبا دارند</span>
                    <span>۵ = فقط شرکت ما دارد</span>
                  </div>
                </div>
              )}

              {mode === 'N' && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-bold">
                      چقدر این منبع در برابر جایگزینی با یک فناوری یا مدل کسب‌وکار دیگر (هم‌ارز استراتژیک) مصون و
                      جایگزین‌ناپذیر است؟
                    </span>
                    <AnswerBadge value={values.N_q1} tone="purple" emptyText="خالی" />
                  </div>
                  <Range value={values.N_q1} tone="ai" onChange={(v) => setBarneyAnswer(k, 'N_q1', v)} />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>۱ = به راحتی با روش دیگری دور زده می‌شود</span>
                    <span>۵ = هیچ جایگزین هم‌ارزی ندارد</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setMod2Tab(cfg.prev)}
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl"
        >
          {cfg.prevLabel}
        </button>
        <button
          type="button"
          onClick={() => setMod2Tab(cfg.next)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md flex items-center gap-2"
        >
          <span>{cfg.nextLabel}</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
