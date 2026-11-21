import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
Chart.defaults.font.family = 'Vazirmatn Variable, Vazirmatn, Tahoma, sans-serif'
Chart.defaults.font.size = 13

// Chart colors are tuned for legibility: labels use a darker/lighter ink than
// the rest of the UI so they survive being projected onto a washed-out screen.
const LIGHT_TICK = '#44566D'
const DARK_TICK = '#C3D1DF'
const LIGHT_TICK_CONTRAST = '#16263A'
const DARK_TICK_CONTRAST = '#F2F6FA'
const LIGHT_GRID = 'rgba(203, 214, 226, 0.9)'
const DARK_GRID = 'rgba(139, 163, 187, 0.22)'
const LIGHT_GRID_CONTRAST = 'rgba(148, 166, 186, 0.9)'
const DARK_GRID_CONTRAST = 'rgba(159, 176, 196, 0.4)'

export function applyChartTheme(isDark, highContrast = false) {
  const tickColor = highContrast
    ? isDark
      ? DARK_TICK_CONTRAST
      : LIGHT_TICK_CONTRAST
    : isDark
      ? DARK_TICK
      : LIGHT_TICK
  const gridColor = highContrast
    ? isDark
      ? DARK_GRID_CONTRAST
      : LIGHT_GRID_CONTRAST
    : isDark
      ? DARK_GRID
      : LIGHT_GRID

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
