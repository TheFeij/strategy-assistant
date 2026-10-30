import { FORCES } from '../data/forces'
import { RESOURCE_CATEGORIES } from '../data/resources'
import { QUADRANT_THRESHOLD } from '../data/constants'

const sum = (values) => values.reduce((total, value) => total + value, 0)

/**
 * Industry attractiveness. Each force is the mean of its answered factors
 * (unknown factors are skipped). The pressure is the weighted mean of the
 * answered forces; weight mode "equal" gives every force the same weight.
 */
export function computeIndustry(state) {
  const forceAverages = {}

  FORCES.forEach((force) => {
    const values = (state.forceScores[force.key] || []).filter((value) => value !== null && value !== '')
    forceAverages[force.key] = values.length ? sum(values) / values.length : null
  })

  let weighted = 0
  let weightTotal = 0

  FORCES.forEach((force) => {
    const average = forceAverages[force.key]
    if (average === null) return
    const weight =
      state.weights.mode === 'custom'
        ? Math.max(0, Number(state.weights.values[force.key]) || 0)
        : 1
    weighted += average * weight
    weightTotal += weight
  })

  const pressure = weightTotal ? weighted / weightTotal : null
  const score = weightTotal ? Math.round((1 - pressure / 5) * 100) : null

  return {
    forceAverages,
    pressure,
    score,
    answeredForces: FORCES.filter((force) => forceAverages[force.key] !== null).length,
  }
}

/**
 * Resource sustainability. Per resource: mean of the four VRIN criteria mapped
 * from 1..5 to 0..100. Per category: mean of its resources. Overall: equal
 * mean of the three categories, only reported once all three have data.
 */
export function computeFirm(resources) {
  const categoryScores = RESOURCE_CATEGORIES.map((category) => {
    const list = resources.filter((resource) => resource.type === category.type)
    if (!list.length) return null
    const average = sum(list.map((resource) => (resource.v + resource.r + resource.i + resource.n) / 4)) / list.length
    return Math.round(((average - 1) / 4) * 100)
  })

  const filledCategories = categoryScores.filter((score) => score !== null)
  const score =
    filledCategories.length === RESOURCE_CATEGORIES.length
      ? Math.round(sum(filledCategories) / RESOURCE_CATEGORIES.length)
      : null

  return {
    categoryScores,
    score,
    filledCategories: filledCategories.length,
    count: resources.length,
    strongCount: resources.filter(
      (resource) => resource.v >= 4 && resource.r >= 4 && resource.i >= 4 && resource.n >= 4,
    ).length,
  }
}

/** Weighted combination of industry and firm scores; weights are normalised. */
export function computeCombo(industryScore, firmScore, combination) {
  const industryWeight = Math.max(0, Number(combination.industryWeight) || 0)
  const firmWeight = Math.max(0, Number(combination.firmWeight) || 0)
  const total = industryWeight + firmWeight
  const bothReady = industryScore !== null && firmScore !== null

  return {
    score: bothReady && total > 0 ? Math.round((industryScore * industryWeight + firmScore * firmWeight) / total) : null,
    industryWeight,
    firmWeight,
    total,
    industryShare: total > 0 ? industryWeight / total : null,
    firmShare: total > 0 ? firmWeight / total : null,
  }
}

export function computeSpread(financial) {
  if (financial.firmROIC === '' || financial.wacc === '') return null
  return Number(financial.firmROIC) - Number(financial.wacc)
}

export function describeIndustry(score) {
  if (score === null) {
    return {
      label: 'امتیازها را وارد کنید',
      strategy: 'برای پیشنهاد ابتدا پنج نیرو را امتیازدهی کنید.',
    }
  }
  if (score >= 65) {
    return {
      label: 'جذابیت نسبتاً بالا',
      strategy: 'بررسی ورود یا توسعه هدفمند؛ منابع بنگاه و سودآوری باید تأیید شوند.',
    }
  }
  if (score >= 40) {
    return {
      label: 'جذابیت میانه',
      strategy: 'تمرکز بر بخش جذاب‌تر، تمایز و بهره‌برداری از تغییرات.',
    }
  }
  return {
    label: 'فشار رقابتی بالا',
    strategy: 'احتیاط در ورود و بررسی جایگاه دفاعی یا تغییر ساختار رقابت.',
  }
}

/** Maps the two scores onto the 2x2 decision matrix from module 3. */
export function describeCombo(industryScore, firmScore) {
  if (industryScore === null || firmScore === null) {
    return { title: 'داده‌ها را تکمیل کنید.', description: '', quadrant: null }
  }

  const highIndustry = industryScore >= QUADRANT_THRESHOLD
  const highFirm = firmScore >= QUADRANT_THRESHOLD
  const combo = `${highIndustry ? 'high' : 'low'}-${highFirm ? 'high' : 'low'}`

  const advice = {
    'high-high': {
      title: 'رشد هدفمند و حفاظت از مزیت',
      description:
        'ساختار صنعت و منابع بنگاه هر دو مساعدند؛ توسعه هدفمند را با حفاظت از منابع کمیاب و تقلیدناپذیر همراه کنید.',
    },
    'high-low': {
      title: 'ورود مرحله‌ای، ساخت قابلیت یا شراکت',
      description:
        'صنعت جذاب است اما منابع بنگاه کافی نیست؛ ورود مرحله‌ای، ساخت قابلیت یا شراکت را با شواهد بسنجید.',
    },
    'low-high': {
      title: 'تمایز، دفاع از ارزش یا تغییر بخش هدف',
      description:
        'منابع بنگاه قوی است اما ساختار صنعت فشارآور است؛ بر تمایز و دفاع از ارزش یا انتخاب بخش هدف متفاوت تمرکز کنید.',
    },
    'low-low': {
      title: 'احتیاط، بازنگری ورود یا تخصیص مجدد منابع',
      description:
        'هم ساختار صنعت و هم منابع بنگاه محدودیت دارند؛ ورود را بازنگری و منابع را دوباره تخصیص دهید.',
    },
  }[combo]

  return { ...advice, quadrant: combo }
}
