import ComboOverviewTab from '../components/combo/ComboOverviewTab'
import ComboLogicTab from '../components/combo/ComboLogicTab'
import ComboResultTab from '../components/combo/ComboResultTab'
import { MODULE_TABS } from '../data/modules'
import { useModuleTab } from '../state/NavigationContext'

export default function ComboPage({ active, onNavigate }) {
  const [tab, setTab] = useModuleTab('m3')
  const tabLabel = MODULE_TABS.m3.find((item) => item.id === tab)?.label ?? ''

  return (
    <section className={active ? 'page active' : 'page'} id="m3">
      <div className="hero">
        <span className="eyebrow">ماژول ۳ · {tabLabel}</span>
        <h1>ماژول ۳ | ترکیب جذابیت صنعت و منابع بنگاه</h1>
        <p className="muted">
          ساختار صنعت و تفاوت منابع بنگاه مکمل یکدیگرند. فرمول ترکیب این داشبورد یک انتخاب طراحی است، نه فرمولی که
          بدون بررسی متن دقیق بتوان به پورتر و مک‌گاهان نسبت داد.
        </p>
      </div>

      {tab === 'c1' && <ComboOverviewTab onNavigate={onNavigate} onNext={() => setTab('c2')} />}
      {tab === 'c2' && <ComboLogicTab onNext={() => setTab('c3')} />}
      {tab === 'c3' && <ComboResultTab onBack={() => setTab('c2')} onNavigate={onNavigate} />}
    </section>
  )
}
