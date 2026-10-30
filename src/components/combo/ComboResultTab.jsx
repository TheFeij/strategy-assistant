import { useState } from 'react'
import { useStrategy } from '../../state/StrategyContext'
import { DECISION_MATRIX } from '../../data/constants'
import { describeCombo } from '../../utils/calculations'
import { buildAIPrompt } from '../../utils/aiPrompt'
import { copyText } from '../../utils/clipboard'
import { exportDashboard } from '../../utils/export'
import BarChart from '../ui/BarChart'
import Button from '../ui/Button'
import GaugeChart from '../ui/GaugeChart'
import Kpi from '../ui/Kpi'
import Note from '../ui/Note'

const formatShare = (share) => (share === null ? '—' : `${(share * 100).toFixed(1)}٪`)
const scoreLabel = (value) => (value === null ? '— / ۱۰۰' : `${value} / ۱۰۰`)
const quadrantKey = (row) => `${row.industry === 'بالا' ? 'high' : 'low'}-${row.firm === 'بالا' ? 'high' : 'low'}`

export default function ComboResultTab({ onBack, onNavigate }) {
  const { state, industry, firm, combo, actions } = useStrategy()
  const [copyStatus, setCopyStatus] = useState('')
  const advice = describeCombo(industry.score, firm.score)

  const buildPrompt = () => {
    const prompt = buildAIPrompt(state, industry)
    actions.setAiPrompt(prompt)
    return prompt
  }

  const handleCopy = async () => {
    const prompt = state.aiPrompt || buildPrompt()
    const copied = await copyText(prompt)
    setCopyStatus(
      copied ? 'دستور تحلیل کپی شد.' : 'متن دستور ساخته شد؛ آن را دستی کپی کنید.',
    )
  }

  const compareData = [
    { label: 'جذابیت صنعت', value: industry.score, color: 'var(--chart-1)' },
    { label: 'منابع بنگاه', value: firm.score, color: 'var(--chart-4)' },
    { label: 'امتیاز ترکیبی', value: combo.score, color: 'var(--chart-6)' },
  ]

  return (
    <div className="sub active" id="c3">
      <div className="grid3" id="sec-m3-kpis">
        <Kpi label="جذابیت صنعت" value={scoreLabel(industry.score)} />
        <Kpi label="منابع بنگاه" value={scoreLabel(firm.score)} />
        <Kpi label="امتیاز ترکیبی" value={scoreLabel(combo.score)} />
      </div>

      <div className="chart-grid">
        <div className="card chart-card" id="sec-m3-gauge">
          <h3>امتیاز ترکیبی</h3>
          <p className="chart-hint">
            وزن مؤثر: صنعت {formatShare(combo.industryShare)} · بنگاه {formatShare(combo.firmShare)}
          </p>
          <GaugeChart value={combo.score} color="var(--chart-1)" sublabel="امتیاز از ۱۰۰" />
        </div>

        <div className="card chart-card" id="sec-m3-compare">
          <h3>مقایسه اجزا</h3>
          <p className="chart-hint">خط‌چین، مرز ۵۰ برای تفکیک ماتریس تصمیم است.</p>
          <BarChart
            data={compareData}
            max={100}
            ticks={[0, 25, 50, 75, 100]}
            target={50}
            targetLabel="مرز ۵۰"
          />
        </div>
      </div>

      <div className="card" id="sec-m3-advice">
        <h3>پیشنهاد راهبردی</h3>
        <Note>{advice.title}</Note>
        <ul>
          {combo.score === null ? (
            <li>برای نتیجه ترکیبی، هر دو ماژول صنعت و بنگاه باید امتیاز داشته باشند.</li>
          ) : (
            <>
              <li>{advice.description}</li>
              <li>
                امتیاز صنعت {industry.score}/100 و شاخص منابع {firm.score}/100 است؛ وزن‌های مؤثر{' '}
                {formatShare(combo.industryShare)} و {formatShare(combo.firmShare)}.
              </li>
              <li>این نتیجه یک قاعده تصمیم طراحی‌شده است و جای تفسیر شواهد و تحلیل حساسیت را نمی‌گیرد.</li>
            </>
          )}
        </ul>
      </div>

      <div className="card">
        <div id="sec-m3-ai">
          <h3>دستیار تحلیل هوش مصنوعی</h3>
          <p className="muted">
            این فایل به مدل هوش مصنوعی متصل نیست؛ دکمه زیر دستور تحلیل را از داده‌های ثبت‌شده می‌سازد تا در ChatGPT یا
            ابزار مجاز دیگری استفاده کنید. پاسخ AI باید با منابع اصلی کنترل شود.
          </p>

          <div className="inline-actions">
            <Button onClick={buildPrompt}>ساخت دستور تحلیل بر اساس داده‌های داشبورد</Button>
            <Button onClick={handleCopy}>کپی دستور</Button>
            {copyStatus ? <span className="copy-status">{copyStatus}</span> : null}
          </div>

          <textarea
            style={{ marginTop: 10, minHeight: 150 }}
            value={state.aiPrompt}
            placeholder="دستور تحلیل پس از فشردن دکمه اینجا ساخته می‌شود"
            onChange={(event) => actions.setAiPrompt(event.target.value)}
          />
        </div>

        <div id="sec-m3-matrix">
          <h3 style={{ marginTop: 18 }}>ماتریس تصمیم</h3>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>جذابیت صنعت</th>
                  <th>منابع بنگاه</th>
                  <th>جهت پیشنهادی</th>
                </tr>
              </thead>
              <tbody>
                {DECISION_MATRIX.map((row) => (
                  <tr
                    key={`${row.industry}-${row.firm}`}
                    className={quadrantKey(row) === advice.quadrant ? 'matrix-current' : undefined}
                  >
                    <td>{row.industry}</td>
                    <td>{row.firm}</td>
                    <td>{row.direction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Note>
            این ماتریس قاعده مدیریتی پیشنهادی است؛ برای ادعای تطابق دقیق با مقاله پورتر و مک‌گاهان باید متن مقاله در
            دسترس باشد. مرز «بالا/پایین» در این داشبورد امتیاز ۵۰ است.
          </Note>
        </div>

        <div className="rowbtn">
          <Button onClick={onBack}>→ اصلاح وزن‌ها</Button>
          <Button variant="primary" onClick={() => exportDashboard(state, industry)}>
            خروجی JSON
          </Button>
          <Button onClick={() => window.print()}>چاپ / ذخیره PDF</Button>
          <Button onClick={() => onNavigate('home')}>صفحه اول</Button>
        </div>
      </div>
    </div>
  )
}
