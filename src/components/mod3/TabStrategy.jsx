import { Scatter } from 'react-chartjs-2'
import { useStrategy } from '../../state/StrategyContext'
import { toFaNumber } from '../../utils/numbers'

export default function TabStrategy() {
  const {
    combinedScore,
    secObj,
    nWI,
    nWF,
    nWC,
    IS_current,
    FS,
    bindingForceName,
    checkedBarneyItems,
    includeCorpParent,
  } = useStrategy()

  const scatterData = {
    datasets: [
      {
        label: 'جایگاه استراتژیک بنگاه',
        data: [{ x: FS ?? 50, y: IS_current ?? 50 }],
        backgroundColor: '#4f46e5',
        pointRadius: 9,
        pointHoverRadius: 12,
      },
    ],
  }

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: بنگاه ${toFaNumber(ctx.parsed.x)}، صنعت ${toFaNumber(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        title: { display: true, text: 'امتیاز بنگاه (بارنی)', font: { size: 13 } },
        ticks: { stepSize: 20, font: { size: 12 }, callback: (value) => toFaNumber(value) },
      },
      y: {
        min: 0,
        max: 100,
        title: { display: true, text: 'امتیاز صنعت (پورتر)', font: { size: 13 } },
        ticks: { stepSize: 20, font: { size: 12 }, callback: (value) => toFaNumber(value) },
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col">
        <div className="border-b border-slate-100 pb-2 mb-3">
          <h4 className="text-sm font-black text-slate-900">ماتریس موقعیت‌یابی صنعت (پورتر) و بنگاه (بارنی)</h4>
          <p className="text-xs text-slate-500">محور افقی: امتیاز بنگاه | محور عمودی: امتیاز صنعت</p>
        </div>
        <div className="relative flex-1 min-h-[260px] flex items-center justify-center">
          <Scatter data={scatterData} options={scatterOptions} />
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-indigo-600">سند خروجی تصمیم‌گیری مدیرعامل</span>
            <h3 className="text-base sm:text-lg font-black text-slate-900">بیانیه نهایی استراتژی ورود و رقابت در صنعت</h3>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5"
          >
            <span>🖨</span>
            <span>چاپ / خروجی PDF</span>
          </button>
        </div>

        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700">
          {combinedScore === null ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              فرم در حالت خام قرار دارد. لطفاً سوالات تحلیل صنعت و تحلیل بنگاه را پاسخ دهید (یا روی دکمه «پر کردن نمونه
              آزمایشی» در بالای صفحه کلیک کنید) تا گزارش استراتژی تولید شود.
            </div>
          ) : (
            <>
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                <div className="font-black text-indigo-950 text-base">
                  امتیاز نهایی تصمیم‌گیری (مک‌گاهان و پورتر): {toFaNumber(combinedScore)} از ۱۰۰
                </div>
                <p>
                  در بخش اقتصادی <strong>«{secObj.name}»</strong>، وزن جذابیت صنعت{' '}
                  <strong>{toFaNumber((nWI * 100).toFixed(1))}%</strong> و وزن قابلیت‌های درونی بنگاه{' '}
                  <strong>{toFaNumber((nWF * 100).toFixed(1))}%</strong>
                  {includeCorpParent && nWC > 0 ? (
                    <>
                      {' '}
                      و وزن پشتیبانی شرکت مادر <strong>{toFaNumber((nWC * 100).toFixed(1))}%</strong>
                    </>
                  ) : null}{' '}
                  است. با ترکیب امتیاز صنعت شما ({toFaNumber(IS_current ?? 50)}) و امتیاز منابع بنگاه (
                  {toFaNumber(FS ?? 50)})، استراتژی بهینه
                  عبارت است از:{' '}
                  <strong>
                    مهار «{bindingForceName}» با تکیه بر منابع انسانی و سازمانی دارای ابهام علی بالا و پرهیز از جنگ قیمتی
                    مجموع صفر.
                  </strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900">منابع کلیدی ثبت‌شده توسط مدیرعامل در چک‌لیست بارنی:</div>
                <p className="text-xs text-slate-600">
                  {checkedBarneyItems.length
                    ? checkedBarneyItems.join(' • ')
                    : 'هنوز موردی در فهرست منابع بنگاه تیک نخورده است.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-xs">
                <div className="font-bold text-emerald-950">خلاصه تصمیم اجرایی</div>
                <p className="text-emerald-900">
                  {combinedScore >= 65
                    ? 'ورود/توسعه تهاجمی توصیه می‌شود: هم ساختار صنعت جذاب است و هم بنگاه از منابع پایدار برخوردار است.'
                    : combinedScore >= 45
                      ? 'ورود گزینشی و متمرکز بر سگمنت‌های غیرقیمتی توصیه می‌شود؛ ابتدا تنگنای صنعت مهار و سپس منابع بنگاه تقویت شود.'
                      : 'ورود محتاطانه یا بازنگری در انتخاب صنعت توصیه می‌شود؛ ساختار صنعت فشار بالایی دارد و مزیت منابع بنگاه هنوز کافی نیست.'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
