import { useMemo } from 'react'
import { useStrategy } from './StrategyContext'
import { buildWorkspace } from '../utils/aiContext'

/**
 * Shared, memoized workspace snapshot for AI prompts.
 * The whole strategy context is passed so the snapshot can include every
 * filled answer across the four modules (not just the current page).
 */
export function useAiWorkspace() {
  const strategy = useStrategy()

  return useMemo(() => buildWorkspace(strategy), [strategy])
}
