import { Radar } from 'react-chartjs-2'
import { useStrategy } from '../../state/StrategyContext'
import { forceShortNames } from '../../data/porter'
import { IRAN_ROIC_BENCHMARK } from '../../data/iranIndustries'
import { toFaNumber } from '../../utils/numbers'

export default function TabResult() {
  const {
    IS_current,
    IS_future,
    bindingForceName,
    bindingForceScore,
    F_cur_arr,
    F_fut_arr,
    firmRoic,
    indRoicEffective,
    porterStrategyTitle,
    porterStrategyBody,
    navigate,
  } = useStrategy()

  const radarData = {
    labels: forceShortNames,
    datasets: [
      {
        label: 'فشار فعلی نیروها',
        data: F_cur_arr,
        backgroundColor: 'rgba(40,120,168,0.18)',
        borderColor: '#2878A8',
        borderWidth: 2,
        pointBackgroundColor: '#2878A8',
      },
      {
        label: 'فشار آینده (پس از ۴ فاکتور)',
        data: F_fut_arr,
        backgroundColor: 'rgba(20,125,120,0.18)',
        borderColor: '#147D78',
        borderDash: [4, 4],
        borderWidth: 2,
        pointBackgroundColor: '#147D78',
      },
    ],
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 14, font: { size: 13 } } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${toFaNumber(ctx.parsed.r)}` } },
    },
    scales: {
      r: {
        min: 1,
        max: 5,
        ticks: {
          display: false,
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm flex flex-col">
        <div className="border-b border-line pb-2 mb-3">
          <p className="text-xs text-muted">
            عدد ۱ یعنی فشار کم (سودآوری بالا) و عدد ۵ یعنی فشار شدید (سودآوری پایین)
          </p>
        </div>
        <div className="relative flex-1 min-h-[280px] flex items-center justify-center">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-line shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-industry-50 p-3 rounded-2xl border border-industry-100 text-center">
              <div className="text-xs text-muted">امتیاز فعلی صنعت</div>
              <div className="text-3xl font-black text-industry-800 mt-1">
                {IS_current != null ? toFaNumber(IS_current) : '—'}
              </div>
            </div>
            <div className="bg-brand-50 p-3 rounded-2xl border border-brand-100 text-center">
              <div className="text-xs text-muted">امتیاز آینده صنعت</div>
              <div className="text-3xl font-black text-brand-800 mt-1">
                {IS_future != null ? toFaNumber(IS_future) : '—'}
              </div>
            </div>
          </div>
          <div className="bg-gold-50 border border-gold-200 rounded-2xl p-3.5 text-sm text-gold-900 leading-relaxed">
            {IS_current != null ? (
              <>
                <strong>تنگنای اصلی سودآوری صنعت:</strong> بیشترین فشار از سمت{' '}
                <strong>«{bindingForceName}»</strong> (شدت {toFaNumber(bindingForceScore.toFixed(1))} از ۵) وارد می‌شود که ۳۵٪ از
                کل
                فشار مؤثر صنعت را تعیین کرده است.
              </>
            ) : (
              'لطفاً سوالات سنجش ۵ نیروی رقابتی را تکمیل کنید تا تنگنای اصلی سودآوری صنعت مشخص شود.'
            )}
          </div>
        </div>

        <div className="bg-canvas rounded-2xl p-3.5 text-sm text-midnight-700 leading-relaxed border border-line">
          {firmRoic != null ? (
            <>
              <strong>مقایسه ROIC بنگاه و صنعت در ایران:</strong> بازده سرمایه بنگاه شما{' '}
              <strong>{toFaNumber(firmRoic.toFixed(1))}%</strong> و میانگین صنعت انتخابی در بورس ایران{' '}
              <strong>{toFaNumber(Number(indRoicEffective).toFixed(1))}%</strong> (خط مبنای کل صنایع ایران:{' '}
              {toFaNumber(IRAN_ROIC_BENCHMARK.toFixed(1))}٪)
              است.{' '}
              {firmRoic > Number(indRoicEffective)
                ? 'عملکرد مالی شما بالاتر از میانگین صنعت است که وجود مزیت رقابتی درونی در تحلیل بنگاه را تایید می‌کند.'
                : 'عملکرد مالی نزدیک یا پایین‌تر از میانگین صنعت است.'}
            </>
          ) : (
            'پس از انتخاب صنعت و پاسخ به سوالات ۵ نیروی رقابتی، سازگاری امتیاز صنعت با ROIC بورس ایران در اینجا تحلیل می‌شود.'
          )}
        </div>
      </div>

      <div className="bg-midnight text-white rounded-2xl p-4 border border-midnight-700 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="text-base font-black text-white">{porterStrategyTitle}</div>
          <p className="text-sm text-midnight-200 leading-relaxed">{porterStrategyBody}</p>
        </div>

        <button
          type="button"
          onClick={() => navigate('mod2')}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
        >
          <span>ذخیره و انتقال به تحلیل منابع بنگاه (بارنی ۱۹۹۱)</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
