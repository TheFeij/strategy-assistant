import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { porterForcesPages, envFactorsMulti } from '../data/porter'
import { barneyData, barneyKeys, barneyAiInimitability } from '../data/barney'
import { iranIndustriesRoic } from '../data/iranIndustries'
import { computeAll } from '../utils/calculations'

const emptyBarneyAnswers = () => ({
  phys: { V_q1: null, V_q2: null, R_q1: null, I_hist_q: null, I_soc_q: null, I_codified_q: null, I_poach_q: null, N_q1: null },
  hum: { V_q1: null, V_q2: null, R_q1: null, I_hist_q: null, I_soc_q: null, I_codified_q: null, I_poach_q: null, N_q1: null },
  org: { V_q1: null, V_q2: null, R_q1: null, I_hist_q: null, I_soc_q: null, I_codified_q: null, I_poach_q: null, N_q1: null },
})

const emptyBarneyChecklist = () => {
  const map = {}
  barneyKeys.forEach((k) => {
    barneyData[k].checklist.forEach((item) => {
      map[`${k}.${item.id}`] = { checked: false, detail: '' }
    })
  })
  return map
}

const blankData = () => ({
  selectedIranIndustryId: '',
  indRoic: null,
  scopeProduct: '',
  scopeGeo: '',
  firmNopat: '',
  firmCapital: '',
  selectedMcgahanSector: 'all_avg',
  includeCorpParent: true,
  corpScore: 60,
  forceAnswers: {},
  incumbentChecks: {},
  envAnswers: {},
  barney: emptyBarneyAnswers(),
  barneyChecklist: emptyBarneyChecklist(),
})

const initialState = {
  view: 'home',
  mod1Tab: 1,
  mod2Tab: 'CHK',
  mod3Tab: 1,
  forcePage: 1,
  rivalrySumType: 'balanced',
  ...blankData(),
}

const StrategyContext = createContext(null)

export function StrategyProvider({ children }) {
  const [state, setState] = useState(initialState)

  const set = useCallback((patch) => {
    setState((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }))
  }, [])

  const navigate = useCallback((view) => {
    setState((prev) => ({ ...prev, view }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const setMod1Tab = useCallback((tab) => setState((prev) => ({ ...prev, mod1Tab: tab })), [])
  const setMod2Tab = useCallback((tab) => setState((prev) => ({ ...prev, mod2Tab: tab })), [])
  const setMod3Tab = useCallback((tab) => setState((prev) => ({ ...prev, mod3Tab: tab })), [])
  const setForcePage = useCallback((page) => setState((prev) => ({ ...prev, forcePage: page })), [])
  const setRivalrySumType = useCallback((value) => setState((prev) => ({ ...prev, rivalrySumType: value })), [])

  const selectIranIndustry = useCallback((id) => {
    setState((prev) => {
      if (!id) {
        return { ...prev, selectedIranIndustryId: '' }
      }
      const found = iranIndustriesRoic.find((x) => x.id === id)
      if (!found) return { ...prev, selectedIranIndustryId: id }
      return {
        ...prev,
        selectedIranIndustryId: id,
        indRoic: found.roic,
        scopeProduct: prev.scopeProduct || found.name.replace(' *', ''),
        selectedMcgahanSector: found.mcgahan,
      }
    })
  }, [])

  const toggleIncumbent = useCallback((itemId, checked) => {
    setState((prev) => {
      const incumbentChecks = { ...prev.incumbentChecks, [itemId]: checked }
      const count = Object.values(incumbentChecks).filter(Boolean).length
      const suggested = Math.max(1.0, 5.0 - count * 0.8)
      return {
        ...prev,
        incumbentChecks,
        forceAnswers: { ...prev.forceAnswers, f1_q5: suggested },
      }
    })
  }, [])

  const setForceAnswer = useCallback((qid, value) => {
    setState((prev) => ({ ...prev, forceAnswers: { ...prev.forceAnswers, [qid]: value } }))
  }, [])

  const setEnvAnswer = useCallback((qid, value) => {
    setState((prev) => ({ ...prev, envAnswers: { ...prev.envAnswers, [qid]: value } }))
  }, [])

  const applyAiEnvFactor = useCallback((factorId) => {
    setState((prev) => {
      const factor = envFactorsMulti.find((f) => f.id === factorId)
      if (!factor) return prev
      const envAnswers = { ...prev.envAnswers }
      factor.questions.forEach((q) => {
        envAnswers[q.id] = q.aiRec
      })
      return { ...prev, envAnswers }
    })
  }, [])

  const setBarneyAnswer = useCallback((cat, field, value) => {
    setState((prev) => ({
      ...prev,
      barney: { ...prev.barney, [cat]: { ...prev.barney[cat], [field]: value } },
    }))
  }, [])

  const applyAiInimitability = useCallback((cat) => {
    setState((prev) => ({
      ...prev,
      barney: { ...prev.barney, [cat]: { ...prev.barney[cat], ...barneyAiInimitability[cat] } },
    }))
  }, [])

  const toggleBarneyCheck = useCallback((cat, itemId, checked) => {
    const key = `${cat}.${itemId}`
    setState((prev) => {
      const current = prev.barneyChecklist[key] || { checked: false, detail: '' }
      return {
        ...prev,
        barneyChecklist: { ...prev.barneyChecklist, [key]: { ...current, checked } },
      }
    })
  }, [])

  const setBarneyDetail = useCallback((cat, itemId, detail) => {
    const key = `${cat}.${itemId}`
    setState((prev) => {
      const current = prev.barneyChecklist[key] || { checked: false, detail: '' }
      return {
        ...prev,
        barneyChecklist: { ...prev.barneyChecklist, [key]: { ...current, detail } },
      }
    })
  }, [])

  const resetToBlank = useCallback(() => {
    setState((prev) => ({
      ...prev,
      ...blankData(),
    }))
  }, [])

  const fillSample = useCallback(() => {
    const sampleForces = {
      1: [2.5, 2.5, 2.0, 2.5, 2.5, 3.0, 2.5, 3.0],
      2: [4.0, 3.5, 4.0, 3.5, 4.0, 3.0],
      3: [4.0, 3.0, 3.0, 2.5, 3.5, 4.0, 2.5, 2.5],
      4: [2.5, 2.0, 3.0, 2.0],
      5: [3.5, 3.0, 3.5, 3.5, 3.0, 3.0, 3.5, 3.0, 2.0, 4.0],
    }
    const forceAnswers = {}
    for (let p = 1; p <= 5; p++) {
      porterForcesPages[p].questions.forEach((q, idx) => {
        forceAnswers[q.id] = sampleForces[p][idx]
      })
    }

    const envAnswers = {}
    envFactorsMulti.forEach((ef) => ef.questions.forEach((q) => (envAnswers[q.id] = q.aiRec)))

    const barneyChecklist = emptyBarneyChecklist()
    barneyChecklist['phys.chk_p2'] = { checked: true, detail: 'خط ماشین‌کاری ۵ محور CNC و قالب‌سازی دقیق' }
    barneyChecklist['hum.chk_h1'] = { checked: true, detail: 'تیم مهندسی متالورژی و طراحی معکوس با ۱۵ سال سابقه' }
    barneyChecklist['org.chk_o4'] = { checked: true, detail: 'فرهنگ حل مسئله تیمی و هماهنگی مستقیم R&D با خط تولید' }

    setState((prev) => ({
      ...prev,
      selectedIranIndustryId: 'auto',
      indRoic: 34.0,
      scopeProduct: 'تولید قطعات و مجموعه‌های صنعتی خودرو و ماشین‌آلات',
      scopeGeo: 'سراسر ایران و صادرات به کشورهای همسایه',
      firmNopat: '420',
      firmCapital: '1050',
      selectedMcgahanSector: 'manufacturing',
      forceAnswers,
      incumbentChecks: { inc_tech: true, inc_exp: true },
      envAnswers,
      barneyChecklist,
      barney: {
        phys: {
          V_q1: 4.0, V_q2: 3.5, R_q1: 2.5,
          I_hist_q: 2.5, I_soc_q: 2.0, I_codified_q: 4.0, I_poach_q: 4.0, N_q1: 2.5,
        },
        hum: {
          V_q1: 4.5, V_q2: 4.5, R_q1: 4.0,
          I_hist_q: 4.0, I_soc_q: 4.5, I_codified_q: 2.0, I_poach_q: 2.0, N_q1: 4.0,
        },
        org: {
          V_q1: 4.5, V_q2: 4.0, R_q1: 4.5,
          I_hist_q: 4.0, I_soc_q: 4.5, I_codified_q: 1.5, I_poach_q: 1.5, N_q1: 4.5,
        },
      },
    }))
  }, [])

  const derived = useMemo(() => computeAll(state), [state])

  const value = {
    ...state,
    ...derived,
    set,
    navigate,
    setMod1Tab,
    setMod2Tab,
    setMod3Tab,
    setForcePage,
    setRivalrySumType,
    selectIranIndustry,
    toggleIncumbent,
    setForceAnswer,
    setEnvAnswer,
    applyAiEnvFactor,
    setBarneyAnswer,
    applyAiInimitability,
    toggleBarneyCheck,
    setBarneyDetail,
    resetToBlank,
    fillSample,
  }

  return <StrategyContext.Provider value={value}>{children}</StrategyContext.Provider>
}

export function useStrategy() {
  const ctx = useContext(StrategyContext)
  if (!ctx) throw new Error('useStrategy must be used inside StrategyProvider')
  return ctx
}
