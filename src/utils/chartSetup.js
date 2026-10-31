import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
Chart.defaults.font.family = 'Vazirmatn Variable, Vazirmatn, Tahoma, sans-serif'
Chart.defaults.color = '#475569'

export { Chart }
