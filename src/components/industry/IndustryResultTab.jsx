import { useStrategy } from '../../state/StrategyContext'
import { FORCES } from '../../data/forces'
import { computeSpread, describeIndustry } from '../../utils/calculations'
import { exportDashboard } from '../../utils/export'
import BarChart from '../ui/BarChart'
import Button from '../ui/Button'
import GaugeChart from '../ui/GaugeChart'
import Kpi from '../ui/Kpi'
import Note from '../ui/Note'

export default function IndustryResultTab({ onEdit, onNavigate }) {
  const { state, industry } = useStrategy()
  const { score, pressure, forceAverages } = industry
  const { label, strategy } = describeIndustry(score)
  const spread = computeSpread(state.financial)

  const rankedForces = FORCES.filter((force) => forceAverages[force.key] !== null).sort(
    (a, b) => forceAverages[b.key] - forceAverages[a.key],
  )

  const chartData = FORCES.map((force) => ({
    label: force.chartLabel,
    value: forceAverages[force.key],
  }))

  return (
    <div className="sub active" id="a4">
      <div className="grid3" id="sec-m1-kpis">
        <Kpi label="جذابیت ساختاری" value={score === null ? '— / ۱۰۰' : `${score} / ۱۰۰`} sub={label} />
        <Kpi label="فشار رقابتی میانگین" value={pressure === null ? '— / ۵' : pressure.toFixed(2)} />
        <Kpi label="فاصله ROIC بنگاه از WACC" value={spread === null ? '—' : spread.toFixed(1)} />
      </div>

      <div className="chart-grid">
        <div className="card chart-card" id="sec-m1-gauge">
          <h3>شاخص جذابیت ساختاری</h3>
          <p className="chart-hint">امتیاز بالاتر یعنی فشار ساختاری کمتر؛ این شاخص احتمال موفقیت نیست.</p>
          <GaugeChart value={score} sublabel="امتیاز از ۱۰۰" />
        </div>

        <div className="card chart-card" id="sec-m1-bars">
          <h3>شدت پنج نیرو</h3>
          <p className="chart-hint">۱ = فشار کم، ۵ = فشار زیاد</p>
          <BarChart
            data={chartData}
            max={5}
            ticks={[0, 1, 2, 3, 4, 5]}
            unit="/۵"
            formatValue={(value) => value.toFixed(1)}
          />
        </div>
      </div>

      <div className="card" id="sec-m1-advice">
        <h3>پیشنهاد اولیه</h3>
        <Note>{strategy}</Note>
        <ul>
          {rankedForces.length ? (
            <>
              <li>بالاترین فشار ثبت‌شده: {rankedForces[0].label}.</li>
              {state.financial.industryROIC !== '' && (
                <li>
                  ROIC صنعت ثبت‌شده: {state.financial.industryROIC}٪؛ آن را با روند چندساله و WACC تفسیر کنید.
                </li>
              )}
            </>
          ) : (
            <li>داده کافی برای تفسیر وجود ندارد.</li>
          )}
        </ul>
      </div>

      <p className="small">
        امتیاز بالاتر یعنی فشار ساختاری کمتر؛ این شاخص احتمال موفقیت نیست و باید با شواهد و روند سودآوری تفسیر شود.
        ROIC صنعت در کنار امتیاز پنج نیرو، شاخص تحقق‌یافته بازده سرمایه است؛ آن را جداگانه با روند چندساله و هزینه
        سرمایه مناسب مقایسه کنید و به‌طور خودکار جایگزین امتیاز ساختاری نکنید.
      </p>

      <div className="rowbtn">
        <Button onClick={onEdit}>→ اصلاح داده‌ها</Button>
        <Button variant="primary" onClick={() => onNavigate('m3')}>
          ترکیب با بنگاه ←
        </Button>
        <Button onClick={() => exportDashboard(state, industry)}>خروجی JSON</Button>
      </div>
    </div>
  )
}
