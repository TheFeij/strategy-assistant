import { useStrategy } from '../../state/StrategyContext'
import { iranIndustriesRoic, IRAN_ROIC_BENCHMARK } from '../../data/iranIndustries'
import { AiConsult } from '../ui/Controls'
import { toFaNumber } from '../../utils/numbers'

export default function TabRoic() {
  const {
    selectedIranIndustryId,
    indRoic,
    scopeProduct,
    scopeGeo,
    firmNopat,
    firmCapital,
    firmRoic,
    selectIranIndustry,
    set,
    setMod1Tab,
  } = useStrategy()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-5 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">الف) تعیین محدوده صنعت و انتخاب گروه صنعتی ایران</h3>
            <p className="text-sm text-slate-500">با انتخاب صنعت از لیست زیر، میانگین ROIC صنعت در ایران خودکار جایگذاری می‌شود</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-indigo-900 mb-1">
              ۱. انتخاب گروه صنعت از لیست ۲۰ صنعت منتخب ایران (داده‌های بورس و کدال ۱۳۹۳-۱۴۰۲):
            </label>
            <select
              value={selectedIranIndustryId}
              onChange={(e) => selectIranIndustry(e.target.value)}
              className="w-full rounded-xl border-2 border-indigo-200 bg-indigo-50/40 px-3 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
            >
              <option value="">— صنعت خود را انتخاب کنید تا ROIC صنعت جایگذاری شود —</option>
              {iranIndustriesRoic.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name} — میانگین ROIC: {toFaNumber(ind.roic.toFixed(1))}%
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">نام دقیق محصول / خدمت شما:</label>
              <input
                type="text"
                value={scopeProduct}
                onChange={(e) => set({ scopeProduct: e.target.value })}
                placeholder="مثلاً: تولید قطعات صنعتی یا نرم‌افزار..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">گستره جغرافیایی فعالیت:</label>
              <input
                type="text"
                value={scopeGeo}
                onChange={(e) => set({ scopeGeo: e.target.value })}
                placeholder="مثلاً: سراسر ایران و صادرات منطقه"
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="pt-1">
            <AiConsult
              buttonLabel="🤖 مشورت با AI برای تشخیص مرز درست صنعت و افق زمانی"
              hint="راهنمای هوش مصنوعی (بر اساس مقاله پورتر ۲۰۰۸): مرز صنعت نباید بیش از حد کلان (مثلاً کل صنعت غذا) یا بیش از حد خرد باشد. اگر دو خط محصول شما مشتریان، تامین‌کنندگان و رقبای کاملاً متفاوتی دارند، باید برای هر کدام این فرم را جداگانه پر کنید. افق زمانی مناسب برای تحلیل ساختاری صنایع ایران ۳ تا ۵ سال است."
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-800">میانگین ROIC صنعت انتخابی در ایران (%):</span>
              <span className="font-black text-base text-indigo-700 bg-white px-3 py-0.5 rounded-lg border">
                {indRoic != null ? `${toFaNumber(Number(indRoic).toFixed(1))}%` : '—'}
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="55"
              step="0.5"
              value={indRoic ?? 39}
              onChange={(e) => set({ indRoic: parseFloat(e.target.value) })}
              className="ai-range"
            />
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>نحوه محاسبه ROIC صنایع ایران (هم‌سنگ فرمول صفحه ۲۸ مقاله پورتر):</strong> تقسیم سود عملیاتی قبل از
              بهره و مالیات (EBIT) بر میانگین سرمایه درگیر عملیاتی (دارایی‌های ثابت + سرمایه در گردش عملیاتی منهای وجه نقد
              مازاد) بر اساس صورت‌های مالی حسابرسی‌شده سامانه کدال (۱۳۹۳–۱۴۰۲) در مقیاس اسمی ریالی (خط مبنای میانگین
              صنایع ایران = <strong>۳۹.۰٪</strong> در برابر ۱۴.۹٪ در اقتصاد کم‌تورم آمریکا).
            </p>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-amber-950">📊 داده مالی بنگاه شما (اختیاری - جهت مقایسه با صنعت):</span>
              <span className="font-black text-xs bg-white px-2.5 py-1 rounded border border-amber-300 text-amber-900">
                ROIC بنگاه: {firmRoic != null ? `${toFaNumber(firmRoic.toFixed(1))}%` : '—'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">سود عملیاتی سالانه (EBIT):</label>
                <input
                  type="number"
                  value={firmNopat}
                  onChange={(e) => set({ firmNopat: e.target.value })}
                  placeholder="مثلاً 450"
                  className="w-full rounded-xl border border-amber-300 px-2.5 py-1.5 bg-white font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">میانگین سرمایه درگیر بنگاه:</label>
                <input
                  type="number"
                  value={firmCapital}
                  onChange={(e) => set({ firmCapital: e.target.value })}
                  placeholder="مثلاً 1100"
                  className="w-full rounded-xl border border-amber-300 px-2.5 py-1.5 bg-white font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">سودآوری صنایع منتخب ایران (نسخه بومی جدول پورتر)</h3>
              <p className="text-sm text-slate-500">
                میانگین نرخ بازده سرمایه درگیر (ROIC) — دوره ۱۳۹۳–۱۴۰۲ (داده‌های بورس و کدال) — روی هر صنعت کلیک کنید تا
                انتخاب شود
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-700">قرمز: بالاتر از میانگین ایران (۳۹٪+)</span>
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800">آبی: پایین‌تر از خط مبنا</span>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[470px] overflow-y-auto pl-2 text-xs">
            {iranIndustriesRoic.map((ind) => {
              const isSelected = ind.id === selectedIranIndustryId
              const widthPct = Math.round((ind.roic / 50.0) * 100)
              return (
                <button
                  type="button"
                  key={ind.id}
                  onClick={() => selectIranIndustry(ind.id)}
                  className={`w-full grid grid-cols-12 items-center gap-2 text-right cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-50 border border-indigo-400 rounded-lg p-1.5'
                      : 'hover:bg-slate-50 rounded-lg p-1'
                  }`}
                >
                  <div className="col-span-5 font-semibold text-slate-800 truncate">{ind.name}</div>
                  <div className="col-span-6 bg-slate-100 h-5 rounded overflow-hidden flex items-center">
                    <div
                      className={`${ind.aboveAvg ? 'bg-red-600' : 'bg-sky-700'} h-full text-xs text-white font-bold flex items-center px-2 transition-all`}
                      style={{ width: `${widthPct}%` }}
                    >
                      {toFaNumber(ind.roic.toFixed(1))}%
                    </div>
                  </div>
                  <div className="col-span-1 text-left font-mono font-bold text-slate-700">
                    {toFaNumber(ind.roic.toFixed(1))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-extrabold text-slate-800">
            میانگین ROIC صنایع ایران (خط مبنا / Benchmark): {toFaNumber(IRAN_ROIC_BENCHMARK.toFixed(1))}٪
          </span>
          <button
            type="button"
            onClick={() => setMod1Tab(2)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow flex items-center gap-1.5"
          >
            <span>ادامه به سنجش ۵ نیروی رقابتی</span>
            <span>←</span>
          </button>
        </div>
      </div>
    </div>
  )
}
