import { useStrategy } from '../../state/StrategyContext'
import Button from '../ui/Button'
import Field from '../ui/Field'
import Note from '../ui/Note'
import { GEO_OPTIONS, HORIZON_OPTIONS } from '../../data/constants'

export default function BoundaryTab({ onNext }) {
  const { state, actions } = useStrategy()
  const { industry } = state

  return (
    <div className="sub active" id="a1">
      <div className="card">
        <h2>تعریف مرز صنعت</h2>
        <div className="grid2">
          <Field id="sec-m1-identity" label="نام صنعت / بازار">
            <input
              value={industry.name}
              onChange={(event) => actions.setIndustryField('name', event.target.value)}
              placeholder="مثلاً تجهیزات پزشکی خانگی"
            />
          </Field>
          <Field label="بنگاه مورد تحلیل">
            <input
              value={industry.firm}
              onChange={(event) => actions.setIndustryField('firm', event.target.value)}
              placeholder="نام شرکت"
            />
          </Field>
          <Field id="sec-m1-scope" label="دامنه محصول، خدمت و مشتری">
            <textarea
              value={industry.scope}
              onChange={(event) => actions.setIndustryField('scope', event.target.value)}
              placeholder="چه چیزهایی داخل یا خارج از مرز تحلیل‌اند؟"
            />
          </Field>
          <Field label="محدوده جغرافیایی">
            <select
              value={industry.geo}
              onChange={(event) => actions.setIndustryField('geo', event.target.value)}
            >
              {GEO_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field label="افق زمانی">
            <select
              value={industry.horizon}
              onChange={(event) => actions.setIndustryField('horizon', event.target.value)}
            >
              {HORIZON_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field id="sec-m1-sources" label="منابع اولیه و پیوند گزارش‌ها">
            <textarea
              value={industry.sources}
              onChange={(event) => actions.setIndustryField('sources', event.target.value)}
            />
          </Field>
        </div>

        <Note variant="ai">
          <b>محل AI:</b> پیشنهاد مرز بازار، بازیگران و منابع داده بر اساس محصول، مشتری و جغرافیا؛ هر پیشنهاد باید
          منبع، تاریخ و دلیل تناسب داشته باشد. مدیر مرز پیشنهادی را تأیید یا اصلاح می‌کند.
        </Note>

        <Button variant="primary" onClick={onNext}>
          ادامه: پنج نیرو ←
        </Button>
      </div>
    </div>
  )
}
