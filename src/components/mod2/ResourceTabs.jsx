import { barneyData, barneyKeys } from '../../data/barney'

export default function ResourceTabs({ activeKey, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {barneyKeys.map((k) => {
        const active = activeKey === k
        return (
          <button
            type="button"
            key={k}
            onClick={() => onChange(k)}
            aria-pressed={active}
            className={`rounded-xl px-2 py-2.5 text-center text-xs sm:text-sm font-extrabold transition border ${
              active
                ? 'subtab-active-brand border-brand-700'
                : 'bg-white hover:bg-brand-50 text-midnight-700 border-line'
            }`}
          >
            {barneyData[k].title}
          </button>
        )
      })}
    </div>
  )
}
