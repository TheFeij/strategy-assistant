import './utils/chartSetup'
import { StrategyProvider, useStrategy } from './state/StrategyContext'
import Header from './components/layout/Header'
import BreadcrumbBar from './components/layout/BreadcrumbBar'
import HomeView from './components/home/HomeView'
import Module1 from './components/mod1/Module1'
import Module2 from './components/mod2/Module2'
import Module3 from './components/mod3/Module3'

function Views() {
  const { view } = useStrategy()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <BreadcrumbBar />
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        {view === 'home' && <HomeView />}
        {view === 'mod1' && <Module1 />}
        {view === 'mod2' && <Module2 />}
        {view === 'mod3' && <Module3 />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <StrategyProvider>
      <Views />
    </StrategyProvider>
  )
}
