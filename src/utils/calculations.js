import { porterForcesPages, envFactorsMulti, forceNames } from '../data/porter'
import { barneyData, barneyKeys } from '../data/barney'
import { mcgahanSectors } from '../data/mcgahan'

export const clip = (v, min, max) => Math.max(min, Math.min(max, v))

const avg = (arr) => (arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : null)

export function computeAll(state) {
  // ---------------------------------------------------------------
  // ۱. امتیاز ۵ نیروی رقابتی
  // ---------------------------------------------------------------
  const forceScores = []
  let totalForceQs = 0
  let answeredForceQs = 0

  for (let p = 1; p <= 5; p++) {
    const qs = porterForcesPages[p].questions
    totalForceQs += qs.length
    const ans = qs.filter((q) => state.forceAnswers[q.id] != null)
    answeredForceQs += ans.length

    let score = null
    if (ans.length > 0) {
      if (p === 3) {
        const lev = ans.filter((q) => q.group === 'leverage')
        const sen = ans.filter((q) => q.group === 'sensitivity')
        const L = lev.length ? avg(lev.map((q) => state.forceAnswers[q.id])) : 3.0
        const S = sen.length ? avg(sen.map((q) => state.forceAnswers[q.id])) : 3.0
        score = 0.4 * L + 0.4 * S + 0.2 * ((L * S) / 5.0)
      } else if (p === 5) {
        const intQs = ans.filter((q) => q.group === 'intensity')
        const prQs = ans.filter((q) => q.group === 'price_basis')
        const nonPrQs = ans.filter((q) => q.group === 'non_price')
        const I = intQs.length ? avg(intQs.map((q) => state.forceAnswers[q.id])) : 3.0
        const P = prQs.length ? avg(prQs.map((q) => state.forceAnswers[q.id])) : 3.0
        const relief = nonPrQs.length ? (state.forceAnswers[nonPrQs[0].id] - 3.0) * 0.15 : 0
        const base = clip(0.65 * I + 0.35 * P - relief, 1, 5)
        const alpha = state.rivalrySumType === 'zero_sum' ? 1.25 : state.rivalrySumType === 'positive_sum' ? 0.8 : 1.0
        score = clip(base * alpha, 1.0, 5.0)
      } else {
        score = avg(ans.map((q) => state.forceAnswers[q.id]))
      }
    }
    forceScores.push(score)
  }

  const validForces = forceScores.filter((x) => x !== null)
  const F_cur_arr = forceScores.map((x) => (x !== null ? x : 3.0))

  // ---------------------------------------------------------------
  // ۲. اثر ۴ فاکتور محیطی بر فشار آینده
  // ---------------------------------------------------------------
  const envMultipliers = envFactorsMulti.map((ef) => {
    const ans = ef.questions.filter((q) => state.envAnswers[q.id] != null)
    if (!ans.length) return 0
    const avgVal = avg(ans.map((q) => state.envAnswers[q.id]))
    return (avgVal - 3.0) / 2.0
  })

  const F_fut_arr = F_cur_arr.map((fc, fIdx) => {
    let delta = 0
    envFactorsMulti.forEach((ef, eIdx) => {
      delta += ef.weights[fIdx] * envMultipliers[eIdx]
    })
    return clip(fc + delta, 1.0, 5.0)
  })

  const envEffects = forceNames.map((_, fIdx) =>
    envFactorsMulti.map((ef, eIdx) => {
      const eff = ef.weights[fIdx] * envMultipliers[eIdx]
      return eff
    }),
  )

  // ---------------------------------------------------------------
  // ۳. امتیاز جذابیت صنعت (جریمه تنگناترین نیرو)
  // ---------------------------------------------------------------
  let IS_current = null
  let IS_future = null
  let bindingForceName = 'در انتظار تکمیل فرم'
  let bindingForceScore = null

  if (validForces.length > 0) {
    const avgF = avg(validForces)
    const maxF = Math.max(...validForces)
    const maxIdx = forceScores.indexOf(maxF)
    bindingForceName = forceNames[maxIdx] || 'مشخص‌شده'
    bindingForceScore = maxF

    const peffCur = 0.65 * avgF + 0.35 * maxF
    IS_current = Math.round(((5.0 - peffCur) / 4.0) * 100)

    const avgFut = avg(F_fut_arr)
    const maxFut = Math.max(...F_fut_arr)
    const peffFut = 0.65 * avgFut + 0.35 * maxFut
    IS_future = Math.round(((5.0 - peffFut) / 4.0) * 100)
  }

  const porterStrategyTitle =
    IS_current === null
      ? 'در انتظار تکمیل سوالات ۵ نیرو'
      : IS_current >= 55
        ? 'استراتژی جایگاه‌یابی مستحکم و دفاع از موانع ورود'
        : `استراتژی اثرگذاری بر ساختار صنعت با مهار «${bindingForceName}»`

  const porterStrategyBody =
    IS_current === null
      ? 'پس از تکمیل سوالات، استراتژی مناسب از میان ۱) جایگاه‌یابی تدافعی/تهاجمی، ۲) بهره‌برداری از تغییرات صنعت و ۳) اثرگذاری بر ساختار صنعت تجویز می‌شود.'
      : `با توجه به امتیاز فعلی صنعت (${IS_current} از ۱۰۰) و امتیاز آینده (${IS_future} از ۱۰۰)، اولویت استراتژیک بنگاه باید خنثی کردن فشار «${bindingForceName}» و هدایت رقابت به سمت ابعاد غیرقیمتی (مجموع مثبت) باشد.`

  // ---------------------------------------------------------------
  // ۴. امتیاز منابع بنگاه (بارنی ۱۹۹۱)
  // ---------------------------------------------------------------
  const resScores = {}
  let anyBarneyAnswered = false

  barneyKeys.forEach((k) => {
    const b = state.barney[k]
    if (b.V_q1 != null || b.V_q2 != null || b.R_q1 != null || b.I_hist_q != null || b.N_q1 != null) {
      anyBarneyAnswered = true
    }

    const V = ((b.V_q1 ?? 3) + (b.V_q2 ?? 3)) / 2.0
    const R = b.R_q1 ?? 3.0
    const I_hist = b.I_hist_q ?? 3.0
    const I_soc = b.I_soc_q ?? 3.0
    const I_ambig = 6.0 - ((b.I_codified_q ?? 3.0) + (b.I_poach_q ?? 3.0)) / 2.0
    const I = Math.max(I_hist, I_soc, I_ambig)
    const N = b.N_q1 ?? 3.0

    const vn = (V - 1) / 4
    const rn = (R - 1) / 4
    const inorm = (I - 1) / 4
    const nn = (N - 1) / 4
    const S_k = Math.round(vn * (0.25 + 0.25 * rn + 0.25 * rn * inorm + 0.25 * rn * inorm * nn) * 100)

    resScores[k] = { V, R, I, N, I_ambig, S_k }
  })

  let FS = null
  if (anyBarneyAnswered) {
    const arr = barneyKeys.map((k) => resScores[k].S_k)
    FS = Math.round(0.5 * Math.max(...arr) + 0.5 * avg(arr))
  }

  // ---------------------------------------------------------------
  // ۵. ترکیب مک‌گاهان و پورتر
  // ---------------------------------------------------------------
  const secObj = mcgahanSectors.find((s) => s.id === state.selectedMcgahanSector) || mcgahanSectors[0]
  const wI = secObj.indEffect
  const wF = secObj.firmEffect
  const wC = state.includeCorpParent ? secObj.corpEffect : 0
  const sumW = wI + wF + wC
  const nWI = sumW > 0 ? wI / sumW : 0
  const nWF = sumW > 0 ? wF / sumW : 0
  const nWC = sumW > 0 ? wC / sumW : 0

  let combinedScore = null
  if (IS_current !== null || FS !== null) {
    const effIS = IS_current !== null ? 0.6 * IS_current + 0.4 * (IS_future ?? 50) : 50
    const effFS = FS !== null ? FS : 50
    combinedScore = Math.round(nWI * effIS + nWF * effFS + nWC * state.corpScore)
  }

  // ---------------------------------------------------------------
  // ۶. وضعیت فرم، ROIC بنگاه و منابع تیک‌خورده
  // ---------------------------------------------------------------
  const isBlank = answeredForceQs === 0 && !anyBarneyAnswered

  const nopat = parseFloat(state.firmNopat)
  const cap = parseFloat(state.firmCapital)
  const firmRoic = !isNaN(nopat) && !isNaN(cap) && cap > 0 ? (nopat / cap) * 100 : null
  const indRoic = parseFloat(state.indRoic) || 39.0

  const checkedBarneyItems = []
  barneyKeys.forEach((k) => {
    barneyData[k].checklist.forEach((item) => {
      const entry = state.barneyChecklist[`${k}.${item.id}`]
      if (entry?.checked) {
        checkedBarneyItems.push(item.label + (entry.detail ? ` (${entry.detail})` : ''))
      }
    })
  })

  return {
    forceScores,
    totalForceQs,
    answeredForceQs,
    F_cur_arr,
    F_fut_arr,
    envMultipliers,
    envEffects,
    IS_current,
    IS_future,
    bindingForceName,
    bindingForceScore,
    porterStrategyTitle,
    porterStrategyBody,
    resScores,
    anyBarneyAnswered,
    FS,
    secObj,
    nWI,
    nWF,
    nWC,
    combinedScore,
    isBlank,
    firmRoic,
    indRoicEffective: indRoic,
    checkedBarneyItems,
    bestBadge: FS !== null ? (FS >= 65 ? 'مزیت رقابتی پایدار' : 'مزیت موقت / برابری') : 'در انتظار تکمیل فرم',
  }
}
