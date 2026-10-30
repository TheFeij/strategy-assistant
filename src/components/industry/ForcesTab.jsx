import { useStrategy } from '../../state/StrategyContext'
import { FIVE_POINT_SCALE } from '../../data/constants'
import { FORCES } from '../../data/forces'
import Button from '../ui/Button'
import Field from '../ui/Field'
import Note from '../ui/Note'

export default function ForcesTab({ onBack, onNext }) {
  const { state, industry, actions } = useStrategy()

  return (
    <div className="sub active" id="a2">
      <div className="card">
        <h2>سنجش پنج نیرو</h2>
        <p className="muted">
          ۱ = فشار خیلی کم، ۵ = فشار خیلی زیاد. عوامل فاقد شواهد را نامشخص بگذارید. امتیاز عددی و وزن‌ها ابزار
          عملیاتی‌سازی داشبوردند؛ پورتر وزن عددی استانداردی تعیین نکرده است.
        </p>

        <Note>
          <b>پرسش‌های راهنمای شناسایی عوامل:</b> ۱) چه کسی ارزش ایجادشده را تصاحب می‌کند: مشتری، تأمین‌کننده یا
          بنگاه؟ ۲) کدام سازوکار قدرت چانه‌زنی یا شدت رقابت را ایجاد می‌کند؟ ۳) این سازوکار از طریق قیمت، هزینه،
          حجم فروش، ظرفیت یا سرمایه لازم چگونه بر سودآوری اثر می‌گذارد؟ ۴) آیا شاهد کمّی و تاریخ‌دار برای آن داریم؟
          ۵) عامل موردنظر ساختاری و پایدار است یا موقتی؟ هر امتیاز باید به شاهد و سازوکار علّی متصل باشد؛ در نبود
          شاهد، «نامشخص» انتخاب شود.
        </Note>

        <div id="forces">
          {FORCES.map((force) => {
            const average = industry.forceAverages[force.key]
            return (
              <div className="force" key={force.key} id={`sec-force-${force.key}`}>
                <h3>
                  {force.label} | میانگین <b>{average === null ? '—' : average.toFixed(1)}</b>/۵
                </h3>

                {force.factors.map((factor, index) => (
                  <div className="factor" key={factor}>
                    <label>{factor}</label>
                    <select
                      className="score"
                      value={state.forceScores[force.key][index] ?? ''}
                      onChange={(event) =>
                        actions.setForceScore(
                          force.key,
                          index,
                          event.target.value === '' ? null : Number(event.target.value),
                        )
                      }
                    >
                      <option value="">نامشخص</option>
                      {FIVE_POINT_SCALE.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <label>شواهد، منبع و تاریخ</label>
                <textarea
                  value={state.forceEvidence[force.key]}
                  onChange={(event) => actions.setForceEvidence(force.key, event.target.value)}
                  placeholder="داده و دلیل امتیاز"
                />
              </div>
            )
          })}
        </div>

        <div id="sec-m1-weights">
          <div className="grid2">
            <Field label="روش وزن‌دهی">
              <select
                value={state.weights.mode}
                onChange={(event) => actions.setWeightMode(event.target.value)}
              >
                <option value="equal">وزن برابر</option>
                <option value="custom">وزن سفارشی</option>
              </select>
            </Field>
            <Field label="دلیل وزن‌های سفارشی">
              <textarea
                value={state.weights.rationale}
                onChange={(event) => actions.setWeightRationale(event.target.value)}
              />
            </Field>
          </div>

          <div id="weights" className="grid3">
            {FORCES.map((force) => (
              <Field key={force.key} label={force.label}>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step=".5"
                  value={state.weights.values[force.key]}
                  disabled={state.weights.mode !== 'custom'}
                  onChange={(event) => actions.setWeightValue(force.key, event.target.value)}
                />
              </Field>
            ))}
          </div>
        </div>

        <Note variant="ai">
          <b>محل AI:</b> جمع‌آوری شواهد صنعت، پیشنهاد شدت ۱ تا ۵، سطح اطمینان و منبع. داده داخلی مدیر باید جدا از
          برآورد AI ثبت شود.
        </Note>

        <div className="rowbtn">
          <Button onClick={onBack}>→ مرز صنعت</Button>
          <Button variant="primary" onClick={onNext}>
            ادامه ←
          </Button>
        </div>
      </div>
    </div>
  )
}
