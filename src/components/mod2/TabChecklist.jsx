import { useState } from 'react'
import { useStrategy } from '../../state/StrategyContext'
import { barneyData, barneyKeys } from '../../data/barney'
import { toFaNumber } from '../../utils/numbers'
import ResourceTabs from './ResourceTabs'

export default function TabChecklist() {
  const { barneyChecklist, toggleBarneyCheck, setBarneyDetail, setMod2Tab } = useStrategy()
  const [activeKey, setActiveKey] = useState(barneyKeys[0])

  const b = barneyData[activeKey]
  const checkedCount = b.checklist.filter(
    (item) => (barneyChecklist[`${activeKey}.${item.id}`] || {}).checked
  ).length

  return (
    <div className="bg-white rounded-2xl p-4 border border-line shadow-sm space-y-4">
      <ResourceTabs activeKey={activeKey} onChange={setActiveKey} />

      <div className="bg-canvas rounded-2xl p-4 border border-line border-r-4 !border-r-brand-400 space-y-3">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-2">
          <p className="text-xs text-muted">{b.subtitle}</p>
          <span className="text-[11px] font-bold text-brand-800 bg-brand-50 border border-brand-200 rounded-full px-2 py-0.5 shrink-0">
            {toFaNumber(checkedCount)} / {toFaNumber(b.checklist.length)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {b.checklist.map((item) => {
            const entry = barneyChecklist[`${activeKey}.${item.id}`] || { checked: false, detail: '' }
            return (
              <div key={item.id} className="min-w-0 bg-white p-3 rounded-xl border border-line space-y-2">
                <label className="flex items-start gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={entry.checked}
                    onChange={(e) => toggleBarneyCheck(activeKey, item.id, e.target.checked)}
                    className="mt-0.5 rounded accent-brand-600"
                  />
                  <span className="font-bold text-midnight-800 min-w-0">{item.label}</span>
                </label>
                <input
                  type="text"
                  value={entry.detail}
                  onChange={(e) => setBarneyDetail(activeKey, item.id, e.target.value)}
                  placeholder="توضیح یا مصداق دقیق در شرکت شما (اختیاری)..."
                  className="w-full text-xs rounded-lg border border-line px-2.5 py-1.5 bg-white focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => setMod2Tab('V')}
          className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-sm flex items-center gap-2 transition"
        >
          <span>ادامه به سنجش ارزشمند بودن منابع (Valuable)</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
