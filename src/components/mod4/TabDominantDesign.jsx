import { useStrategy } from '../../state/StrategyContext'
import { pfiDominantDesign } from '../../data/pfi'
import PfiQuestionCard from './PfiQuestionCard'

export default function TabDominantDesign() {
  const { pfiAnswers, setPfiAnswer, setMod4Tab } = useStrategy()

  return (
    <div className="bg-white rounded-2xl p-4 border border-line shadow-sm space-y-4">
      <div className="bg-canvas border border-line border-r-4 !border-r-midnight-400 rounded-2xl p-4 text-sm space-y-1">
        <span className="font-extrabold text-midnight-900 block">آیا استاندارد محصول در بازار جا افتاده است؟</span>
        <p className="leading-relaxed text-muted">
          مشخص کنید بازار هنوز در دوران تنوع طرح‌هاست یا رقابت به قیمت و مقیاس رسیده است.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pfiDominantDesign.map((q, idx) => (
          <PfiQuestionCard
            key={q.id}
            question={q}
            number={idx + 1}
            value={pfiAnswers[q.id]}
            onChange={(v) => setPfiAnswer(q.id, v)}
          />
        ))}
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-3">
        <button
          type="button"
          onClick={() => setMod4Tab(1)}
          className="bg-canvas hover:bg-line text-ink text-xs font-bold px-4 py-2.5 rounded-xl border border-line transition"
        >
          بازگشت به محافظت در برابر کپی
        </button>
        <button
          type="button"
          onClick={() => setMod4Tab(3)}
          className="bg-midnight hover:bg-midnight-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-sm flex items-center gap-2 transition"
        >
          <span>ادامه به حلقه‌های فروش و اجرا</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
