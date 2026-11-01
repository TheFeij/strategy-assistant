import './utils/chartSetup'
import { StrategyProvider, useStrategy } from './state/StrategyContext'
import Header from './components/layout/Header'
import BreadcrumbBar from './components/layout/BreadcrumbBar'
import ParticleBackground from './components/layout/ParticleBackground'
import HomeView from './components/home/HomeView'
import Module1 from './components/mod1/Module1'
import Module2 from './components/mod2/Module2'
import Module3 from './components/mod3/Module3'

function Views() {
  const { view } = useStrategy()

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <BreadcrumbBar />
        <main className="max-w-[84rem] w-full mx-auto px-3 sm:px-5 py-4 flex-1">
          {view === 'home' && <HomeView />}
          {view === 'mod1' && <Module1 />}
          {view === 'mod2' && <Module2 />}
          {view === 'mod3' && <Module3 />}
        </main>
      </div>
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
