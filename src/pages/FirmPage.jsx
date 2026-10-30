import { RESOURCE_CATEGORIES } from '../data/resources'
import { MODULE_TABS } from '../data/modules'
import Note from '../components/ui/Note'
import ResourceCategoryTab from '../components/firm/ResourceCategoryTab'
import FirmResultTab from '../components/firm/FirmResultTab'
import { useModuleTab } from '../state/NavigationContext'

const NEXT_LABELS = [
  'بعدی: منابع انسانی ←',
  'بعدی: منابع سازمانی ←',
  'مشاهده امتیاز پایداری منابع ←',
]

export default function FirmPage({ active, onNavigate }) {
  const [tab, setTab] = useModuleTab('m2')
  const tabs = MODULE_TABS.m2
  const tabLabel = tabs.find((item) => item.id === tab)?.label ?? ''

  const categoryTabId = (code) =>
    tabs[RESOURCE_CATEGORIES.findIndex((category) => category.code === code)]?.id

  return (
    <section className={active ? 'page active' : 'page'} id="m2">
      <div className="hero">
        <span className="eyebrow">ماژول ۲ · {tabLabel}</span>
        <h1>ماژول ۲ | تحلیل منابع و مزیت بنگاه</h1>
        <p className="muted">
          بارنی (۱۹۹۱): منابع فیزیکی، انسانی و سازمانی؛ سپس ارزیابی ظرفیت مزیت رقابتی پایدار با معیارهای VRIN
        </p>
      </div>

      <div className="card">
        <h3>منطق ارزیابی منابع</h3>
        <p>
          ابتدا منابع هر دسته را جداگانه ثبت کنید. برای هر منبع، چهار معیار ارزشمندی، کمیابی، تقلیدناپذیری و
          جایگزین‌ناپذیری از ۱ تا ۵ ارزیابی می‌شود. تقلیدناپذیری باید با یکی یا چند سازوکار قابل توضیح باشد: شرایط
          تاریخی منحصربه‌فرد، پیچیدگی اجتماعی یا ابهام علّی. امتیاز بالا به‌تنهایی اثبات مزیت پایدار نیست و به شواهد
          و مقایسه با رقبا نیاز دارد.
        </p>
        <Note variant="ai">
          <b>کاربرد هوش مصنوعی:</b> متن گزارش‌ها، اسناد، پتنت‌ها و مصاحبه‌ها را برای شناسایی منابع محتمل تحلیل کنید؛
          سپس برای هر معیار شواهد موافق و مخالف، منبع، تاریخ و سطح اطمینان بخواهید. در نبود شواهد کافی، نتیجه باید
          «نامشخص» باشد؛ هوش مصنوعی در این فایل به سرویس زنده متصل نیست.
        </Note>
      </div>

      {RESOURCE_CATEGORIES.map((category, index) =>
        tab === tabs[index]?.id ? (
          <ResourceCategoryTab
            key={category.code}
            category={category}
            nextLabel={NEXT_LABELS[index]}
            onNext={() =>
              setTab(index === RESOURCE_CATEGORIES.length - 1 ? 'b4' : tabs[index + 1].id)
            }
          />
        ) : null,
      )}

      {tab === 'b4' && <FirmResultTab onReview={(code) => setTab(categoryTabId(code))} onNavigate={onNavigate} />}
    </section>
  )
}
