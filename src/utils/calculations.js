import { porterForcesPages, envFactorsMulti, forceNames } from '../data/porter'
import { barneyData, barneyKeys } from '../data/barney'
import { mcgahanSectors } from '../data/mcgahan'
import { pfiAllQuestions, pfiCompChecklist } from '../data/pfi'

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
  // ۶. کسب سود از نوآوری (PFI دیوید تیس)
  // ---------------------------------------------------------------
  const pfiValue = (id) => state.pfiAnswers[id] ?? null

  const distVal = state.forceAnswers.f1_q6 ?? null
  const distMonopolized = distVal != null && distVal <= 2

  let barneyFilled = false
  let maxAmbigScore = 0
  let maxSocScore = 0
  barneyKeys.forEach((k) => {
    const b = state.barney[k]
    if (b.I_codified_q != null || b.I_poach_q != null) {
      barneyFilled = true
      const ambig = 6.0 - ((b.I_codified_q ?? 3.0) + (b.I_poach_q ?? 3.0)) / 2.0
      if (ambig > maxAmbigScore) maxAmbigScore = ambig
    }
    if (b.I_soc_q != null) {
      barneyFilled = true
      if (b.I_soc_q > maxSocScore) maxSocScore = b.I_soc_q
    }
  })
  const barneyTacitSupportScore = barneyFilled ? Math.max(maxAmbigScore, maxSocScore) : null
  const barneyAmbigPct = maxAmbigScore > 0 ? Math.round(((maxAmbigScore - 1) / 4) * 100) : null

  const pfiAnsweredCount = pfiAllQuestions.filter((q) => pfiValue(q.id) != null).length

  let pfiFirmShare = null
  let pfiCompShare = null
  let pfiImitatorShare = null
  let pfiWinnerLabel = 'در انتظار پاسخ'
  let pfiAppStatus = null
  let pfiDomStatus = null
  let pfiCompStatus = null
  let pfiOwnStatus = null
  let pfiStrategyTitle = 'در انتظار تکمیل سوالات PFI'
  let pfiStrategyBody =
    'پس از پاسخ به ۸ سوال، استراتژی دقیق کسب سود (تملک دارایی مکمل، اتحاد هوشمند، مقیاس سریع یا انعطاف معماری) تجویز می‌شود.'
  const pfiActionBullets = []

  if (pfiAnsweredCount > 0) {
    const avgAnswered = (ids) => {
      const values = ids.map((id) => pfiValue(id)).filter((v) => v != null)
      return values.length ? avg(values) : 3.0
    }

    const appRawBase = avgAnswered(['q1', 'q2', 'q3'])
    const appRaw =
      barneyTacitSupportScore != null ? 0.85 * appRawBase + 0.15 * barneyTacitSupportScore : appRawBase
    const appScore = clip((appRaw - 1) / 4, 0, 1)

    const domRaw = avgAnswered(['q4', 'q5'])
    const domScore = clip((domRaw - 1) / 4, 0, 1)

    const checkedLinks = pfiCompChecklist.filter((item) => state.pfiChecklist[item.id])
    const needFromChecklist = checkedLinks.length ? clip(checkedLinks.length / 4, 0.25, 1.0) : 0.5
    const q6Value = pfiValue('q6') ?? 3
    const q7Value = pfiValue('q7')
    const q8Value = pfiValue('q8')
    const q6Spec = (q6Value - 1) / 4
    const q7Own = ((q7Value ?? 3) - 1) / 4
    const fullyOwned = q7Value != null && q7Value >= 4.5
    const q8Risk = fullyOwned ? 0 : ((q8Value ?? 3) - 1) / 4

    let compDependency = clip(0.35 * needFromChecklist + 0.65 * q6Spec, 0, 1)
    if (distMonopolized && state.pfiChecklist.dist) {
      compDependency = clip(compDependency + 0.12, 0, 1)
    }
    const ownerControlFactor = fullyOwned ? 1.0 : clip(0.6 * q7Own + 0.4 * (1 - q8Risk), 0, 1)

    const rawFirmShare = clip(
      0.18 +
        0.34 * appScore +
        0.42 * ownerControlFactor +
        0.12 * (1 - compDependency) -
        0.1 * (1 - appScore) * domScore * (1 - ownerControlFactor),
      0.1,
      0.9,
    )
    const remaining = 1 - rawFirmShare
    const compWeight = clip(0.25 + 0.55 * compDependency + 0.2 * q8Risk - 0.35 * q7Own, 0.1, 0.85)
    const rawCompShare = remaining * compWeight

    pfiFirmShare = Math.round(rawFirmShare * 100)
    pfiCompShare = Math.round(rawCompShare * 100)
    pfiImitatorShare = Math.max(0, 100 - pfiFirmShare - pfiCompShare)

    if (pfiFirmShare >= pfiCompShare && pfiFirmShare >= pfiImitatorShare) {
      pfiWinnerLabel = 'بنگاه نوآور (خود شما)'
    } else if (pfiCompShare >= pfiFirmShare && pfiCompShare >= pfiImitatorShare) {
      pfiWinnerLabel = 'دارندگان دارایی مکمل'
    } else {
      pfiWinnerLabel = 'تقلیدکنندگان سریع و رقبا'
    }

    pfiAppStatus =
      appScore >= 0.62
        ? 'قوی / دشوار برای کپی'
        : appScore >= 0.38
          ? 'متوسط / نیازمند تقویت راز تجاری'
          : 'ضعیف / آسان برای کپی'
    pfiDomStatus =
      domScore >= 0.55 ? 'پس از تثبیت طراحی غالب' : 'پیش از طراحی غالب (دوران تنوع طرح)'
    pfiCompStatus =
      q6Spec >= 0.6 ? 'تخصصی / هم‌تخصص' : q6Spec >= 0.35 ? 'نیمه‌تخصصی' : 'عمومی'
    pfiOwnStatus = fullyOwned
      ? 'مالکیت کامل داخلی'
      : q7Own >= 0.6
        ? 'عمدتاً در اختیار بنگاه'
        : 'وابسته به شرکا و بیرون'

    if (appScore >= 0.62 && q6Spec < 0.45) {
      pfiStrategyTitle = 'بهره‌برداری مستقیم یا اعطای لیسانس'
      pfiStrategyBody =
        'نظام صیانت قوی است و دارایی‌های مکمل عمومی‌اند؛ نیازی به سرمایه‌گذاری سنگین روی کارخانه یا پخش اختصاصی نیست. با پیمانکاران بازار کار کنید یا با خیال راحت لیسانس بفروشید و سهم اصلی سود را نگه دارید.'
      pfiActionBullets.push(
        'استفاده از پیمانکاران عمومی بازار برای کاهش هزینه ثابت',
        'امکان اعطای لیسانس فناوری بدون ترس از از دست رفتن حاشیه سود',
        'حفظ و تمدید سپرهای حقوقی و اسرار فرآیندی',
      )
    } else if (appScore < 0.55 && q6Spec >= 0.55 && q7Own < 0.55) {
      pfiStrategyTitle = 'هشدار تله EMI: تملک دارایی مکمل یا اتحاد سهامی پیش از افشای کامل'
      pfiStrategyBody =
        'کپی نوآوری شما سخت نیست و هم‌زمان حلقه‌های تخصصی فروش و تولید دست شرکت‌های بیرونی است. با قرارداد عادی، صاحبان دارایی مکمل یا تقلیدکنندگان بزرگ کل سود را می‌برند. سریعاً دارایی مکمل گلوگاهی را تملک کنید یا وارد مشارکت سهامی و انحصاری بلندمدت شوید.'
      pfiActionBullets.push(
        'پرهیز از تکیه صرف بر قراردادهای کوتاه‌مدت با توزیع‌کنندگان یا تولیدکنندگان بیرونی',
        'اولویت اول: تملک، ایجاد تدریجی یا مشارکت سهامی در حلقه‌های تیک‌خورده',
        'در صورت کمبود سرمایه، همکاری راهبردی با یک شریک مکمل پیش از ورود رقبای کپی‌کار',
      )
    } else if (appScore < 0.55 && q7Own >= 0.55) {
      pfiStrategyTitle = 'مقیاس‌گیری سریع و تبدیل دارایی‌های مکمل خودی به سپر دفاعی'
      pfiStrategyBody =
        'نظام صیانت ضعیف است و رقبا می‌توانند محصول را کپی کنند، اما برگ برنده شما مالکیت حلقه‌های حیاتی اجراست. با سرعت بالا مقیاس بگیرید تا پیش از رسیدن تقلیدکنندگان، استاندارد بازار و مشتریان را قفل کنید.'
      pfiActionBullets.push(
        'استفاده تهاجمی از شبکه فروش، برند و خدمات پس از فروش خودی به عنوان مانع ورود',
        'حرکت سریع به سمت کاهش هزینه تمام‌شده و تولید در مقیاس',
        'پیوند دادن نوآوری به خدمات مکمل تا کپی صرف محصول برای رقیب بی‌فایده شود',
      )
    } else if (domScore < 0.5) {
      pfiStrategyTitle = 'انعطاف معماری و شکل‌دهی به طراحی غالب'
      pfiStrategyBody =
        'بازار هنوز پیش از طراحی غالب است و مشتریان دنبال کارکردهای جدیدند. از قفل کردن سرمایه سنگین روی خط تولید غیرقابل تغییر بپرهیزید، با سرعت از بازار بازخورد بگیرید و با اسرار تجاری و شرکای مکمل، مدل خود را به استاندارد غالب تبدیل کنید.'
      pfiActionBullets.push(
        'پرهیز از سرمایه‌گذاری سنگین و غیرمنعطف پیش از تثبیت استاندارد بازار',
        'تمرکز بر تعامل نزدیک با مشتریان پیشرو برای کشف طرح برنده',
        'ایجاد ائتلاف با ارائه‌دهندگان مکمل‌ها برای تثبیت طراحی غالب به نام خود',
      )
    } else {
      pfiStrategyTitle = 'یکپارچه‌سازی انتخابی و قفل کردن سهم سود پایدار'
      pfiStrategyBody =
        'نظام صیانت و موقعیت دارایی‌های مکمل در سطح متعادل تا قوی است. تمرکز باید بر حفظ مالکیت گلوگاه‌های تخصصی، بهینه‌سازی فرآیند تولید پس از تثبیت طراحی غالب و قراردادهای محکم با شرکای غیرحیاتی باشد.'
      pfiActionBullets.push(
        'حفظ کنترل کامل بر حلقه‌های تخصصی و برون‌سپاری بخش‌های عمومی',
        'تمرکز بر بهینه‌سازی هزینه و کیفیت در مرحله پس از طراحی غالب',
        'رصد مداوم رقبای جدید برای جلوگیری از تضعیف تدریجی نظام صیانت',
      )
    }

    if (checkedLinks.length > 0) {
      pfiActionBullets.push(`حلقه‌های حیاتی شناسایی‌شده: ${checkedLinks.map((item) => item.label).join('، ')}`)
    }
  }

  // ---------------------------------------------------------------
  // ۷. وضعیت فرم، ROIC بنگاه و منابع تیک‌خورده
  // ---------------------------------------------------------------
  const isBlank = answeredForceQs === 0 && !anyBarneyAnswered && pfiAnsweredCount === 0

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
    pfiAnsweredCount,
    pfiFirmShare,
    pfiCompShare,
    pfiImitatorShare,
    pfiWinnerLabel,
    pfiAppStatus,
    pfiDomStatus,
    pfiCompStatus,
    pfiOwnStatus,
    pfiStrategyTitle,
    pfiStrategyBody,
    pfiActionBullets,
    pfiDistVal: distVal,
    pfiDistMonopolized: distMonopolized,
    pfiBarneySupport: barneyTacitSupportScore,
    pfiBarneyAmbigPct: barneyAmbigPct,
    bestBadge: FS !== null ? (FS >= 65 ? 'مزیت رقابتی پایدار' : 'مزیت موقت / برابری') : 'در انتظار تکمیل فرم',
  }
}
