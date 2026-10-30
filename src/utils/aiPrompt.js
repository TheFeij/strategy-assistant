import { CHANGE_FACTORS } from '../data/constants'
import { FORCES } from '../data/forces'

const orMissing = (value) => value || 'ثبت نشده'

/**
 * Builds a self-contained analysis prompt from the recorded dashboard data.
 * The app stays offline: the prompt is meant to be pasted into an external,
 * approved AI tool.
 */
export function buildAIPrompt(state, industry) {
  const forceLines = FORCES.map((force) => {
    const average = industry.forceAverages[force.key]
    return `${force.label}: معیارها: ${force.factors.join('؛ ')}؛ میانگین ثبت‌شده ${
      average === null ? '—' : average.toFixed(1)
    }/5؛ شواهد/منبع/تاریخ: ${orMissing(state.forceEvidence[force.key])}`
  }).join('\n')

  const resourceLines =
    state.resources
      .map(
        (resource) =>
          `${resource.name} (${resource.type})؛ توضیح ارزش: ${orMissing(
            resource.description,
          )}؛ امتیاز V=${resource.v}, R=${resource.r}, I=${resource.i}, N=${resource.n}؛ شواهد: ${orMissing(
            resource.evidence,
          )}`,
      )
      .join('\n') || 'منبعی ثبت نشده'

  const matrixLines = CHANGE_FACTORS.map(
    (factor, i) =>
      `${factor}: ` +
      FORCES.map((force, j) => `${force.label}=${state.changeMatrix[i][j]}`).join('، '),
  ).join('\n')

  return `نقش: تحلیلگر راهبردی انتقادی. صنعت: ${state.industry.name || 'نامشخص'}. بنگاه: ${
    state.industry.firm || 'نامشخص'
  }. مرز صنعت: ${orMissing(state.industry.scope)}؛ جغرافیا: ${state.industry.geo}؛ افق: ${
    state.industry.horizon
  }.

۱) پنج نیروی پورتر را با استفاده از معیارهای زیر تحلیل کن. برای هر نیرو، سازوکار علّی، داده لازم، منبع/تاریخ، سطح اطمینان و موارد نامشخص را جدا کن. امتیازهای ثبت‌شده را حقیقت قطعی تلقی نکن و داده مفقود را حدس نزن.
${forceLines}

۲) عوامل زمینه‌ای و اثر آنها بر هر نیرو (۳=خنثی/نامشخص؛ ۱ و ۲ کاهش فشار؛ ۴ و ۵ افزایش فشار):
${matrixLines}
توضیح عامل سودآوری امروز: ${orMissing(state.profitDriver)}؛ تغییر ساختاری محتمل: ${orMissing(
    state.futureChange,
  )}. زنجیره «عامل ← سازوکار ← نیرو ← جهت اثر ← شاهد» را برای هر رابطه توضیح بده.

۳) منابع بنگاه را با منطق بارنی (۱۹۹۱) بررسی کن: ارزشمندی، کمیابی، تقلیدناپذیری و جایگزین‌ناپذیری. برای هر معیار شواهد موافق و مخالف، مقایسه با رقبا و درجه اطمینان بده؛ میان امتیاز ثبت‌شده و اثبات مزیت پایدار تفاوت بگذار.
${resourceLines}

۴) یافته مک‌گاهان و پورتر (۱۹۹۷) را در تفسیر ترکیبی به کار ببر: در نمونه مقاله، اثر پایدار صنعت ۱۸٫۶۸٪، اثر اختصاصی بخش کسب‌وکار ۳۱٫۷۱٪، اثر شرکت مادر ۴٫۳۳٪، اثر سال ۲٫۳۹٪، هم‌تغییری صنعت و شرکت مادر منفی ۵٫۵۱٪، سهم مدل ۵۱٫۶۰٪ و خطا ۴۸٫۴۰٪ گزارش شده است. این ارقام نتایج تجزیه واریانس در نمونه و وابسته به روش/سطح تحلیل‌اند؛ آنها را وزن تصمیم‌گیری، احتمال موفقیت یا سهم مستقیم سود تلقی نکن.

۵) داده مالی: ROIC صنعت ایران ${state.financial.industryROIC || 'نامشخص'}٪؛ ROIC بنگاه ${
    state.financial.firmROIC || 'نامشخص'
  }٪؛ WACC ثبت‌شده ${state.financial.wacc || 'نامشخص'}٪؛ دوره ${
    state.financial.period
  }؛ کیفیت داده ${state.financial.quality}. مشخص کن کدام ارقام نمونه‌سازی و کدام مستندند؛ ROIC را به‌عنوان سنجه عملکرد مالی جدا از امتیاز ساختاری تفسیر کن.

۶) خروجی را در چهار بخش بنویس: (الف) یافته‌های مستند و تفکیک‌شده صنعت/بنگاه، (ب) شکاف داده و تناقض‌ها، (ج) تحلیل حساسیت نسبت به وزن‌ها و ROIC/WACC، (د) اقدام‌های راهبردی مشروط. هیچ منبع، عدد یا رابطه علّی را جعل نکن.`
}
