import { Bar } from 'react-chartjs-2'
import { useStrategy } from '../../state/StrategyContext'
import { barneyData, barneyKeys } from '../../data/barney'

export default function TabFirmResult() {
  const { resScores, anyBarneyAnswered, FS, navigate } = useStrategy()

  const barData = {
    labels: ['ارزشمند (V)', 'کمیاب (R)', 'تقلیدناپذیر (I)', 'جایگزین‌ناپذیر (N)'],
    datasets: barneyKeys.map((k, i) => ({
      label: k === 'phys' ? 'فیزیکی' : k === 'hum' ? 'انسانی' : 'سازمانی',
      data: [resScores[k].V, resScores[k].R, resScores[k].I, resScores[k].N],
      backgroundColor: ['#f59e0b', '#4f46e5', '#10b981'][i],
      borderRadius: 4,
    })),
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } },
    scales: { y: { min: 0, max: 5, ticks: { stepSize: 1 } }, x: { ticks: { font: { size: 9 } } } },
  }

  const statusFor = (s) =>
    s >= 65 ? 'مزیت رقابتی پایدار' : s >= 42 ? 'مزیت رقابتی موقت' : s >= 20 ? 'برابری رقابتی' : 'عدم مزیت رقابتی'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col">
        <div className="border-b border-slate-100 pb-2 mb-3">
          <h4 className="text-sm font-black text-slate-900">نمودار مقایسه‌ای منابع در ۴ شاخص بارنی</h4>
          <p className="text-[11px] text-slate-500">مقایسه منابع فیزیکی، انسانی و سازمانی (از ۱ تا ۵)</p>
        </div>
        <div className="relative flex-1 min-h-[260px] flex items-center justify-center">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-sm font-black text-slate-900">جدول امتیازات ۴ شاخص تجربی بارنی (فرمول دروازه‌ای)</h4>
            <p className="text-[11px] text-slate-500">ترکیب ضرب‌پذیر ارزشمندی، کمیابی، تقلیدناپذیری و جایگزین‌ناپذیری</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse min-w-[420px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="py-2 px-2 text-right">دسته منبع</th>
                  <th className="py-2 px-1">ارزشمند (V)</th>
                  <th className="py-2 px-1">کمیاب (R)</th>
                  <th className="py-2 px-1">تقلیدناپذیر (I)</th>
                  <th className="py-2 px-1">جایگزین‌ناپذیر (N)</th>
                  <th className="py-2 px-2">امتیاز (از ۱۰۰)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold">
                {barneyKeys.map((k) => {
                  const r = resScores[k]
                  return (
                    <tr key={k}>
                      <td className="py-2.5 px-2 text-right font-bold">{barneyData[k].title}</td>
                      <td className="py-2.5 px-1 font-mono">{anyBarneyAnswered ? r.V.toFixed(1) : '—'}</td>
                      <td className="py-2.5 px-1 font-mono">{anyBarneyAnswered ? r.R.toFixed(1) : '—'}</td>
                      <td className="py-2.5 px-1 font-mono">{anyBarneyAnswered ? r.I.toFixed(1) : '—'}</td>
                      <td className="py-2.5 px-1 font-mono">{anyBarneyAnswered ? r.N.toFixed(1) : '—'}</td>
                      <td className="py-2.5 px-2 font-mono font-black text-emerald-700">
                        {anyBarneyAnswered ? `${r.S_k}%` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-1.5 mt-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-emerald-950">امتیاز نهایی پایداری منابع بنگاه:</span>
            <span className="text-2xl font-black text-emerald-700">{FS ?? '—'}</span>
          </div>
          <div className="text-[11px] text-emerald-900 leading-relaxed">
            {anyBarneyAnswered
              ? 'بر اساس پاسخ‌های غیرمستقیم شما در تب ۳، بیشترین درجه ابهام علی و پیچیدگی اجتماعی مربوط به منابع سازمانی و انسانی است که کپی‌برداری از آن را حتی با استخدام افراد کلیدی توسط رقبا غیرممکن می‌سازد.'
              : 'لطفاً سوالات تب‌های ۱ تا ۴ ماژول ۲ را پاسخ دهید.'}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <span className="text-xs font-bold text-emerald-400">قیف پایداری مزیت رقابتی بنگاه (بارنی ۱۹۹۱)</span>
          <div className="space-y-2.5 text-xs">
            {barneyKeys.map((k) => {
              const r = resScores[k]
              return (
                <div
                  key={k}
                  className="bg-slate-800 p-3 rounded-2xl border border-slate-700 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold text-white">{barneyData[k].title}</div>
                    <div className="text-[11px] text-slate-400">
                      ابهام علی استنتاج‌شده: {anyBarneyAnswered ? `${Math.round(((r.I_ambig - 1) / 4) * 100)}%` : '—'}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-black text-emerald-400 text-sm">{anyBarneyAnswered ? `${r.S_k}%` : '—'}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
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
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
        >
          <span>ذخیره و انتقال به ماژول ۳: ترکیب با ضرایب مک‌گاهان و پورتر</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
