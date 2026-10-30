import { useStrategy } from '../../state/StrategyContext'
import { CHANGE_FACTORS, FINANCIAL_PERIOD_OPTIONS, FINANCIAL_QUALITY_OPTIONS, MATRIX_IMPACTS, ROIC_PRESETS } from '../../data/constants'
import { FORCES } from '../../data/forces'
import Button from '../ui/Button'
import Field from '../ui/Field'
import Note from '../ui/Note'

export default function ProfitabilityTab({ onBack, onNext }) {
  const { state, actions } = useStrategy()
  const { financial } = state

  return (
    <div className="sub active" id="a3">
      <div className="card">
        <h2>سودآوری و تغییرات ساختاری</h2>

        <div className="grid3" id="sec-m1-financial">
          <Field label="ROIC صنعت ایران (%) — ارقام نمونه‌سازی نسخه قبلی">
            <select
              value={financial.preset}
              onChange={(event) => actions.setRoiPreset(event.target.value)}
            >
              <option value="">انتخاب صنعت / ورود دستی</option>
              {ROIC_PRESETS.map((preset) => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
            <label style={{ marginTop: 6 }}>مقدار انتخاب‌شده / قابل ویرایش</label>
            <input
              type="number"
              step=".1"
              value={financial.industryROIC}
              placeholder="پس از انتخاب صنعت پر می‌شود"
              onChange={(event) => actions.setFinancialField('industryROIC', event.target.value)}
            />
          </Field>

          <Field label="ROIC بنگاه (%)">
            <input
              type="number"
              step=".1"
              value={financial.firmROIC}
              onChange={(event) => actions.setFinancialField('firmROIC', event.target.value)}
            />
          </Field>

          <Field label="WACC بنگاه (%)">
            <input
              type="number"
              step=".1"
              value={financial.wacc}
              onChange={(event) => actions.setFinancialField('wacc', event.target.value)}
            />
          </Field>
        </div>

        <div className="grid2">
          <Field label="دوره داده مالی">
            <select
              value={financial.period}
              onChange={(event) => actions.setFinancialField('period', event.target.value)}
            >
              {FINANCIAL_PERIOD_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field label="کیفیت داده">
            <select
              value={financial.quality}
              onChange={(event) => actions.setFinancialField('quality', event.target.value)}
            >
              {FINANCIAL_QUALITY_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
        </div>

        <div id="sec-m1-matrix">
          <h3>چهار عامل تغییر و اثر بر نیروها</h3>
          <p className="small">
            این عوامل نیروی ششم نیستند؛ سازوکار اثر هر کدام بر پنج نیرو ثبت می‌شود. ۳ = خنثی/نامشخص، ۱ = کاهش فشار،
            ۵ = افزایش فشار.
          </p>
        <div className="table-scroll">
          <table id="matrix">
            <thead>
              <tr>
                <th>عامل تغییر</th>
                {FORCES.map((force) => (
                  <th key={force.key}>{force.matrixLabel}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHANGE_FACTORS.map((factor, factorIndex) => (
                <tr key={factor}>
                  <td>{factor}</td>
                  {FORCES.map((force, forceIndex) => (
                    <td key={force.key}>
                      <select
                        value={state.changeMatrix[factorIndex][forceIndex]}
                        onChange={(event) =>
                          actions.setMatrixCell(factorIndex, forceIndex, Number(event.target.value))
                        }
                      >
                        {MATRIX_IMPACTS.map((impact) => (
                          <option key={impact.value} value={impact.value}>
                            {impact.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        <div className="grid2" id="sec-m1-drivers" style={{ marginTop: 12 }}>
          <Field label="عامل اصلی سودآوری امروز">
            <textarea
              value={state.profitDriver}
              onChange={(event) => actions.setChangeField('profitDriver', event.target.value)}
            />
          </Field>
          <Field label="تغییر ساختاری محتمل">
            <textarea
              value={state.futureChange}
              onChange={(event) => actions.setChangeField('futureChange', event.target.value)}
            />
          </Field>
        </div>

        <Note variant="ai">
          <b>محل AI:</b> برای هر خانه، زنجیره «عامل ← سازوکار ← نیرو ← جهت اثر ← شاهد» پیشنهاد شود. از گزارش
          رسمی، روند فناوری، تغییر مقررات و داده‌های قیمت/رشد استفاده شود.
        </Note>

        <div id="sec-m1-data-warning">
          <Note variant="warn">
            مقادیر پیش‌فرض ROIC صنایع ایران، همان ارقام تقریبی استفاده‌شده در نسخه قبلی داشبورد هستند (از جمله
            بنچمارک ۳۹٪، داروسازی ۴۶٪، فناوری اطلاعات و اینترنت ۴۵٫۵٪، پتروشیمی ۴۴٪، فلزات اساسی ۴۲٪، کانی غیرفلزی
            ۳۳٫۵٪ و هواپیمایی ۱۲٪)؛ آمار رسمی یا حسابرسی‌شده محسوب نمی‌شوند. برای نتیجه پژوهشی، دوره، تعریف سرمایه
            به‌کارگرفته‌شده و صورت‌های مالی شرکت‌های نمونه را ثبت و مقدار را با ROIC چندساله و WACC مقایسه کنید.
            بانک‌ها و خدمات مالی به دلیل تفاوت ساختار ترازنامه، مستقیماً با صنایع غیرمالی مقایسه‌پذیر نیستند.
          </Note>
        </div>

        <div className="rowbtn">
          <Button onClick={onBack}>→ پنج نیرو</Button>
          <Button variant="primary" onClick={onNext}>
            مشاهده نتیجه ←
          </Button>
        </div>
      </div>
    </div>
  )
}
