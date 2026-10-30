import { CHANGE_FACTORS, ROIC_PRESETS } from '../data/constants'

/** Serialises the dashboard into the same JSON shape as the legacy HTML export. */
export function buildExportData(state, industry) {
  const preset = ROIC_PRESETS.find((option) => option.value === state.financial.preset)

  return {
    industry: {
      name: state.industry.name,
      firm: state.industry.firm,
      scope: state.industry.scope,
      geo: state.industry.geo,
      horizon: state.industry.horizon,
      sources: state.industry.sources,
      forceScores: {
        forceAverages: industry.forceAverages,
        pressure: industry.pressure,
        score: industry.score,
      },
      evidence: { ...state.forceEvidence },
      financial: {
        industryROIC: state.financial.industryROIC,
        firmROIC: state.financial.firmROIC,
        WACC: state.financial.wacc,
        roicPreset: preset ? preset.label : '',
        period: state.financial.period,
        quality: state.financial.quality,
      },
      changeMatrix: CHANGE_FACTORS.map((factor, index) => ({
        factor,
        impacts: state.changeMatrix[index],
      })),
      profitDriver: state.profitDriver,
      futureChange: state.futureChange,
    },
    resources: state.resources.map(({ id, ...resource }) => resource),
    combination: {
      industryWeight: state.combination.industryWeight,
      firmWeight: state.combination.firmWeight,
      rationale: state.combination.rationale,
    },
  }
}

export function downloadJson(data, filename = 'strategy-dashboard-data.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export function exportDashboard(state, industry) {
  downloadJson(buildExportData(state, industry))
}
