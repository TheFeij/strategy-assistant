import { iranIndustriesRoic } from '../data/iranIndustries'
import { envFactorsMulti, forceNames, forceShortNames, porterForcesPages } from '../data/porter'
import { barneyData, barneyKeys } from '../data/barney'
import { pfiAllQuestions, pfiCompChecklist } from '../data/pfi'

const isFilled = (value) => value !== null && value !== undefined && value !== ''

const toNumber = (value) => {
  if (!isFilled(value)) return null
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const shortText = (text = '', max = 90) => {
  const normalized = String(text)
    .replace(/^[\u06F0-\u06F9\d]+[.)-]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
  return normalized.length > max ? `${normalized.slice(0, max)}…` : normalized
}

const BARNEY_FIELD_LABELS = {
  V_q1: 'ارزشمند بودن ۱ (کاهش هزینه / افزایش درآمد)',
  V_q2: 'ارزشمند بودن ۲ (خنثی‌سازی تهدیدها)',
  R_q1: 'کمیابی در برابر رقبا',
  I_hist_q: 'تاریخ‌مندی منبع',
  I_soc_q: 'پیچیدگی اجتماعی',
  I_codified_q: 'مستندسازی دانش',
  I_poach_q: 'وابستگی به افراد کلیدی',
  N_q1: 'جایگزین‌ناپذیری راهبردی',
}

/**
 * Build the compact, dynamic snapshot of everything the user has actually
 * filled in across the four modules. Only filled values are included so the
 * prompt stays small and the model focuses on relevant data.
 */
export function buildWorkspace(state = {}) {
  const industry = iranIndustriesRoic.find((item) => item.id === state.selectedIranIndustryId)
  const company = typeof state.companyName === 'string' ? state.companyName.trim() : ''
  const forceAnswers = state.forceAnswers || {}
  const envAnswers = state.envAnswers || {}
  const barney = state.barney || {}
  const pfiAnswers = state.pfiAnswers || {}

  const forceAnswerEntries = []
  for (let page = 1; page <= 5; page += 1) {
    const pageData = porterForcesPages[page]
    if (!pageData) continue
    pageData.questions.forEach((question) => {
      const value = forceAnswers[question.id]
      if (!isFilled(value)) return
      forceAnswerEntries.push({
        group: forceShortNames[page - 1],
        label: shortText(question.title, 80),
        value: toNumber(value) ?? value,
      })
    })
  }

  const envAnswerEntries = []
  envFactorsMulti.forEach((factor) => {
    factor.questions.forEach((question) => {
      const value = envAnswers[question.id]
      if (!isFilled(value)) return
      envAnswerEntries.push({
        group: shortText(factor.title, 40),
        label: shortText(question.text, 80),
        value: toNumber(value) ?? value,
      })
    })
  })

  const barneyAnswerEntries = []
  barneyKeys.forEach((key) => {
    const values = barney[key] || {}
    Object.entries(values).forEach(([field, value]) => {
      if (!isFilled(value)) return
      barneyAnswerEntries.push({
        group: shortText(barneyData[key]?.title, 40),
        label: BARNEY_FIELD_LABELS[field] || field,
        value: toNumber(value) ?? value,
      })
    })
  })

  const pfiAnswerEntries = pfiAllQuestions
    .filter((question) => isFilled(pfiAnswers[question.id]))
    .map((question) => ({
      label: question.title,
      value: toNumber(pfiAnswers[question.id]) ?? pfiAnswers[question.id],
    }))

  const incumbentBenefits = (porterForcesPages[1]?.incumbentChecklist || [])
    .filter((item) => state.incumbentChecks?.[item.id])
    .map((item) => item.label)

  const checkedResources = []
  barneyKeys.forEach((key) => {
    const checklist = barneyData[key]?.checklist || []
    checklist.forEach((item) => {
      const entry = state.barneyChecklist?.[`${key}.${item.id}`]
      if (!entry?.checked) return
      checkedResources.push(
        `${shortText(barneyData[key]?.title, 30)}: ${item.label}${entry.detail ? ` — ${entry.detail}` : ''}`,
      )
    })
  })

  const pfiCheckedAssets = pfiCompChecklist
    .filter((item) => state.pfiChecklist?.[item.id])
    .map((item) => item.label)

  const forceScoreList = forceNames
    .map((name, index) => {
      const current = toNumber(state.forceScores?.[index])
      if (current == null) return null
      return {
        name,
        current,
        future: toNumber(state.F_fut_arr?.[index]),
      }
    })
    .filter(Boolean)

  const envFactorList = envFactorsMulti
    .map((factor, index) => {
      const answered = factor.questions.filter((question) => isFilled(envAnswers[question.id])).length
      if (!answered) return null
      return {
        name: shortText(factor.title, 40),
        answered,
        multiplier: toNumber(state.envMultipliers?.[index]),
      }
    })
    .filter(Boolean)

  const barneyAnsweredCount = barneyAnswerEntries.length
  const hasBarney = state.anyBarneyAnswered === true || barneyAnsweredCount > 0

  const resourceScores = hasBarney
    ? barneyKeys
        .map((key) => {
          const score = state.resScores?.[key]
          if (!score) return null
          return {
            name: shortText(barneyData[key]?.title, 40),
            score: score.S_k,
            V: toNumber(score.V),
            R: toNumber(score.R),
            I: toNumber(score.I),
            N: toNumber(score.N),
          }
        })
        .filter(Boolean)
    : []

  const pfiAnsweredCount = toNumber(state.pfiAnsweredCount) ?? pfiAnswerEntries.length
  const hasPfi = pfiAnsweredCount > 0
  const pfi = hasPfi
    ? {
        answered: pfiAnsweredCount,
        firmShare: toNumber(state.pfiFirmShare),
        complementaryShare: toNumber(state.pfiCompShare),
        imitatorShare: toNumber(state.pfiImitatorShare),
        winner: state.pfiWinnerLabel,
        appropriability: state.pfiAppStatus,
        dominantDesign: state.pfiDomStatus,
        complementaryAssets: state.pfiCompStatus,
        ownership: state.pfiOwnStatus,
        strategyTitle: state.pfiStrategyTitle,
        strategyBody: state.pfiStrategyBody,
      }
    : null

  const answered = {
    force: forceAnswerEntries.length,
    env: envAnswerEntries.length,
    barney: barneyAnsweredCount,
    pfi: pfiAnsweredCount,
  }
  answered.total = answered.force + answered.env + answered.barney + answered.pfi

  const porterStrategy =
    state.IS_current != null
      ? { title: state.porterStrategyTitle, body: state.porterStrategyBody }
      : null

  const firmEbit = toNumber(state.firmNopat)
  const firmCapital = toNumber(state.firmCapital)
  const manualIndustryRoic = state.indRoic != null && !industry

  const hasUserData =
    answered.total > 0 ||
    checkedResources.length > 0 ||
    pfiCheckedAssets.length > 0 ||
    firmEbit != null ||
    firmCapital != null ||
    manualIndustryRoic

  const workspace = {
    company,
    industry: industry ? industry.name.replace(/\s*\*$/, '') : '',
    industryRoic: state.indRoic != null ? toNumber(state.indRoicEffective ?? state.indRoic) : null,
    scope: typeof state.scopeProduct === 'string' ? state.scopeProduct.trim() : '',
    geography: typeof state.scopeGeo === 'string' ? state.scopeGeo.trim() : '',
    firmRoic: toNumber(state.firmRoic),
    firmEbit,
    firmCapital,
    industryScoreCurrent: toNumber(state.IS_current),
    industryScoreFuture: toNumber(state.IS_future),
    firmScore: toNumber(state.FS),
    combinedScore: toNumber(state.combinedScore),
    bindingForce: state.IS_current != null ? state.bindingForceName : '',
    bestBadge: state.FS != null ? state.bestBadge : '',
    sector: state.IS_current != null || state.FS != null || industry ? state.secObj?.name : '',
    weights: state.combinedScore != null
      ? {
          industry: toNumber(state.nWI),
          firm: toNumber(state.nWF),
          corporateParent: toNumber(state.nWC),
        }
      : null,
    corporateScore: state.combinedScore != null ? toNumber(state.corpScore) : null,
    answered,
    hasUserData,
    hasProfile: Boolean(company || industry || state.scopeProduct || state.scopeGeo || state.indRoic != null),
    forceAnswers: forceAnswerEntries,
    forceScores: forceScoreList,
    envAnswers: envAnswerEntries,
    envFactors: envFactorList,
    barneyAnswers: barneyAnswerEntries,
    resourceScores,
    checkedResources,
    incumbentBenefits,
    pfiAnswers: pfiAnswerEntries,
    pfiAssets: pfiCheckedAssets,
    pfi,
    porterStrategy,
  }

  return workspace
}

/** Human-readable overview used by both the prompt and the in-app preview. */
export function summarizeWorkspace(workspace = {}) {
  const items = []
  const add = (label, value) => {
    if (!isFilled(value)) return
    items.push({ label, value: String(value) })
  }
  const numberLabel = (value) => (Number.isInteger(value) ? value : Number(value).toFixed(1))

  add('شرکت / بنگاه', workspace.company)
  add('صنعت', workspace.industry)
  add('محصول / خدمت', workspace.scope)
  add('گستره جغرافیایی', workspace.geography)
  if (isFilled(workspace.industryRoic)) add('ROIC صنعت', `${numberLabel(workspace.industryRoic)}٪`)
  if (isFilled(workspace.firmRoic)) add('ROIC بنگاه', `${numberLabel(workspace.firmRoic)}٪`)

  const scores = []
  if (isFilled(workspace.industryScoreCurrent)) scores.push(`صنعت فعلی ${workspace.industryScoreCurrent}`)
  if (isFilled(workspace.industryScoreFuture)) scores.push(`صنعت آینده ${workspace.industryScoreFuture}`)
  if (isFilled(workspace.firmScore)) scores.push(`منابع بنگاه ${workspace.firmScore}`)
  if (isFilled(workspace.combinedScore)) scores.push(`ترکیبی ${workspace.combinedScore}`)
  if (scores.length) add('امتیازها (از ۱۰۰)', scores.join(' · '))

  add('تنگنای اصلی سود', workspace.bindingForce)
  if (workspace.pfi && isFilled(workspace.pfi.firmShare)) {
    const winner = isFilled(workspace.pfi.winner) ? ` — ${workspace.pfi.winner}` : ''
    add('سهم سود نوآوری', `${workspace.pfi.firmShare}٪${winner}`)
  }
  if (workspace.answered?.total > 0) {
    add(
      'پاسخ‌های ثبت‌شده',
      `نیروها ${workspace.answered.force} · محیطی ${workspace.answered.env} · بارنی ${workspace.answered.barney} · PFI ${workspace.answered.pfi}`,
    )
  }
  if (workspace.porterStrategy?.title) add('استراتژی صنعت', workspace.porterStrategy.title)
  if (workspace.pfi?.strategyTitle) add('استراتژی PFI', workspace.pfi.strategyTitle)

  return items
}
