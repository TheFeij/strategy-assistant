import { Fragment, useEffect, useRef, useState } from 'react'
import { PAGES } from '../../data/constants'
import { MODULE_TABS } from '../../data/modules'
import { SECTIONS } from '../../data/sections'
import { useNavigation } from '../../state/NavigationContext'

const ICONS = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </>
  ),
  m1: (
    <>
      <path d="M4 20V11" />
      <path d="M10 20V4" />
      <path d="M16 20v-6" />
      <path d="M22 20H2" />
    </>
  ),
  m2: (
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  m3: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
}

const Chevron = ({ open }) => (
  <svg
    className={open ? 'side-caret open' : 'side-caret'}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export default function Sidebar({ page, onNavigate }) {
  const { tabs, setTab } = useNavigation()
  const activeTab = tabs[page]
  const sections = page === 'home' ? [] : SECTIONS[page]?.[activeTab] ?? []

  const [activeSection, setActiveSection] = useState(null)
  const [openModules, setOpenModules] = useState(
    () => new Set(page === 'home' ? [] : [page]),
  )
  const [openTabs, setOpenTabs] = useState(
    () => new Set(page === 'home' ? [] : [tabs[page]]),
  )
  const pendingSection = useRef(null)

  // Keep only the active module expanded, so opening a module closes the others.
  useEffect(() => {
    if (page === 'home') return
    setOpenModules(new Set([page]))
  }, [page])

  // Keep the active tab's subtree expanded.
  useEffect(() => {
    if (page === 'home') return
    const tabId = tabs[page]
    setOpenTabs((prev) => (prev.has(tabId) ? prev : new Set(prev).add(tabId)))
  }, [page, tabs])

  // Highlight the subsection currently at the top of the reading area.
  useEffect(() => {
    if (!sections.length) {
      setActiveSection(null)
      return undefined
    }

    setActiveSection(sections[0].id)
    const ids = sections.map((section) => section.id)

    const update = () => {
      const offset = 90
      const scroller = document.querySelector('.content-scroll')
      const inner = scroller && getComputedStyle(scroller).overflowY !== 'visible'
      let current = ids[0]

      if (inner) {
        const top = scroller.getBoundingClientRect().top

        ids.forEach((id) => {
          const element = document.getElementById(id)
          if (element && element.getBoundingClientRect().top - top <= offset) current = id
        })

        // Near the end of a short page the last section can never reach the
        // offset line, so treat the bottom of the scroll as the last section.
        const atBottom =
          scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2
        if (atBottom) current = ids[ids.length - 1]
      } else {
        ids.forEach((id) => {
          const element = document.getElementById(id)
          if (element && element.getBoundingClientRect().top <= offset) current = id
        })

        const atBottom =
          window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
        if (atBottom) current = ids[ids.length - 1]
      }

      setActiveSection((prev) => (prev === current ? prev : current))
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        update()
      })
    }

    update()
    const scroller = document.querySelector('.content-scroll')
    window.addEventListener('scroll', onScroll, { passive: true })
    scroller?.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      scroller?.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeTab])

  // Scroll to a section that lives on a tab/module we just switched to.
  useEffect(() => {
    const id = pendingSection.current
    if (!id) return
    pendingSection.current = null
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [page, activeTab])

  const toggleIn = (setter, id) => {
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const goToModule = (moduleId) => {
    onNavigate(moduleId)
    setOpenModules(new Set([moduleId]))
  }

  // Modules behave as an accordion: opening one closes all the others.
  const toggleModule = (moduleId) => {
    setOpenModules((prev) => (prev.has(moduleId) ? new Set() : new Set([moduleId])))
  }

  const selectTab = (moduleId, tabId) => {
    if (page !== moduleId) onNavigate(moduleId)
    setTab(moduleId, tabId)
    setOpenTabs((prev) => (prev.has(tabId) ? prev : new Set(prev).add(tabId)))
  }

  const goToSection = (moduleId, tabId, sectionId) => {
    setActiveSection(sectionId)
    setOpenTabs((prev) => (prev.has(tabId) ? prev : new Set(prev).add(tabId)))

    const samePage = page === moduleId
    const sameTab = tabs[moduleId] === tabId

    if (!samePage) onNavigate(moduleId)
    if (!sameTab) setTab(moduleId, tabId, { scroll: false })

    if (samePage && sameTab) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      pendingSection.current = sectionId
    }
  }

  return (
    <aside className="side">
      <div className="side-brand">
        <span className="side-mark" aria-hidden="true">
          S
        </span>
        <div>
          <div className="side-name">STRATEGY</div>
          <div className="side-caption">مرکز تحلیل و تصمیم</div>
        </div>
      </div>

      <div className="side-menu">
        {PAGES.map((item) => {
          const isActive = item.id === page
          const isOpen = openModules.has(item.id)
          const moduleTabs = MODULE_TABS[item.id] ?? []

          return (
            <Fragment key={item.id}>
              <div className={isActive ? 'side-item active' : 'side-item'}>
                <button type="button" className="side-item-main" onClick={() => goToModule(item.id)}>
                  <span className="nav-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {ICONS[item.id]}
                    </svg>
                  </span>
                  <span className="side-item-label">{item.label}</span>
                </button>

                {moduleTabs.length > 0 ? (
                  <button
                    type="button"
                    className="side-item-toggle"
                    aria-expanded={isOpen}
                    aria-label={isOpen ? `بستن ${item.label}` : `باز کردن ${item.label}`}
                    onClick={() => toggleModule(item.id)}
                  >
                    <Chevron open={isOpen} />
                  </button>
                ) : null}
              </div>

              {isOpen && moduleTabs.length > 0 ? (
                <nav className="side-tree side-tree-tabs" aria-label={`مراحل ${item.label}`}>
                  {moduleTabs.map((tab) => {
                    const isActiveTab = isActive && tabs[item.id] === tab.id
                    const isTabOpen = openTabs.has(tab.id)
                    const leafs = SECTIONS[item.id]?.[tab.id] ?? []

                    return (
                      <div className="tree-group" key={tab.id}>
                        <div className={isActiveTab ? 'side-tab-row active' : 'side-tab-row'}>
                          <button
                            type="button"
                            className="side-tab"
                            onClick={() => selectTab(item.id, tab.id)}
                          >
                            {tab.label}
                          </button>

                          {leafs.length > 0 ? (
                            <button
                              type="button"
                              className="side-tab-toggle"
                              aria-expanded={isTabOpen}
                              aria-label={isTabOpen ? `بستن ${tab.label}` : `باز کردن ${tab.label}`}
                              onClick={() => toggleIn(setOpenTabs, tab.id)}
                            >
                              <Chevron open={isTabOpen} />
                            </button>
                          ) : null}
                        </div>

                        {isTabOpen && leafs.length > 0 ? (
                          <nav className="side-tree side-tree-subs" aria-label={`زیربخش‌های ${tab.label}`}>
                            {leafs.map((section) => (
                              <button
                                key={section.id}
                                type="button"
                                className={section.id === activeSection ? 'side-sub active' : 'side-sub'}
                                data-target={section.id}
                                aria-current={section.id === activeSection ? 'location' : undefined}
                                onClick={() => goToSection(item.id, tab.id, section.id)}
                              >
                                {section.label}
                              </button>
                            ))}
                          </nav>
                        ) : null}
                      </div>
                    )
                  })}
                </nav>
              ) : null}
            </Fragment>
          )
        })}
      </div>

      <div className="side-note">
        <span className="status-dot" aria-hidden="true" />
        داده‌ها محلی · اتصال AI فعال نیست
      </div>
    </aside>
  )
}
