import { useState } from 'react'
import { useStrategy } from '../../state/StrategyContext'
import { DEFAULT_VRIN_SCORE, VRIN_CRITERIA, VRIN_SCALE } from '../../data/vrin'
import Button from '../ui/Button'

const EMPTY_FORM = { name: '', effect: '', evidence: '', imitation: '' }

export default function ResourceCategoryTab({ category, nextLabel, onNext }) {
  const { state, actions } = useStrategy()
  const [form, setForm] = useState(EMPTY_FORM)
  const [scores, setScores] = useState({
    v: DEFAULT_VRIN_SCORE,
    r: DEFAULT_VRIN_SCORE,
    i: DEFAULT_VRIN_SCORE,
    n: DEFAULT_VRIN_SCORE,
  })
  const [error, setError] = useState('')

  const list = state.resources.filter((resource) => resource.type === category.type)

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const submit = () => {
    if (!form.name.trim()) {
      setError('نام منبع را وارد کنید')
      return
    }

    actions.addResource({
      type: category.type,
      name: form.name.trim(),
      description: form.effect,
      evidence: form.evidence,
      imitation: form.imitation,
      ...scores,
    })
    setForm(EMPTY_FORM)
    setError('')
  }

  return (
    <div className="sub active" id={`b${category.code}`}>
      <div className="card">
        <h2>{category.title}</h2>
        <p className="muted">{category.description}</p>

        <div className="grid2">
          <div className="field" id={`sec-m2-${category.code}-basics`}>
            <label>{category.nameLabel}</label>
            <input
              value={form.name}
              placeholder={category.namePlaceholder}
              onChange={(event) => updateForm('name', event.target.value)}
            />
          </div>
          <div className="field">
            <label>اثر راهبردی منبع</label>
            <input
              value={form.effect}
              placeholder={category.effectPlaceholder}
              onChange={(event) => updateForm('effect', event.target.value)}
            />
          </div>
          <div className="field" id={`sec-m2-${category.code}-evidence`}>
            <label>شواهد و مقایسه با رقبا</label>
            <textarea
              value={form.evidence}
              placeholder={category.evidencePlaceholder}
              onChange={(event) => updateForm('evidence', event.target.value)}
            />
          </div>
          <div className="field">
            <label>شواهد تقلیدناپذیری / علت دشواری تقلید</label>
            <textarea
              value={form.imitation}
              placeholder={category.imitationPlaceholder}
              onChange={(event) => updateForm('imitation', event.target.value)}
            />
          </div>
        </div>

        <div className="grid2" id={`sec-m2-${category.code}-vrin`}>
          {VRIN_CRITERIA.map((criterion) => (
            <div className="field" key={criterion.key}>
              <label>{criterion.label}</label>
              <select
                value={scores[criterion.key]}
                onChange={(event) =>
                  setScores((prev) => ({ ...prev, [criterion.key]: Number(event.target.value) }))
                }
              >
                {VRIN_SCALE.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {error ? <p className="field-error">{error}</p> : null}

        <div className="rowbtn">
          <Button variant="primary" onClick={submit}>
            {category.addLabel}
          </Button>
          <Button onClick={onNext}>{nextLabel}</Button>
        </div>

        <div id={`sec-m2-${category.code}-list`}>
          {list.length ? (
            <>
              <h3>منابع ثبت‌شده در این دسته</h3>
              {list.map((resource) => (
                <div className="resource" key={resource.id}>
                  <b>{resource.name}</b>
                  <div className="small">{resource.description || 'اثر راهبردی ثبت نشده'}</div>
                  <div className="grid2">
                    <div>ارزشمندی: {resource.v}/۵</div>
                    <div>کمیابی: {resource.r}/۵</div>
                    <div>تقلیدناپذیری: {resource.i}/۵</div>
                    <div>جایگزین‌ناپذیری: {resource.n}/۵</div>
                  </div>
                  <p className="small">
                    شواهد: {resource.evidence || 'ثبت نشده'}
                    <br />
                    سازوکار تقلیدناپذیری: {resource.imitation || 'ثبت نشده'}
                  </p>
                  <Button onClick={() => actions.removeResource(resource.id)}>حذف منبع</Button>
                </div>
              ))}
            </>
          ) : (
            <p className="small">هنوز منبعی در این دسته ثبت نشده است.</p>
          )}
        </div>
      </div>
    </div>
  )
}
