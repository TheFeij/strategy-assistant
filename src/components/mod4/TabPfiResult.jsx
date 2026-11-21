import { Doughnut } from 'react-chartjs-2'
import { useStrategy } from '../../state/StrategyContext'
import { toFaNumber } from '../../utils/numbers'

const SHARE_LABELS = ['سهم بنگاه ما', 'دارایی‌های مکمل', 'تقلیدکنندگان و رقبا']
const SHARE_COLORS_LIGHT = ['#101D30', '#147D78', '#8BA3BB']
const SHARE_COLORS_DARK = ['#C3D1DF', '#3AA9A3', '#6BAAD0']

export default function TabPfiResult() {
  const {
    theme,
    pfiAnsweredCount,
    pfiFirmShare,
    pfiCompShare,
    pfiImitatorShare,
    pfiWinnerLabel,
    pfiAppStatus,
    pfiDomStatus,
    pfiCompStatus,
    pfiOwnStatus,
    pfiStrategyTitle,
    pfiStrategyBody,
    pfiActionBullets,
  } = useStrategy()

  const hasResult = pfiAnsweredCount > 0
  const shares = hasResult ? [pfiFirmShare, pfiCompShare, pfiImitatorShare] : [0, 0, 0]
  const shareColors = theme === 'dark' ? SHARE_COLORS_DARK : SHARE_COLORS_LIGHT

  const doughnutData = {
    labels: SHARE_LABELS,
    datasets: [
      {
        data: shares,
        backgroundColor: shareColors,
        borderWidth: 2,
        borderColor: theme === 'dark' ? '#16283F' : '#ffffff',
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 8 },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    cutout: '58%',
  }

  const paramRows = [
    { label: 'نظام صیانت', value: pfiAppStatus },
    { label: 'طراحی غالب', value: pfiDomStatus },
    {
      label: 'دارایی مکمل و مالکیت',
      value: [pfiCompStatus, pfiOwnStatus].filter(Boolean).join(' • ') || null,
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm flex flex-col">
        <div className="border-b border-line pb-2 mb-3">
          <h4 className="text-sm font-black text-midnight-900">سهم سود عاید چه کسی می‌شود؟</h4>
          <p className="text-xs text-muted">توزیع سود نوآوری میان بنگاه، صاحبان دارایی مکمل و تقلیدکنندگان</p>
        </div>

        {hasResult ? (
          <>
            <div className="relative mx-auto w-full max-w-[320px] flex-1 min-h-[250px] flex items-center justify-center">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
            <div className="mt-4 grid gap-2 border-t border-line pt-3 text-xs">
              {SHARE_LABELS.map((label, idx) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-bold text-midnight-800">
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-sm"
                      style={{ backgroundColor: shareColors[idx] }}
                    />
                    {label}
                  </span>
                  <strong className="text-midnight-900">{toFaNumber(shares[idx])}٪</strong>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-1 min-h-[250px] items-center justify-center rounded-xl border border-dashed border-line bg-canvas p-6 text-center text-sm text-muted">
            پس از پاسخ به سوالات، توزیع سود نوآوری اینجا نمایش داده می‌شود.
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="border-b border-line pb-2">
            <h4 className="text-sm font-black text-midnight-900">جمع‌بندی سه پارامتر چارچوب PFI</h4>
          </div>
          <div className="space-y-2 text-xs">
            {paramRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-2 rounded-xl border border-line bg-canvas px-3 py-2.5"
              >
                <span className="text-muted">{row.label}</span>
                <strong className="text-left text-midnight-800">{row.value || '—'}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-brand-900">
          <div className="text-xs font-bold">ذی‌نفع غالب فعلی سود نوآوری</div>
          <div className="mt-1 text-base font-black">{pfiWinnerLabel}</div>
        </div>
      </div>

      <div className="bg-midnight text-white rounded-2xl p-4 border border-midnight-700 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <span className="text-xs font-bold text-gold-300">استراتژی پیشنهادی برای کسب سود</span>
          <div className="text-base font-black leading-7 text-white">{pfiStrategyTitle}</div>
          <p className="text-sm leading-relaxed text-midnight-200">{pfiStrategyBody}</p>
          {pfiActionBullets.length > 0 && (
            <ul className="space-y-1.5 border-t border-midnight-700 pt-3 text-xs text-midnight-100">
              {pfiActionBullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 leading-relaxed">
                  <span aria-hidden="true" className="text-brand-300">
                    •
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
        >
          <span>🖨</span>
          <span>چاپ / خروجی PDF</span>
        </button>
      </div>
    </div>
  )
}
