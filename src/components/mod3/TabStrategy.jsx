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
        backgroundColor: '#D6A449',
        borderColor: '#101D30',
        borderWidth: 2,
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
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm flex flex-col">
        <div className="border-b border-line pb-2 mb-3">
          <h4 className="text-sm font-black text-midnight-900">ماتریس موقعیت‌یابی صنعت (پورتر) و بنگاه (بارنی)</h4>
          <p className="text-xs text-muted">محور افقی: امتیاز بنگاه | محور عمودی: امتیاز صنعت</p>
        </div>
        <div className="relative flex-1 min-h-[260px] flex items-center justify-center">
          <Scatter data={scatterData} options={scatterOptions} />
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl p-4 border border-line shadow-sm space-y-4">
        <div className="border-b border-line pb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-gold-800">سند خروجی تصمیم‌گیری مدیرعامل</span>
            <h3 className="text-base sm:text-lg font-black text-midnight-900">بیانیه نهایی استراتژی ورود و رقابت در صنعت</h3>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="text-xs bg-brand-600 hover:bg-brand-700 text-white font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
          >
            <span>🖨</span>
            <span>چاپ / خروجی PDF</span>
          </button>
        </div>

        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-midnight-700">
          {combinedScore === null ? (
            <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200 text-gold-900">
              فرم در حالت خام قرار دارد. لطفاً سوالات تحلیل صنعت و تحلیل بنگاه را پاسخ دهید (یا روی دکمه «پر کردن نمونه
              آزمایشی» در بالای صفحه کلیک کنید) تا گزارش استراتژی تولید شود.
            </div>
          ) : (
            <>
              <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200 border-r-4 !border-r-gold-500 space-y-2">
                <div className="font-black text-gold-900 text-base">
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

              <div className="p-4 rounded-2xl bg-canvas border border-line space-y-1.5">
                <div className="font-bold text-midnight-900">منابع کلیدی ثبت‌شده توسط مدیرعامل در چک‌لیست بارنی:</div>
                <p className="text-xs text-muted">
                  {checkedBarneyItems.length
                    ? checkedBarneyItems.join(' • ')
                    : 'هنوز موردی در فهرست منابع بنگاه تیک نخورده است.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 space-y-1 text-xs">
                <div className="font-bold text-brand-950">خلاصه تصمیم اجرایی</div>
                <p className="text-brand-900">
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
