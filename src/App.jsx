import { StrategyProvider } from './state/StrategyContext'
import { NavigationProvider } from './state/NavigationContext'
import { useHashRoute } from './hooks/useHashRoute'
import TopBar from './components/layout/TopBar'
import Sidebar from './components/layout/Sidebar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import IndustryPage from './pages/IndustryPage'
import FirmPage from './pages/FirmPage'
import ComboPage from './pages/ComboPage'

export default function App() {
  const [page, navigate] = useHashRoute()

  return (
    <StrategyProvider>
      <NavigationProvider>
        <div className="shell">
          <TopBar />
          <Sidebar page={page} onNavigate={navigate} />
          <div className="content-frame">
            <main className="content-scroll">
              <HomePage active={page === 'home'} onNavigate={navigate} />
              <IndustryPage active={page === 'm1'} onNavigate={navigate} />
              <FirmPage active={page === 'm2'} onNavigate={navigate} />
              <ComboPage active={page === 'm3'} onNavigate={navigate} />
              <Footer />
            </main>
          </div>
        </div>
      </NavigationProvider>
    </StrategyProvider>
  )
}
