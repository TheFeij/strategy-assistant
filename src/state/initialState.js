import { FORCES } from '../data/forces'
import { CHANGE_FACTORS, FINANCIAL_QUALITY_OPTIONS, FINANCIAL_PERIOD_OPTIONS, GEO_OPTIONS, HORIZON_OPTIONS } from '../data/constants'

// Single source of truth for every input in the dashboard.
// Keeping it flat and serialisable makes localStorage/API persistence easy later.
export function createInitialState() {
  return {
    industry: {
      name: '',
      firm: '',
      scope: '',
      geo: GEO_OPTIONS[0],
      horizon: HORIZON_OPTIONS[0],
      sources: '',
    },
    // One score array per force; null means "نامشخص" (no evidence).
    forceScores: Object.fromEntries(FORCES.map((force) => [force.key, force.factors.map(() => null)])),
    forceEvidence: Object.fromEntries(FORCES.map((force) => [force.key, ''])),
    weights: {
      mode: 'equal',
      values: Object.fromEntries(FORCES.map((force) => [force.key, '1'])),
      rationale: '',
    },
    financial: {
      preset: '',
      industryROIC: '',
      firmROIC: '',
      wacc: '',
      period: FINANCIAL_PERIOD_OPTIONS[0],
      quality: FINANCIAL_QUALITY_OPTIONS[0],
    },
    // 4 change factors x 5 forces; 3 = neutral / unknown.
    changeMatrix: CHANGE_FACTORS.map(() => FORCES.map(() => 3)),
    profitDriver: '',
    futureChange: '',
    resources: [],
    combination: {
      industryWeight: '32',
      firmWeight: '19',
      rationale: '',
    },
    aiPrompt: '',
  }
}
