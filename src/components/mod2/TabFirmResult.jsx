import { Bar } from 'react-chartjs-2'
import { useStrategy } from '../../state/StrategyContext'
import { barneyData, barneyKeys } from '../../data/barney'
import { toFaNumber } from '../../utils/numbers'

export default function TabFirmResult() {
  const { resScores, anyBarneyAnswered, FS, navigate } = useStrategy()

  const barData = {
    labels: ['ارزشمند (V)', 'کمیاب (R)', 'تقلیدناپذیر (I)', 'جایگزین‌ناپذیر (N)'],
    datasets: barneyKeys.map((k, i) => ({
      label: k === 'phys' ? 'فیزیکی' : k === 'hum' ? 'انسانی' : 'سازمانی',
      data: [resScores[k].V, resScores[k].R, resScores[k].I, resScores[k].N],
      backgroundColor: ['#D6A449', '#2878A8', '#147D78'][i],
      borderRadius: 4,
    })),
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 14, font: { size: 13 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${toFaNumber(Number(ctx.parsed.y).toFixed(1))}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1, font: { size: 12 }, callback: (value) => toFaNumber(value) },
      },
      x: { ticks: { font: { size: 12 } } },
    },
  }

  const statusFor = (s) =>
    s >= 65 ? 'مزیت رقابتی پایدار' : s >= 42 ? 'مزیت رقابتی موقت' : s >= 20 ? 'برابری رقابتی' : 'عدم مزیت رقابتی'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm flex flex-col">
        <div className="border-b border-line pb-2 mb-3">
          <h4 className="text-sm font-black text-midnight-900">نمودار مقایسه‌ای منابع در ۴ شاخص بارنی</h4>
          <p className="text-xs text-muted">مقایسه منابع فیزیکی، انسانی و سازمانی (از ۱ تا ۵)</p>
        </div>
        <div className="relative flex-1 min-h-[260px] flex items-center justify-center">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm flex flex-col justify-between">
        <div>
          <div className="border-b border-line pb-2 mb-3">
            <h4 className="text-sm font-black text-midnight-900">جدول امتیازات ۴ شاخص تجربی بارنی (فرمول دروازه‌ای)</h4>
            <p className="text-xs text-muted">ترکیب ضرب‌پذیر ارزشمندی، کمیابی، تقلیدناپذیری و جایگزین‌ناپذیری</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse min-w-[420px]">
              <thead>
                <tr className="bg-midnight text-white">
                  <th className="py-2 px-2 text-right">دسته منبع</th>
                  <th className="py-2 px-1">ارزشمند (V)</th>
                  <th className="py-2 px-1">کمیاب (R)</th>
                  <th className="py-2 px-1">تقلیدناپذیر (I)</th>
                  <th className="py-2 px-1">جایگزین‌ناپذیر (N)</th>
                  <th className="py-2 px-2">امتیاز (از ۱۰۰)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line font-bold">
                {barneyKeys.map((k) => {
                  const r = resScores[k]
                  return (
                    <tr key={k}>
                      <td className="py-2.5 px-2 text-right font-bold">{barneyData[k].title}</td>
                      <td className="py-2.5 px-1 font-mono">
                        {anyBarneyAnswered ? toFaNumber(r.V.toFixed(1)) : '—'}
                      </td>
                      <td className="py-2.5 px-1 font-mono">
                        {anyBarneyAnswered ? toFaNumber(r.R.toFixed(1)) : '—'}
                      </td>
                      <td className="py-2.5 px-1 font-mono">
                        {anyBarneyAnswered ? toFaNumber(r.I.toFixed(1)) : '—'}
                      </td>
                      <td className="py-2.5 px-1 font-mono">
                        {anyBarneyAnswered ? toFaNumber(r.N.toFixed(1)) : '—'}
                      </td>
                      <td className="py-2.5 px-2 font-mono font-black text-brand-700">
                        {anyBarneyAnswered ? `${toFaNumber(r.S_k)}%` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 text-sm space-y-1.5 mt-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-brand-950">امتیاز نهایی پایداری منابع بنگاه:</span>
            <span className="text-2xl font-black text-brand-700">{FS != null ? toFaNumber(FS) : '—'}</span>
          </div>
          <div className="text-xs text-brand-900 leading-relaxed">
            {anyBarneyAnswered
              ? 'بر اساس پاسخ‌های غیرمستقیم شما در بخش تقلیدناپذیری، بیشترین درجه ابهام علی و پیچیدگی اجتماعی مربوط به منابع سازمانی و انسانی است که کپی‌برداری از آن را حتی با استخدام افراد کلیدی توسط رقبا غیرممکن می‌سازد.'
              : 'لطفاً پرسش‌های ارزشمند بودن، کمیاب بودن، تقلیدناپذیری و جایگزین‌ناپذیری را پاسخ دهید.'}
          </div>
        </div>
      </div>

      <div className="bg-midnight text-white rounded-2xl p-4 border border-midnight-700 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <span className="text-xs font-bold text-brand-300">قیف پایداری مزیت رقابتی بنگاه (بارنی ۱۹۹۱)</span>
          <div className="space-y-2.5 text-sm">
            {barneyKeys.map((k) => {
              const r = resScores[k]
              return (
                <div
                  key={k}
                  className="bg-midnight-800 p-3 rounded-2xl border border-midnight-700 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-white">{barneyData[k].title}</div>
                    <div className="text-xs text-midnight-200">
                      ابهام علی استنتاج‌شده:{' '}
                      {anyBarneyAnswered ? `${toFaNumber(Math.round(((r.I_ambig - 1) / 4) * 100))}%` : '—'}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-black text-brand-300 text-sm">
                      {anyBarneyAnswered ? `${toFaNumber(r.S_k)}%` : '—'}
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-brand-500/20 text-brand-200 font-bold">
                      {anyBarneyAnswered ? statusFor(r.S_k) : 'پرنشده'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('mod3')}
          className="w-full bg-gold-500 hover:bg-gold-400 text-midnight text-xs font-black py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
        >
          <span>ذخیره و انتقال به ترکیب با ضرایب مک‌گاهان و پورتر</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
