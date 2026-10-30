import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const NavigationContext = createContext(null)

const DEFAULT_TABS = {
  m1: 'a1',
  m2: 'b1',
  m3: 'c1',
}

export function NavigationProvider({ children }) {
  const [tabs, setTabs] = useState(DEFAULT_TABS)

  const setTab = useCallback((moduleId, tabId, options = {}) => {
    setTabs((prev) => (prev[moduleId] === tabId ? prev : { ...prev, [moduleId]: tabId }))
    if (options.scroll === false) return

    const scroller = document.querySelector('.content-scroll')
    if (scroller && getComputedStyle(scroller).overflowY !== 'visible') {
      scroller.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const value = useMemo(() => ({ tabs, setTab }), [tabs, setTab])

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) throw new Error('useNavigation must be used inside <NavigationProvider>')
  return context
}

/** Keeps the active sub-tab of a module in shared state so the sidebar can follow it. */
export function useModuleTab(moduleId) {
  const { tabs, setTab } = useNavigation()
  const selectTab = useCallback((tabId) => setTab(moduleId, tabId), [moduleId, setTab])
  return [tabs[moduleId], selectTab]
}
