import { Doughnut } from 'react-chartjs-2'
import { useStrategy } from '../../state/StrategyContext'
import { mcgahanSectors } from '../../data/mcgahan'
import { toFaNumber } from '../../utils/numbers'

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
        backgroundColor: ['#2878A8', '#147D78', '#D6A449'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 14, font: { size: 13 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${toFaNumber(Number(ctx.parsed).toFixed(1))}%`,
        },
      },
    },
    cutout: '58%',
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-2xl p-4 border border-line shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <div>
            <h3 className="text-base font-black text-midnight-900">
              جدول 4 مقاله مک‌گاهان و پورتر: سهم عوامل در تفاوت سودآوری (ROIC)
            </h3>
            <p className="text-xs text-muted">
              روی بخش اقتصادی مرتبط کلیک کنید یا از سطر اول (میانگین کل صنایع) استفاده نمایید
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse min-w-[720px]">
            <thead>
              <tr className="bg-midnight text-white">
                <th className="py-3 px-3 rounded-tr-xl">بخش اقتصادی</th>
                <th className="py-3 px-2 text-center">اثر صنعت</th>
                <th className="py-3 px-2 text-center">اثر واحد کسب‌وکار</th>
                <th className="py-3 px-2 text-center">اثر شرکت مادر</th>
                <th className="py-3 px-2 text-center">کل مدل توضیح‌داده‌شده</th>
                <th className="py-3 px-3 rounded-tl-xl">تحلیل و تفسیر راهبردی برای داشبورد</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {mcgahanSectors.map((sec) => {
                const selected = sec.id === selectedMcgahanSector
                return (
                  <tr
                    key={sec.id}
                    onClick={() => set({ selectedMcgahanSector: sec.id })}
                    className={`cursor-pointer transition ${
                      selected ? 'bg-gold-50 border-r-4 border-gold-500 font-bold' : 'hover:bg-canvas'
                    }`}
                  >
                    <td className="py-3 px-3 font-extrabold text-midnight-900">{sec.name}</td>
                    <td className="py-3 px-2 text-center tabular-nums text-industry-700 font-bold">
                      {toFaNumber(sec.indEffect.toFixed(2))}%
                    </td>
                    <td className="py-3 px-2 text-center tabular-nums text-brand-700 font-bold">
                      {toFaNumber(sec.firmEffect.toFixed(2))}%
                    </td>
                    <td className="py-3 px-2 text-center tabular-nums text-gold-800">{toFaNumber(sec.corpLabel)}</td>
                    <td className="py-3 px-2 text-center tabular-nums">{toFaNumber(sec.totalModel)}</td>
                    <td className="py-3 px-3 text-xs text-muted">{toFaNumber(sec.interpretation)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="border-b border-line pb-3">
            <h4 className="text-sm font-black text-midnight-900">ضرایب نرمال‌شده ترکیب امتیاز</h4>
            <p className="text-xs font-extrabold text-gold-800 mt-1">بخش انتخابی: {secObj.name}</p>
          </div>
          <div className="h-44 flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="bg-canvas p-3.5 rounded-2xl border border-line space-y-2 text-xs">
            <label className="flex items-center gap-2 font-bold text-midnight-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCorpParent}
                onChange={(e) => set({ includeCorpParent: e.target.checked })}
              />
              <span>لحاظ کردن امتیاز «شرکت مادر / هلدینگ» (در صورت وجود)</span>
            </label>
            <div className="flex justify-between pt-1">
              <span>امتیاز پشتیبانی شرکت مادر (از ۱۰۰):</span>
              <strong className="text-gold-800">{toFaNumber(corpScore)}</strong>
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
          <div className="bg-canvas border border-line rounded-2xl p-3.5 text-xs space-y-1.5">
            <div className="flex justify-between gap-2">
              <span>وزن نرمال‌شده جذابیت صنعت:</span>
              <strong className="text-industry-700">{toFaNumber((nWI * 100).toFixed(1))}%</strong>
            </div>
            <div className="flex justify-between gap-2">
              <span>وزن نرمال‌شده منابع بنگاه:</span>
              <strong className="text-brand-700">{toFaNumber((nWF * 100).toFixed(1))}%</strong>
            </div>
            <div className="flex justify-between gap-2">
              <span>وزن نرمال‌شده شرکت مادر:</span>
              <strong className="text-gold-800">{toFaNumber((nWC * 100).toFixed(1))}%</strong>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMod3Tab(2)}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
        >
          <span>مشاهده بیانیه نهایی استراتژی ورود و رقابت</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
