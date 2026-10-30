const WIDTH = 760
const LABEL_WIDTH = 205
const PLOT_LEFT = 56
const PLOT_RIGHT = WIDTH - LABEL_WIDTH - 18
const TOP = 28
const ROW_HEIGHT = 40
const BAR_HEIGHT = 18
const AXIS_HEIGHT = 32

const DEFAULT_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
]

/**
 * Horizontal bar chart with gridlines, value labels and an optional target
 * line, following the Power BI visual language. Bars grow right-to-left to
 * match the RTL reading direction.
 *
 * data: [{ label, value|null, color? }]
 */
export default function BarChart({
  data,
  max = 100,
  ticks = [0, 25, 50, 75, 100],
  unit = '',
  formatValue = (value) => String(value),
  target = null,
  targetLabel = 'هدف',
}) {
  if (!data.length) return <div className="chart-empty">داده‌ای برای نمایش ثبت نشده است.</div>

  const plotHeight = data.length * ROW_HEIGHT
  const height = TOP + plotHeight + AXIS_HEIGHT
  const plotWidth = PLOT_RIGHT - PLOT_LEFT
  const safeMax = max > 0 ? max : 1

  const xFor = (value) => PLOT_RIGHT - (Math.max(0, Math.min(value, safeMax)) / safeMax) * plotWidth

  return (
    <div className="chart chart-bar">
      <svg viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label="نمودار میله‌ای">
        {ticks.map((tick) => {
          const x = xFor(tick)
          return (
            <g key={tick}>
              <line
                x1={x}
                x2={x}
                y1={TOP - 10}
                y2={TOP + plotHeight}
                stroke="var(--chart-grid)"
                strokeWidth="1"
              />
              <text x={x} y={TOP + plotHeight + 20} textAnchor="middle" fontSize="10.5" fill="var(--chart-axis)">
                {tick}
              </text>
            </g>
          )
        })}

        {target !== null ? (
          <g>
            <line
              x1={xFor(target)}
              x2={xFor(target)}
              y1={TOP - 14}
              y2={TOP + plotHeight}
              stroke="var(--chart-3)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <text
              x={xFor(target)}
              y={TOP - 18}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="var(--chart-3)"
            >
              {targetLabel}
            </text>
          </g>
        ) : null}

        {data.map((item, index) => {
          const centerY = TOP + index * ROW_HEIGHT + ROW_HEIGHT / 2
          const hasValue = typeof item.value === 'number' && Number.isFinite(item.value)
          const barWidth = hasValue ? Math.max(2, (Math.min(item.value, safeMax) / safeMax) * plotWidth) : 0
          const barX = PLOT_RIGHT - barWidth
          const color = item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]

          return (
            <g key={`${item.label}-${index}`}>
              <title>{`${item.label}: ${hasValue ? `${formatValue(item.value)}${unit}` : 'ثبت نشده'}`}</title>

              <text
                x={WIDTH - 8}
                y={centerY}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="12.5"
                fill="var(--ink-soft)"
              >
                {item.label}
              </text>

              <rect
                x={PLOT_LEFT}
                y={centerY - BAR_HEIGHT / 2}
                width={plotWidth}
                height={BAR_HEIGHT}
                rx={4}
                fill="var(--chart-track)"
              />

              {hasValue ? (
                <rect
                  className="chart-bar-mark"
                  x={barX}
                  y={centerY - BAR_HEIGHT / 2}
                  width={barWidth}
                  height={BAR_HEIGHT}
                  rx={4}
                  fill={color}
                />
              ) : null}

              <text
                x={hasValue ? barX - 8 : PLOT_RIGHT - 8}
                y={centerY}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="600"
                fill={hasValue ? 'var(--ink-soft)' : 'var(--faint)'}
              >
                {hasValue ? `${formatValue(item.value)}${unit}` : '—'}
              </text>
            </g>
          )
        })}

        <line
          x1={PLOT_LEFT}
          x2={PLOT_RIGHT}
          y1={TOP + plotHeight}
          y2={TOP + plotHeight}
          stroke="var(--line-strong)"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}
