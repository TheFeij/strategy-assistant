import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
Chart.defaults.font.family = 'Vazirmatn Variable, Vazirmatn, Tahoma, sans-serif'
Chart.defaults.font.size = 13

const LIGHT_TICK = '#718096'
const DARK_TICK = '#9FB0C4'
const LIGHT_GRID = 'rgba(223, 230, 239, 0.9)'
const DARK_GRID = 'rgba(139, 163, 187, 0.15)'

export function applyChartTheme(isDark) {
  const tickColor = isDark ? DARK_TICK : LIGHT_TICK
  const gridColor = isDark ? DARK_GRID : LIGHT_GRID

  Chart.defaults.color = tickColor
  Chart.defaults.borderColor = gridColor

  Object.values(Chart.instances || {}).forEach((chart) => {
    if (!chart?.options) return

    if (chart.options.scales) {
      Object.values(chart.options.scales).forEach((scale) => {
        if (!scale) return
        scale.ticks = { ...(scale.ticks || {}), color: tickColor }
        scale.grid = { ...(scale.grid || {}), color: gridColor }
        if (scale.title) scale.title = { ...scale.title, color: tickColor }
        if (scale.pointLabels) scale.pointLabels = { ...scale.pointLabels, color: tickColor }
      })
    }

    if (chart.options.plugins?.legend?.labels) {
      chart.options.plugins.legend.labels.color = tickColor
    }

    chart.update('none')
  })
}

Chart.defaults.color = LIGHT_TICK
Chart.defaults.borderColor = LIGHT_GRID

export { Chart }
