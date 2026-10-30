import { useStrategy } from '../../state/StrategyContext'
import Button from '../ui/Button'
import Kpi from '../ui/Kpi'
import Note from '../ui/Note'

export default function ComboOverviewTab({ onNavigate, onNext }) {
  const { industry, firm, combo } = useStrategy()

  return (
    <div className="sub active" id="c1">
      <div className="card" id="sec-m3-overview">
        <h2>مرور امتیازها</h2>

        <div className="grid3">
          <Kpi label="جذابیت صنعت" value={industry.score === null ? '— / ۱۰۰' : `${industry.score} / ۱۰۰`} />
          <Kpi label="شاخص منابع بنگاه" value={firm.score === null ? '— / ۱۰۰' : `${firm.score} / ۱۰۰`} />
          <Kpi label="امتیاز ترکیبی" value={combo.score === null ? '— / ۱۰۰' : `${combo.score} / ۱۰۰`} />
        </div>

        <Note>اگر یکی از ماژول‌ها ناقص باشد، نتیجه ترکیبی نمایش داده نمی‌شود.</Note>

        <div className="rowbtn">
          <Button onClick={() => onNavigate('m1')}>تکمیل تحلیل صنعت</Button>
          <Button onClick={() => onNavigate('m2')}>تکمیل تحلیل بنگاه</Button>
          <Button variant="primary" onClick={onNext}>
            ادامه ←
          </Button>
        </div>
      </div>
    </div>
  )
}
