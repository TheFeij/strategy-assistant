import BoundaryTab from '../components/industry/BoundaryTab'
import ForcesTab from '../components/industry/ForcesTab'
import ProfitabilityTab from '../components/industry/ProfitabilityTab'
import IndustryResultTab from '../components/industry/IndustryResultTab'
import { MODULE_TABS } from '../data/modules'
import { useModuleTab } from '../state/NavigationContext'

export default function IndustryPage({ active, onNavigate }) {
  const [tab, setTab] = useModuleTab('m1')
  const tabLabel = MODULE_TABS.m1.find((item) => item.id === tab)?.label ?? ''

  return (
    <section className={active ? 'page active' : 'page'} id="m1">
      <div className="hero">
        <span className="eyebrow">ماژول ۱ · {tabLabel}</span>
        <h1>ماژول ۱ | تحلیل جذابیت صنعت</h1>
        <p className="muted">چارچوب پنج نیروی رقابتی پورتر (۲۰۰۸)</p>
      </div>

      {tab === 'a1' && <BoundaryTab onNext={() => setTab('a2')} />}
      {tab === 'a2' && <ForcesTab onBack={() => setTab('a1')} onNext={() => setTab('a3')} />}
      {tab === 'a3' && <ProfitabilityTab onBack={() => setTab('a2')} onNext={() => setTab('a4')} />}
      {tab === 'a4' && <IndustryResultTab onEdit={() => setTab('a3')} onNavigate={onNavigate} />}
    </section>
  )
}
