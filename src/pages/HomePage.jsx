import { useStrategy } from '../state/StrategyContext'
import Button from '../components/ui/Button'
import Kpi from '../components/ui/Kpi'
import Note from '../components/ui/Note'

const MODULES = [
  {
    id: 'm1',
    number: '۰۱',
    title: 'تحلیل جذابیت صنعت',
    description:
      'مرز صنعت، پنج نیروی رقابتی، سودآوری و تغییرات ساختاری، نتیجه و پیشنهاد استراتژی.',
    basis: 'مبنای نظری: پورتر (۲۰۰۸)',
  },
  {
    id: 'm2',
    number: '۰۲',
    title: 'تحلیل منابع و مزیت بنگاه',
    description:
      'منابع فیزیکی، انسانی و سازمانی؛ ارزیابی ارزشمندی، کمیابی، تقلیدناپذیری و جایگزین‌ناپذیری.',
    basis: 'مبنای نظری: بارنی (۱۹۹۱)',
  },
  {
    id: 'm3',
    number: '۰۳',
    title: 'ترکیب صنعت و بنگاه',
    description:
      'ترکیب جذابیت ساختاری و شاخص منابع برای تشخیص موقعیت راهبردی و مقایسه گزینه‌ها.',
    basis: 'چارچوب ترکیبی؛ با ارجاع به نقد پورتر و مک‌گاهان',
  },
]

export default function HomePage({ active, onNavigate }) {
  const { state } = useStrategy()

  return (
    <section className={active ? 'page active' : 'page'} id="home">
      <div className="hero">
        <span className="eyebrow">داشبورد تصمیم‌یار</span>
        <h1>داشبورد راهبردی صنعت و بنگاه</h1>
        <p className="muted">
          سه ماژول مستقل؛ ابتدا صنعت و منابع بنگاه را جداگانه تحلیل کنید، سپس نتایج را ترکیب کنید.
        </p>
      </div>

      <div className="cards">
        {MODULES.map((module) => (
          <div
            key={module.id}
            className="module"
            role="button"
            tabIndex={0}
            onClick={() => onNavigate(module.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onNavigate(module.id)
            }}
          >
            <div className="num">{module.number}</div>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
            <span className="basis">{module.basis}</span>
            <Button variant="primary">ورود به ماژول ←</Button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>نحوه استفاده</h3>
        <div className="grid3">
          <Kpi label="اول" value="صنعت" sub="پنج نیرو و شواهد" />
          <Kpi label="دوم" value="بنگاه" sub="منابع و معیارهای VRIN" />
          <Kpi label="سوم" value="ترکیب" sub="پیشنهاد مشروط به شواهد" />
        </div>
        <Note variant="ai">
          محل‌های پیشنهادی هوش مصنوعی مشخص شده‌اند، اما این نمونه هنوز به API یا پایگاه داده زنده متصل نیست.
        </Note>
      </div>

      <Note>
        داده‌های ثبت‌شده در این نشست نگه داشته می‌شوند تا بین ماژول‌ها جابه‌جا شوید؛ برای نگهداری بلندمدت از «خروجی
        JSON» استفاده کنید.
        {state.industry.name ? ` صنعت جاری: ${state.industry.name}.` : ''}
      </Note>
    </section>
  )
}
