import { useStrategy } from '../../state/StrategyContext'
import { barneyData, barneyKeys } from '../../data/barney'

export default function TabChecklist() {
  const { barneyChecklist, toggleBarneyCheck, setBarneyDetail, setMod2Tab } = useStrategy()

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-black text-slate-900">
          شناسایی و تیک‌زدن مصادیق منابع سه‌گانه بنگاه (فیزیکی، انسانی، سازمانی)
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          از آنجا که ممکن است کاربر با دیدن عنوان کلی «منابع فیزیکی، انسانی و سازمانی» نداند دقیقاً چه مواردی مد نظر مقاله
          بارنی (۱۹۹۱) است، در جدول زیر مصادیق هر دسته را تیک بزنید و در کادر روبه‌روی آن، توضیح یا مصداق خاص شرکت
          خودتان را بنویسید:
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {barneyKeys.map((k) => {
          const b = barneyData[k]
          return (
            <div key={k} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div>
                <h4 className="text-sm font-black text-slate-900">{b.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{b.subtitle}</p>
              </div>
              <div className="space-y-2">
                {b.checklist.map((item) => {
                  const entry = barneyChecklist[`${k}.${item.id}`] || { checked: false, detail: '' }
                  return (
                    <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                      <label className="flex items-start gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={entry.checked}
                          onChange={(e) => toggleBarneyCheck(k, item.id, e.target.checked)}
                          className="mt-0.5 rounded text-emerald-600"
                        />
                        <span className="font-bold text-slate-800">{item.label}</span>
                      </label>
                      <input
                        type="text"
                        value={entry.detail}
                        onChange={(e) => setBarneyDetail(k, item.id, e.target.value)}
                        placeholder="توضیح یا مصداق دقیق در شرکت شما (اختیاری)..."
                        className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => setMod2Tab('V')}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md flex items-center gap-2"
        >
          <span>ادامه به سنجش ارزشمند بودن منابع (Valuable)</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
