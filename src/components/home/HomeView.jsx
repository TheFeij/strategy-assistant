import { useStrategy } from '../../state/StrategyContext'
import { toFaNumber } from '../../utils/numbers'

const moduleCards = [
  {
    id: 'mod1',
    badge: 'نگاه بیرون به درون',
    title: 'تحلیل جذابیت صنعت',
    subtitle: 'بر اساس مقاله ۵ نیروی رقابتی پورتر (۲۰۰۸) + ROIC صنایع ایران',
    header: 'bg-gradient-to-l from-indigo-600 to-indigo-800',
    footer: 'bg-indigo-50 border-indigo-100 text-indigo-700 group-hover:bg-indigo-600',
    stats: [
      { label: 'امتیاز فعلی و آینده صنعت', key: 'ind' },
      { label: 'تنگنای اصلی سود:', key: 'bottleneck', left: true },
    ],
    footerLabel: 'ورود به تحلیل جذابیت صنعت',
  },
  {
    id: 'mod2',
    badge: 'نگاه درون به بیرون',
    title: 'تحلیل جذابیت بنگاه',
    subtitle: 'بر اساس مقاله منابع بنگاه و مزیت رقابتی پایدار بارنی (۱۹۹۱)',
    header: 'bg-gradient-to-l from-emerald-600 to-teal-800',
    footer: 'bg-emerald-50 border-emerald-100 text-emerald-800 group-hover:bg-emerald-600',
    stats: [
      { label: 'امتیاز پایداری منابع بنگاه', key: 'firm' },
      { label: 'وضعیت مزیت رقابتی:', key: 'badge', left: true },
    ],
    footerLabel: 'ورود به تحلیل جذابیت بنگاه',
  },
  {
    id: 'mod3',
    badge: 'سنتز نهایی',
    title: 'ترکیب صنعت و منابع بنگاه',
    subtitle: 'بر اساس ضرایب مقاله مک‌گاهان و پورتر (۱۹۹۷)',
    header: 'bg-gradient-to-l from-amber-600 via-orange-600 to-slate-900',
    footer: 'bg-amber-50 border-amber-100 text-amber-900 group-hover:bg-amber-600',
    stats: [
      { label: 'امتیاز موزون مک‌گاهان-پورتر', key: 'combined' },
      { label: 'بخش اقتصادی فعال:', key: 'sector', left: true },
    ],
    footerLabel: 'ورود به ترکیب تحلیل‌ها و استراتژی',
  },
]

function StatValue({ card, s }) {
  const { IS_current, IS_future, bindingForceName, FS, bestBadge, combinedScore, secObj, isBlank } = useStrategy()

  if (s.key === 'ind') {
    return (
      <div className="flex items-baseline gap-2 mt-0.5">
        <span className="text-2xl font-black text-indigo-700">{IS_current != null ? toFaNumber(IS_current) : '—'}</span>
        <span className="text-xs text-slate-400">فعلی | آینده:</span>
        <span className="text-xl font-extrabold text-teal-600">{IS_future != null ? toFaNumber(IS_future) : '—'}</span>
      </div>
    )
  }
  if (s.key === 'bottleneck') {
    return <div className="text-xs font-extrabold text-rose-600 mt-0.5">{bindingForceName}</div>
  }
  if (s.key === 'firm') {
    return (
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-2xl font-black text-emerald-700">{FS != null ? toFaNumber(FS) : '—'}</span>
        <span className="text-xs text-slate-400">/ ۱۰۰</span>
      </div>
    )
  }
  if (s.key === 'badge') {
    return (
      <span className="inline-block text-xs font-extrabold text-emerald-700 mt-0.5">
        {isBlank ? 'در انتظار تکمیل فرم' : toFaNumber(bestBadge)}
      </span>
    )
  }
  if (s.key === 'combined') {
    return (
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-2xl font-black text-amber-600">
          {combinedScore != null ? toFaNumber(combinedScore) : '—'}
        </span>
        <span className="text-xs text-slate-400">/ ۱۰۰</span>
      </div>
    )
  }
  if (s.key === 'sector') {
    return <div className="text-xs font-extrabold text-slate-800 mt-0.5">{toFaNumber(secObj.name)}</div>
  }
  return null
}

const scoreTones = {
  sky: {
    from: '#7dd3fc',
    to: '#0284c7',
    surface: 'border-sky-400/30 bg-slate-900',
  },
  emerald: {
    from: '#6ee7b7',
    to: '#059669',
    surface: 'border-emerald-400/30 bg-slate-900',
  },
  amber: {
    from: '#fcd34d',
    to: '#d97706',
    surface: 'border-amber-400/30 bg-slate-900',
  },
}

function ScoreRing({ id, value, label, source, tone = 'indigo' }) {
  const hasValue = value != null
  const filled = hasValue ? Math.max(0, Math.min(100, Number(value))) : 0
  const colors = scoreTones[tone]
  const center = 60
  const radius = 44
  const gaugeSweep = 270
  const startAngle = 135
  const circumference = 2 * Math.PI * radius
  const arcLength = circumference * (gaugeSweep / 360)
  const progressLength = arcLength * (filled / 100)

  const pointAt = (angle, r) => {
    const rad = (angle * Math.PI) / 180
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) }
  }

  const ticks = Array.from({ length: 21 }, (_, i) => {
    const ratio = i / 20
    const angle = startAngle + ratio * gaugeSweep
    const inner = pointAt(angle, 51)
    const outer = pointAt(angle, 57)
    return {
      key: i,
      inner,
      outer,
      active: hasValue && ratio <= filled / 100,
    }
  })

  const marker = pointAt(startAngle + (filled / 100) * gaugeSweep, radius)
  const displayValue = hasValue ? toFaNumber(value) : '—'

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 shadow-lg shadow-slate-950/20 sm:flex sm:flex-col sm:items-center sm:gap-3 sm:p-5 sm:text-center ${colors.surface}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(circle at 85% 0%, ${colors.from}26, transparent 65%)` }}
      />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-l from-transparent via-white/40 to-transparent" />

      <div className="relative flex items-center gap-4 sm:flex-col sm:gap-3">
        <div
          className="relative h-40 w-40 shrink-0"
          role="img"
          aria-label={`${label}: ${hasValue ? displayValue : 'بدون امتیاز'} از ۱۰۰`}
        >
          <svg viewBox="0 0 120 120" className="h-40 w-40 overflow-visible">
            <defs>
              <linearGradient id={id} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colors.from} />
                <stop offset="100%" stopColor={colors.to} />
              </linearGradient>
              <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {ticks.map((tick) => (
              <line
                key={tick.key}
                x1={tick.inner.x}
                y1={tick.inner.y}
                x2={tick.outer.x}
                y2={tick.outer.y}
                stroke={tick.active ? colors.from : 'currentColor'}
                strokeWidth={tick.active ? 2.2 : 1.2}
                strokeLinecap="round"
                className={tick.active ? undefined : 'text-white/20'}
              />
            ))}

            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-white/10"
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${circumference}`}
              transform={`rotate(${startAngle} ${center} ${center})`}
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={`url(#${id})`}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${progressLength} ${circumference}`}
              transform={`rotate(${startAngle} ${center} ${center})`}
              filter={`url(#${id}-glow)`}
              className="transition-all duration-700 ease-out"
            />
            <circle
              cx={center}
              cy={center}
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="1 6"
              strokeLinecap="round"
              className="text-white/10"
            />
            {hasValue && filled > 0 && (
              <>
                <circle cx={marker.x} cy={marker.y} r="7" fill={colors.to} opacity="0.25" />
                <circle cx={marker.x} cy={marker.y} r="4" fill="#ffffff" stroke={colors.to} strokeWidth="2.5" />
              </>
            )}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
            <span className="text-4xl font-black leading-none tracking-tight text-white">{displayValue}</span>
            <span className="mt-1 text-xs font-semibold text-slate-300">از ۱۰۰</span>
          </div>
        </div>

        <div>
          <div className="text-sm font-extrabold text-white sm:text-base">{label}</div>
          <div className="mt-0.5 text-xs text-slate-300">{source}</div>
          <div className="mt-2 h-1.5 w-20 overflow-hidden rounded-full bg-white/10 sm:mx-auto">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${filled}%`,
                background: `linear-gradient(90deg, ${colors.to}, ${colors.from})`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomeView() {
  const { navigate, IS_current, FS, combinedScore } = useStrategy()

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-l from-[#020617]/30 via-[#1e1b4b]/25 to-[#020617]/30 p-5 text-white shadow-xl shadow-slate-950/20 backdrop-blur-sm [text-shadow:0_1px_8px_rgba(2,6,23,0.35)] sm:p-7 dark:border-white/10 dark:from-slate-950/80 dark:via-indigo-950/70 dark:to-slate-950/80 dark:shadow-slate-950/30 dark:backdrop-blur-none dark:backdrop-saturate-100 dark:[text-shadow:none]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/40 to-transparent" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative">
          <h1 className="bg-gradient-to-l from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-center text-2xl font-black leading-tight text-transparent [text-shadow:none] sm:text-3xl dark:from-white dark:via-slate-100 dark:to-slate-300">
            داشبورد مدیریتی
          </h1>
          <div className="mx-auto mt-3 h-1 w-28 rounded-full bg-gradient-to-l from-teal-400 via-indigo-400 to-indigo-400 shadow-sm" />

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ScoreRing
              id="hero-score-industry"
              value={IS_current}
              label="جذابیت صنعت"
              source="پورتر"
              tone="sky"
            />
            <ScoreRing
              id="hero-score-firm"
              value={FS}
              label="جذابیت بنگاه"
              source="بارنی"
              tone="emerald"
            />
            <ScoreRing
              id="hero-score-combined"
              value={combinedScore}
              label="امتیاز نهایی"
              source="مک‌گاهان"
              tone="amber"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {moduleCards.map((card) => (
          <button
            type="button"
            key={card.id}
            onClick={() => navigate(card.id)}
            className="module-portal-card text-right cursor-pointer bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className={`${card.header} p-4 text-white`}>
                <span className="inline-block text-xs font-bold bg-white/15 px-2.5 py-0.5 rounded-full">
                  {card.badge}
                </span>
                <h3 className="text-lg font-black mt-2">{card.title}</h3>
                <p className="text-sm text-white/80 mt-1">{card.subtitle}</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  {card.stats.map((s) => (
                    <div key={s.key} className={s.left ? 'text-left' : ''}>
                      <div className="text-xs text-slate-500">{s.label}</div>
                      <StatValue card={card} s={s} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className={`px-4 py-3 border-t flex items-center justify-between text-sm font-extrabold transition group-hover:text-white ${card.footer}`}
            >
              <span>{card.footerLabel}</span>
              <span className="text-base">←</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
