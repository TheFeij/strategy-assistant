import { Doughnut } from 'react-chartjs-2'
import { useStrategy } from '../../state/StrategyContext'
import { mcgahanSectors } from '../../data/mcgahan'

export default function TabWeights() {
  const {
    selectedMcgahanSector,
    set,
    includeCorpParent,
    corpScore,
    secObj,
    nWI,
    nWF,
    nWC,
    setMod3Tab,
  } = useStrategy()

  const doughnutData = {
    labels: ['اثر صنعت (%)', 'اثر بنگاه (%)', 'اثر شرکت مادر (%)'],
    datasets: [
      {
        data: [secObj.indEffect, secObj.firmEffect, secObj.corpEffect],
        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
    },
    cutout: '58%',
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900">
              جدول ۴ مقاله مک‌گاهان و پورتر: سهم عوامل در تفاوت سودآوری (ROIC)
            </h3>
            <p className="text-xs text-slate-500">
              روی بخش اقتصادی مرتبط کلیک کنید یا از سطر اول (میانگین کل صنایع) استفاده نمایید
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="py-3 px-3 rounded-tr-xl">بخش اقتصادی</th>
                <th className="py-3 px-2 text-center">اثر صنعت</th>
                <th className="py-3 px-2 text-center">اثر واحد کسب‌وکار</th>
                <th className="py-3 px-2 text-center">اثر شرکت مادر</th>
                <th className="py-3 px-2 text-center">کل مدل توضیح‌داده‌شده</th>
                <th className="py-3 px-3 rounded-tl-xl">تحلیل و تفسیر راهبردی برای داشبورد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mcgahanSectors.map((sec) => {
                const selected = sec.id === selectedMcgahanSector
                return (
                  <tr
                    key={sec.id}
                    onClick={() => set({ selectedMcgahanSector: sec.id })}
                    className={`cursor-pointer transition ${
                      selected ? 'bg-amber-50 border-r-4 border-amber-500 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3 font-extrabold text-slate-900">{sec.name}</td>
                    <td className="py-3 px-2 text-center font-mono text-indigo-700 font-bold">
                      {sec.indEffect.toFixed(2)}%
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-emerald-700 font-bold">
                      {sec.firmEffect.toFixed(2)}%
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-amber-700">{sec.corpLabel}</td>
                    <td className="py-3 px-2 text-center font-mono">{sec.totalModel}</td>
                    <td className="py-3 px-3 text-[11px] text-slate-600">{sec.interpretation}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-sm font-black text-slate-900">ضرایب نرمال‌شده ترکیب امتیاز</h4>
            <p className="text-xs font-extrabold text-amber-700 mt-1">بخش انتخابی: {secObj.name}</p>
          </div>
          <div className="h-44 flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCorpParent}
                onChange={(e) => set({ includeCorpParent: e.target.checked })}
              />
              <span>لحاظ کردن امتیاز «شرکت مادر / هلدینگ» (در صورت وجود)</span>
            </label>
            <div className="flex justify-between pt-1">
              <span>امتیاز پشتیبانی شرکت مادر (از ۱۰۰):</span>
              <strong className="text-amber-700">{corpScore}</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={corpScore}
              onChange={(e) => set({ corpScore: parseFloat(e.target.value) })}
            />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs space-y-1.5">
            <div className="flex justify-between gap-2">
              <span>وزن نرمال‌شده جذابیت صنعت:</span>
              <strong className="text-indigo-700">{(nWI * 100).toFixed(1)}%</strong>
            </div>
            <div className="flex justify-between gap-2">
              <span>وزن نرمال‌شده منابع بنگاه:</span>
              <strong className="text-emerald-700">{(nWF * 100).toFixed(1)}%</strong>
            </div>
            <div className="flex justify-between gap-2">
              <span>وزن نرمال‌شده شرکت مادر:</span>
              <strong className="text-amber-700">{(nWC * 100).toFixed(1)}%</strong>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMod3Tab(2)}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2"
        >
          <span>مشاهده تب ۲: بیانیه نهایی استراتژی ورود و رقابت</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
