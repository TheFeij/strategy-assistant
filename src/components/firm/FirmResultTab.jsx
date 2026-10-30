import { useStrategy } from '../../state/StrategyContext'
import { RESOURCE_CATEGORIES } from '../../data/resources'
import BarChart from '../ui/BarChart'
import Button from '../ui/Button'
import GaugeChart from '../ui/GaugeChart'
import Kpi from '../ui/Kpi'
import Note from '../ui/Note'

const CATEGORY_COLORS = ['var(--chart-1)', 'var(--chart-4)', 'var(--chart-6)']

export default function FirmResultTab({ onReview, onNavigate }) {
  const { firm } = useStrategy()
  const { score, categoryScores, filledCategories, count, strongCount } = firm

  const interpretation = (() => {
    if (score === null) return 'منابع را در سه دسته ثبت کنید.'
    if (filledCategories < 3) {
      return `برای امتیاز نهایی باید هر سه دسته تکمیل شوند؛ فعلاً فقط ${filledCategories} دسته از سه دسته دارای داده است.`
    }
    if (strongCount) {
      return `${strongCount} منبع در هر چهار معیار امتیاز ۴ یا ۵ دارد؛ شواهد مستقل و مقایسه رقابتی را بررسی کنید.`
    }
    if (score >= 60) {
      return 'میانگین منابع امیدوارکننده است، اما منبعی با هر چهار معیار قوی هم‌زمان ثبت نشده است.'
    }
    return 'ظرفیت منابع پایین یا متوسط است؛ شکاف قابلیت‌ها و امکان توسعه منابع را بررسی کنید.'
  })()

  const formatScore = (value) => (value === null ? '— / ۱۰۰' : `${value} / ۱۰۰`)

  const chartData = RESOURCE_CATEGORIES.map((category, index) => ({
    label: category.chartLabel,
    value: categoryScores[index],
    color: CATEGORY_COLORS[index],
  }))

  return (
    <div className="sub active" id="b4">
      <div className="grid3" id="sec-m2-categories">
        {RESOURCE_CATEGORIES.map((category, index) => (
          <Kpi key={category.code} label={category.title} value={formatScore(categoryScores[index])} />
        ))}
      </div>

      <div className="grid3" id="sec-m2-totals">
        <Kpi label="امتیاز پایداری منابع" value={formatScore(score)} />
        <Kpi label="تعداد منابع ثبت‌شده" value={count} />
        <Kpi label="منابع با هر چهار معیار قوی" value={strongCount} />
      </div>

      <div className="chart-grid">
        <div className="card chart-card" id="sec-m2-gauge">
          <h3>امتیاز پایداری منابع</h3>
          <p className="chart-hint">میانگین برابر سه دسته، هر دسته از میانگین VRIN منابع همان دسته.</p>
          <GaugeChart value={score} color="var(--chart-6)" sublabel="امتیاز از ۱۰۰" />
        </div>

        <div className="card chart-card" id="sec-m2-bars">
          <h3>امتیاز دسته‌های منابع</h3>
          <p className="chart-hint">خط‌چین، مرز ۵۰ برای غربالگری است.</p>
          <BarChart
            data={chartData}
            max={100}
            ticks={[0, 25, 50, 75, 100]}
            target={50}
            targetLabel="مرز ۵۰"
          />
        </div>
      </div>

      <div className="card" id="sec-m2-interpretation">
        <h3>تفسیر نتیجه</h3>
        <Note>{interpretation}</Note>
        <Note variant="warn">
          شرط نظری بارنی یک میانگین ساده نیست: مزیت پایدار زمانی محتمل است که منبع ارزشمند و کمیاب باشد، تقلید آن
          دشوار باشد و جایگزین راهبردی هم‌ارز نداشته باشد. امتیازها ابزار غربالگری‌اند، نه اثبات قطعی.
        </Note>
      </div>

      <div id="sec-m2-formula">
        <h3>فرمول امتیازدهی</h3>
        <p className="muted">
          برای هر منبع: میانگین چهار معیار VRIN (از ۱ تا ۵) به شاخص صفر تا ۱۰۰ تبدیل می‌شود: (میانگین − ۱) ÷ ۴ ×
          ۱۰۰. امتیاز هر دسته، میانگین منابع آن دسته و امتیاز کل، میانگین برابر سه دسته است. وزن برابر یک انتخاب
          طراحی است؛ در صورت اهمیت متفاوت منابع، باید با نظر خبرگان یا تحلیل حساسیت توجیه شود.
        </p>
      </div>

      <div className="rowbtn">
        {RESOURCE_CATEGORIES.map((category) => (
          <Button key={category.code} onClick={() => onReview(category.code)}>
            بازبینی {category.title}
          </Button>
        ))}
        <Button variant="primary" onClick={() => onNavigate('m3')}>
          ترکیب با صنعت ←
        </Button>
      </div>
    </div>
  )
}
