const WIDTH = 260
const HEIGHT = 188
const CX = 130
const CY = 100
const RADIUS = 74
const STROKE = 16
const START = 135
const SWEEP = 270

const polar = (angle, radius = RADIUS) => {
  const rad = (angle * Math.PI) / 180
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  }
}

const arcPath = (from, to, radius = RADIUS) => {
  const start = polar(from, radius)
  const end = polar(to, radius)
  const largeArc = to - from > 180 ? 1 : 0
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

const startPoint = polar(START, RADIUS + 20)
const endPoint = polar(START + SWEEP, RADIUS + 20)

/**
 * Power BI style arc gauge. `value` is expected on a 0..100 scale,
 * `null` renders the empty state with a dash.
 */
export default function GaugeChart({ value = null, color = 'var(--chart-1)', sublabel = 'از ۱۰۰' }) {
  const safeValue = typeof value === 'number' ? Math.min(100, Math.max(0, value)) : null
  const endAngle = START + (SWEEP * (safeValue ?? 0)) / 100
  const hasValue = safeValue !== null

  return (
    <div className="chart chart-gauge">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={hasValue ? `امتیاز ${safeValue} از ۱۰۰` : 'امتیاز ثبت نشده'}
      >
        <path
          d={arcPath(START, START + SWEEP)}
          fill="none"
          stroke="var(--chart-track)"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />

        {hasValue && safeValue > 0 ? (
          <path
            d={arcPath(START, endAngle)}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
          />
        ) : null}

        <text
          x={CX}
          y={CY - 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="42"
          fontWeight="800"
          fill="#0b1f3a"
        >
          {hasValue ? safeValue : '—'}
        </text>

        <text x={CX} y={CY + 30} textAnchor="middle" fontSize="11.5" fill="var(--muted)">
          {sublabel}
        </text>

        <text x={startPoint.x} y={startPoint.y} textAnchor="middle" fontSize="9.5" fill="var(--chart-axis)">
          ۰
        </text>
        <text x={endPoint.x} y={endPoint.y} textAnchor="middle" fontSize="9.5" fill="var(--chart-axis)">
          ۱۰۰
        </text>
      </svg>
    </div>
  )
}
