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
      <div className="lg:col-span-5 bg-white rounded-2xl p-4 border border-line shadow-sm space-y-4">
        <div className="border-b border-line pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-midnight-900">الف) تعیین محدوده صنعت و انتخاب گروه صنعتی ایران</h3>
            <p className="text-sm text-muted">با انتخاب صنعت از لیست زیر، میانگین ROIC صنعت در ایران خودکار جایگذاری می‌شود</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-industry-900 mb-1">
              ۱. انتخاب گروه صنعت از لیست ۲۰ صنعت منتخب ایران (داده‌های بورس و کدال ۱۳۹۳-۱۴۰۲):
            </label>
            <select
              value={selectedIranIndustryId}
              onChange={(e) => selectIranIndustry(e.target.value)}
              className="w-full rounded-xl border-2 border-industry-200 bg-industry-50/40 px-3 py-2.5 font-bold text-midnight-800 focus:outline-none focus:border-industry-600"
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
              <label className="block font-bold text-midnight-700 mb-1">نام دقیق محصول / خدمت شما:</label>
              <input
                type="text"
                value={scopeProduct}
                onChange={(e) => set({ scopeProduct: e.target.value })}
                placeholder="مثلاً: تولید قطعات صنعتی یا نرم‌افزار..."
                className="w-full rounded-xl border border-midnight-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-midnight-700 mb-1">گستره جغرافیایی فعالیت:</label>
              <input
                type="text"
                value={scopeGeo}
                onChange={(e) => set({ scopeGeo: e.target.value })}
                placeholder="مثلاً: سراسر ایران و صادرات منطقه"
                className="w-full rounded-xl border border-midnight-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="pt-1">
            <AiConsult
              buttonLabel="🤖 مشورت با AI برای تشخیص مرز درست صنعت و افق زمانی"
              hint="راهنمای هوش مصنوعی (بر اساس مقاله پورتر ۲۰۰۸): مرز صنعت نباید بیش از حد کلان (مثلاً کل صنعت غذا) یا بیش از حد خرد باشد. اگر دو خط محصول شما مشتریان، تامین‌کنندگان و رقبای کاملاً متفاوتی دارند، باید برای هر کدام این فرم را جداگانه پر کنید. افق زمانی مناسب برای تحلیل ساختاری صنایع ایران ۳ تا ۵ سال است."
              panelAlign="left"
            />
          </div>

          <div className="bg-canvas p-4 rounded-2xl border border-line space-y-3 mt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-midnight-800">میانگین ROIC صنعت انتخابی در ایران (%):</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-industry-700 bg-white px-3 py-0.5 rounded-lg border">
                  {indRoic != null ? `${toFaNumber(Number(indRoic).toFixed(1))}%` : '—'}
                </span>
                <span className="group relative inline-flex shrink-0">
                  <button
                    type="button"
                    aria-label="راهنمای نحوه محاسبه ROIC"
                    className="w-6 h-6 rounded-full bg-white border border-industry-300 text-industry-700 text-xs font-black flex items-center justify-center hover:bg-industry-50 focus-visible:bg-industry-50"
                  >
                    ؟
                  </button>
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute top-full mt-2 right-0 z-30 w-72 max-w-[80vw] rounded-xl bg-midnight p-3 text-xs leading-relaxed text-midnight-100 text-right shadow-lg opacity-0 invisible transition-opacity duration-150 group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible"
                  >
                    <strong className="block mb-1 text-white">
                      نحوه محاسبه ROIC صنایع ایران (هم‌سنگ فرمول صفحه ۲۸ مقاله پورتر):
                    </strong>
                    تقسیم سود عملیاتی قبل از بهره و مالیات (EBIT) بر میانگین سرمایه درگیر عملیاتی (دارایی‌های ثابت + سرمایه
                    در گردش عملیاتی منهای وجه نقد مازاد) بر اساس صورت‌های مالی حسابرسی‌شده سامانه کدال (۱۳۹۳–۱۴۰۲) در مقیاس
                    اسمی ریالی (خط مبنای میانگین صنایع ایران = <strong className="text-brand-300">۳۹.۰٪</strong> در برابر
                    ۱۴.۹٪ در اقتصاد کم‌تورم آمریکا).
                  </span>
                </span>
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="55"
              step="0.5"
              value={indRoic ?? 39}
              onChange={(e) => set({ indRoic: parseFloat(e.target.value) })}
              className="industry-range"
            />
          </div>

          <div className="bg-gold-50/70 p-4 rounded-2xl border border-gold-200 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-extrabold text-gold-950">📊 داده مالی بنگاه شما (اختیاری - جهت مقایسه با صنعت):</span>
              <span className="font-black text-xs bg-white px-2.5 py-1 rounded border border-gold-300 text-gold-900">
                ROIC بنگاه: {firmRoic != null ? `${toFaNumber(firmRoic.toFixed(1))}%` : '—'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-bold text-midnight-700 mb-1">سود عملیاتی سالانه (EBIT):</label>
                <input
                  type="number"
                  value={firmNopat}
                  onChange={(e) => set({ firmNopat: e.target.value })}
                  placeholder="مثلاً 450"
                  className="w-full rounded-xl border border-gold-300 px-2.5 py-1.5 bg-white font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-midnight-700 mb-1">میانگین سرمایه درگیر بنگاه:</label>
                <input
                  type="number"
                  value={firmCapital}
                  onChange={(e) => set({ firmCapital: e.target.value })}
                  placeholder="مثلاً 1100"
                  className="w-full rounded-xl border border-gold-300 px-2.5 py-1.5 bg-white font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white rounded-2xl p-4 border border-line shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3 mb-3">
            <div>
              <h3 className="text-base font-black text-midnight-900">سودآوری صنایع منتخب ایران (نسخه بومی جدول پورتر)</h3>
              <p className="text-sm text-muted">
                میانگین نرخ بازده سرمایه درگیر (ROIC) — دوره ۱۳۹۳–۱۴۰۲ (داده‌های بورس و کدال) — روی هر صنعت کلیک کنید تا
                انتخاب شود
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2 py-0.5 rounded bg-gold-100 text-gold-800 border border-gold-200">
                طلایی: بالاتر از میانگین ایران (۳۹٪+)
              </span>
              <span className="px-2 py-0.5 rounded bg-industry-100 text-industry-800 border border-industry-200">
                آبی: پایین‌تر از خط مبنا
              </span>
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
                      ? 'bg-industry-50 border border-industry-400 rounded-lg p-1.5'
                      : 'hover:bg-canvas border border-transparent rounded-lg p-1'
                  }`}
                >
                  <div className="col-span-5 font-semibold text-midnight-800 truncate">{ind.name}</div>
                  <div className="col-span-6 bg-canvas h-5 rounded overflow-hidden flex items-center">
                    <div
                      className={`${ind.aboveAvg ? 'bg-gold-500 text-midnight' : 'bg-industry-600 text-white'} h-full text-xs font-bold flex items-center px-2 transition-all`}
                      style={{ width: `${widthPct}%` }}
                    >
                      {toFaNumber(ind.roic.toFixed(1))}%
                    </div>
                  </div>
                  <div className="col-span-1 text-left tabular-nums font-bold text-midnight-700">
                    {toFaNumber(ind.roic.toFixed(1))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-extrabold text-midnight-800">
            میانگین ROIC صنایع ایران (خط مبنا / Benchmark): {toFaNumber(IRAN_ROIC_BENCHMARK.toFixed(1))}٪
          </span>
          <button
            type="button"
            onClick={() => setMod1Tab(2)}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <span>ادامه به سنجش ۵ نیروی رقابتی</span>
            <span>←</span>
          </button>
        </div>
      </div>
    </div>
  )
}
