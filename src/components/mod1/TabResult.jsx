import { Radar } from 'react-chartjs-2'
import { useStrategy } from '../../state/StrategyContext'
import { forceShortNames } from '../../data/porter'
import { IRAN_ROIC_BENCHMARK } from '../../data/iranIndustries'

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
        backgroundColor: 'rgba(79,70,229,0.2)',
        borderColor: '#4f46e5',
        borderWidth: 2,
        pointBackgroundColor: '#4f46e5',
      },
      {
        label: 'فشار آینده (پس از ۴ فاکتور)',
        data: F_fut_arr,
        backgroundColor: 'rgba(13,148,136,0.2)',
        borderColor: '#0d9488',
        borderDash: [4, 4],
        borderWidth: 2,
        pointBackgroundColor: '#0d9488',
      },
    ],
  }

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } },
    scales: { r: { min: 1, max: 5, ticks: { stepSize: 1, backdropColor: 'transparent' } } },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col">
        <div className="border-b border-slate-100 pb-2 mb-3">
          <h4 className="text-sm font-black text-slate-900">رادار ۵ نیروی رقابتی (وضعیت فعلی در برابر آینده)</h4>
          <p className="text-[11px] text-slate-500">
            عدد ۱ یعنی فشار کم (سودآوری بالا) و عدد ۵ یعنی فشار شدید (سودآوری پایین)
          </p>
        </div>
        <div className="relative flex-1 min-h-[280px] flex items-center justify-center">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="border-b border-slate-100 pb-2 mb-3">
            <h4 className="text-sm font-black text-slate-900">فرمول امتیاز جذابیت صنعت (با جریمه تنگناترین نیرو)</h4>
            <p className="text-[11px] text-slate-500">
              فشار مؤثر صنعت = ۶۵٪ میانگین ۵ نیرو + ۳۵٪ شدیدترین نیروی تنگناکننده
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-100 text-center">
              <div className="text-xs text-slate-600">امتیاز فعلی صنعت</div>
              <div className="text-3xl font-black text-indigo-800 mt-1">{IS_current ?? '—'}</div>
            </div>
            <div className="bg-teal-50 p-3 rounded-2xl border border-teal-100 text-center">
              <div className="text-xs text-slate-600">امتیاز آینده صنعت</div>
              <div className="text-3xl font-black text-teal-800 mt-1">{IS_future ?? '—'}</div>
            </div>
          </div>
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-900 leading-relaxed">
            {IS_current != null ? (
              <>
                <strong>تنگنای اصلی سودآوری صنعت:</strong> بیشترین فشار از سمت{' '}
                <strong>«{bindingForceName}»</strong> (شدت {bindingForceScore.toFixed(1)} از ۵) وارد می‌شود که ۳۵٪ از کل
                فشار مؤثر صنعت را تعیین کرده است.
              </>
            ) : (
              'لطفاً سوالات تب ۲ را تکمیل کنید تا تنگنای اصلی سودآوری صنعت مشخص شود.'
            )}
          </div>
        </div>

        <div className="bg-slate-100 rounded-2xl p-3.5 text-xs text-slate-700 leading-relaxed border border-slate-200">
          {firmRoic != null ? (
            <>
              <strong>مقایسه ROIC بنگاه و صنعت در ایران:</strong> بازده سرمایه بنگاه شما{' '}
              <strong>{firmRoic.toFixed(1)}%</strong> و میانگین صنعت انتخابی در بورس ایران{' '}
              <strong>{Number(indRoicEffective).toFixed(1)}%</strong> (خط مبنای کل صنایع ایران: {IRAN_ROIC_BENCHMARK.toFixed(1)}٪)
              است.{' '}
              {firmRoic > Number(indRoicEffective)
                ? 'عملکرد مالی شما بالاتر از میانگین صنعت است که وجود مزیت رقابتی درونی در ماژول ۲ را تایید می‌کند.'
                : 'عملکرد مالی نزدیک یا پایین‌تر از میانگین صنعت است.'}
            </>
          ) : (
            'پس از انتخاب صنعت در تب ۱ و پاسخ به سوالات تب ۲، سازگاری امتیاز صنعت با ROIC بورس ایران در اینجا تحلیل می‌شود.'
          )}
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <span className="text-xs font-bold text-amber-400">بیانیه استراتژی در سطح صنعت (مقاله پورتر ۲۰۰۸)</span>
          <div className="text-base font-black text-white">{porterStrategyTitle}</div>
          <p className="text-xs text-slate-300 leading-relaxed">{porterStrategyBody}</p>
        </div>

        <button
          type="button"
          onClick={() => navigate('mod2')}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
        >
          <span>ذخیره و انتقال به ماژول ۲: تحلیل منابع بنگاه (بارنی ۱۹۹۱)</span>
          <span>←</span>
        </button>
      </div>
    </div>
  )
}
