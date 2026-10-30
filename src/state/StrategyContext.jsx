import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { createInitialState } from './initialState'
import { computeCombo, computeFirm, computeIndustry } from '../utils/calculations'

const StrategyContext = createContext(null)

const createId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `resource-${Date.now()}-${Math.random().toString(16).slice(2)}`

export function StrategyProvider({ children }) {
  const [state, setState] = useState(createInitialState)

  const setIndustryField = useCallback((field, value) => {
    setState((prev) => ({ ...prev, industry: { ...prev.industry, [field]: value } }))
  }, [])

  const setForceScore = useCallback((forceKey, index, value) => {
    setState((prev) => ({
      ...prev,
      forceScores: {
        ...prev.forceScores,
        [forceKey]: prev.forceScores[forceKey].map((score, i) => (i === index ? value : score)),
      },
    }))
  }, [])

  const setForceEvidence = useCallback((forceKey, value) => {
    setState((prev) => ({
      ...prev,
      forceEvidence: { ...prev.forceEvidence, [forceKey]: value },
    }))
  }, [])

  const setWeightMode = useCallback((mode) => {
    setState((prev) => ({ ...prev, weights: { ...prev.weights, mode } }))
  }, [])

  const setWeightValue = useCallback((forceKey, value) => {
    setState((prev) => ({
      ...prev,
      weights: { ...prev.weights, values: { ...prev.weights.values, [forceKey]: value } },
    }))
  }, [])

  const setWeightRationale = useCallback((rationale) => {
    setState((prev) => ({ ...prev, weights: { ...prev.weights, rationale } }))
  }, [])

  const setFinancialField = useCallback((field, value) => {
    setState((prev) => ({ ...prev, financial: { ...prev.financial, [field]: value } }))
  }, [])

  // Choosing an industry preset fills the editable ROIC field.
  const setRoiPreset = useCallback((value) => {
    setState((prev) => ({
      ...prev,
      financial: {
        ...prev.financial,
        preset: value,
        industryROIC: value === '' ? prev.financial.industryROIC : value,
      },
    }))
  }, [])

  const setMatrixCell = useCallback((factorIndex, forceIndex, value) => {
    setState((prev) => ({
      ...prev,
      changeMatrix: prev.changeMatrix.map((row, i) =>
        i === factorIndex ? row.map((cell, j) => (j === forceIndex ? value : cell)) : row,
      ),
    }))
  }, [])

  const setChangeField = useCallback((field, value) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }, [])

  const addResource = useCallback((resource) => {
    setState((prev) => ({ ...prev, resources: [...prev.resources, { ...resource, id: createId() }] }))
  }, [])

  const removeResource = useCallback((id) => {
    setState((prev) => ({ ...prev, resources: prev.resources.filter((resource) => resource.id !== id) }))
  }, [])

  const setCombinationField = useCallback((field, value) => {
    setState((prev) => ({ ...prev, combination: { ...prev.combination, [field]: value } }))
  }, [])

  const setAiPrompt = useCallback((value) => {
    setState((prev) => ({ ...prev, aiPrompt: value }))
  }, [])

  const resetState = useCallback(() => setState(createInitialState()), [])

  const industry = useMemo(() => computeIndustry(state), [state])
  const firm = useMemo(() => computeFirm(state.resources), [state.resources])
  const combo = useMemo(
    () => computeCombo(industry.score, firm.score, state.combination),
    [industry.score, firm.score, state.combination],
  )

  const actions = useMemo(
    () => ({
      setIndustryField,
      setForceScore,
      setForceEvidence,
      setWeightMode,
      setWeightValue,
      setWeightRationale,
      setFinancialField,
      setRoiPreset,
      setMatrixCell,
      setChangeField,
      addResource,
      removeResource,
      setCombinationField,
      setAiPrompt,
      resetState,
    }),
    [
      setIndustryField,
      setForceScore,
      setForceEvidence,
      setWeightMode,
      setWeightValue,
      setWeightRationale,
      setFinancialField,
      setRoiPreset,
      setMatrixCell,
      setChangeField,
      addResource,
      removeResource,
      setCombinationField,
      setAiPrompt,
      resetState,
    ],
  )

  const value = useMemo(
    () => ({ state, industry, firm, combo, actions }),
    [state, industry, firm, combo, actions],
  )

  return <StrategyContext.Provider value={value}>{children}</StrategyContext.Provider>
}

export function useStrategy() {
  const context = useContext(StrategyContext)
  if (!context) throw new Error('useStrategy must be used inside <StrategyProvider>')
  return context
}
