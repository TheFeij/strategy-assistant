import { useStrategy } from '../../state/StrategyContext'
import { MCGAHAN_KPIS } from '../../data/constants'
import Button from '../ui/Button'
import Field from '../ui/Field'
import Kpi from '../ui/Kpi'
import Note from '../ui/Note'

const formatShare = (share) => (share === null ? '—' : `${(share * 100).toFixed(1)}٪`)

export default function ComboLogicTab({ onNext }) {
  const { state, combo, actions } = useStrategy()
  const { industryWeight, firmWeight, industryShare, firmShare } = combo

  return (
    <div className="sub active" id="c2">
      <div className="card">
        <div id="sec-m3-logic">
          <h2>منطق ترکیب</h2>
          <p>
            ساختار صنعت بر پتانسیل سودآوری و توزیع ارزش اثر می‌گذارد؛ منابع ناهمگون و کم‌تحرک بنگاه نیز می‌توانند تفاوت
            عملکرد را توضیح دهند. یافته‌های مک‌گاهان و پورتر (۱۹۹۷) نشان می‌دهد که نباید اثر صنعت را نادیده گرفت و
            نباید همه تفاوت سودآوری را نیز به صنعت نسبت داد.
          </p>
        </div>

        <div id="sec-m3-evidence">
          <h3>یافته‌های تجربی مک‌گاهان و پورتر (۱۹۹۷)</h3>
          <p className="muted">
            تحلیل داده‌های ۵۸٬۱۳۲ بخش کسب‌وکار در دوره ۱۹۸۱ تا ۱۹۹۴؛ درصدها سهم برآوردشده از واریانس سودآوری در نمونه
            و وابسته به روش/سطح تحلیل‌اند، نه ضرایب ثابت برای همه کشورها و صنایع.
          </p>

          <div className="grid3">
            {MCGAHAN_KPIS.map((kpi) => (
              <Kpi key={kpi.label} label={kpi.label} value={kpi.value} />
            ))}
          </div>

          <Note>
            پیام مدیریتی: تحلیل پنج نیرو برای فهم جذابیت ساختاری لازم است، اما کافی نیست؛ باید عملکرد و منابع اختصاصی
            بنگاه نیز جداگانه بررسی شوند. سهم ۳۱٫۷۱٪ اثر اختصاصی بخش کسب‌وکار در این مطالعه، دلیل بررسی قابلیت‌ها و
            جایگاه رقابتی همان کسب‌وکار است؛ سهم ۱۸٫۶۸٪ اثر صنعت نیز اهمیت ساختار صنعت را نشان می‌دهد. این درصدها نه
            احتمال موفقیت‌اند، نه سهم مستقیم سود و نه وزن آماده برای فرمول داشبورد. سهم واریانس گزارش‌شده در مقاله را
            مستقیماً به‌عنوان وزن صنعت و بنگاه در داشبورد استفاده نکنید؛ این اعداد نتایج تجزیه واریانس‌اند، نه وزن‌های
            تصمیم‌گیری.
          </Note>
        </div>

        <div id="sec-m3-weights">
          <div className="grid2">
            <Field label="ضریب صنعت (پیشنهادی شما: ۳۲)">
              <input
                type="number"
                min="0"
                max="100"
                value={state.combination.industryWeight}
                onChange={(event) => actions.setCombinationField('industryWeight', event.target.value)}
              />
            </Field>
            <Field label="ضریب بنگاه (پیشنهادی شما: ۱۹)">
              <input
                type="number"
                min="0"
                max="100"
                value={state.combination.firmWeight}
                onChange={(event) => actions.setCombinationField('firmWeight', event.target.value)}
              />
            </Field>
          </div>

          <Note variant="warn">
            در این داشبورد، ضرایب {industryWeight} برای صنعت و {firmWeight} برای بنگاه مطابق انتخاب کاربر وارد شده‌اند و
            برای محاسبه امتیاز نهایی به مجموع ۱۰۰ نرمال می‌شوند؛ بنابراین سهم مؤثر آنها در امتیاز ترکیبی به‌ترتیب{' '}
            {formatShare(industryShare)} و {formatShare(firmShare)} است. توجه: این دو عدد را نباید به‌عنوان ضرایب مستقیم
            مقاله مک‌گاهان و پورتر معرفی کرد؛ مقاله حدود ۱۹٪ اثر پایدار صنعت و ۳۲٪ اثر اختصاصی بخش کسب‌وکار را در نمونه
            خود گزارش می‌کند. نتایج تجزیه واریانس، وزن آماده تصمیم‌گیری نیستند.
          </Note>

          <Field label="توجیه وزن‌ها">
            <textarea
              value={state.combination.rationale}
              placeholder="چرا در این تصمیم ساختار صنعت یا منابع بنگاه مهم‌تر است؟"
              onChange={(event) => actions.setCombinationField('rationale', event.target.value)}
            />
          </Field>
        </div>

        <div id="sec-m3-formula">
          <h3>فرمول شاخص ترکیبی</h3>
          <p className="muted">
            امتیاز ترکیبی = (وزن صنعت × امتیاز صنعت + وزن بنگاه × شاخص منابع) ÷ مجموع وزن‌ها. این میانگین وزنی ساده و
            قابل توضیح است و نباید بدون تطبیق با متن، فرمول اصلی مقاله نقد معرفی شود.
          </p>
        </div>

        <Button variant="primary" onClick={onNext}>
          محاسبه و پیشنهاد ←
        </Button>
      </div>
    </div>
  )
}
