import { useEffect, useState } from 'react'
import { PAGES } from '../data/constants'

const PAGE_IDS = PAGES.map((page) => page.id)

const readPage = () => {
  const id = window.location.hash.replace('#', '')
  return PAGE_IDS.includes(id) ? id : 'home'
}

/**
 * Minimal hash router: keeps the current module in the URL so a refresh or a
 * shared link reopens the same view, without pulling in a routing dependency.
 */
export function useHashRoute() {
  const [page, setPage] = useState(readPage)

  useEffect(() => {
    const onHashChange = () => setPage(readPage())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const navigate = (id) => {
    if (window.location.hash !== `#${id}`) {
      window.location.hash = id
    } else {
      setPage(id)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return [page, navigate]
}
