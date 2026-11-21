import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  OllamaError,
  chatStream,
  defaultBaseUrl,
  listModels,
  normalizeBaseUrl,
  toErrorPayload,
} from '../services/ollamaClient'
import { buildMessages, normalizeSuggestedScoreText, parseSuggestedScore } from '../utils/aiPrompt'

const STORAGE_KEY = 'stratbi-ollama'
const DEFAULT_CONFIG = {
  baseUrl: '',
  model: '',
  temperature: 0.4,
  think: false,
  systemPrompt: '',
}

const EMPTY_CONNECTION = {
  status: 'unknown',
  models: [],
  error: null,
  checkedAt: null,
}

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_CONFIG }
    const parsed = JSON.parse(raw)
    const temperature = Number(parsed?.temperature)
    return {
      baseUrl: typeof parsed?.baseUrl === 'string' ? parsed.baseUrl : '',
      model: typeof parsed?.model === 'string' ? parsed.model : '',
      temperature: Number.isFinite(temperature) ? Math.min(1, Math.max(0, temperature)) : DEFAULT_CONFIG.temperature,
      think: parsed?.think === true,
      systemPrompt: typeof parsed?.systemPrompt === 'string' ? parsed.systemPrompt : '',
    }
  } catch (error) {
    return { ...DEFAULT_CONFIG }
  }
}

function createEmptyRequest() {
  return {
    status: 'idle',
    phase: 'idle',
    text: '',
    suggestedScore: null,
    error: null,
    question: '',
    model: '',
    startedAt: null,
    finishedAt: null,
  }
}

const AiContext = createContext(null)

export function AiProvider({ children }) {
  const [config, setConfig] = useState(loadConfig)
  const [connection, setConnection] = useState(EMPTY_CONNECTION)
  const [requests, setRequests] = useState({})
  const [settingsOpen, setSettingsOpen] = useState(false)

  const runsRef = useRef(new Map())
  const checkPromiseRef = useRef(null)
  const checkSeqRef = useRef(0)
  const runSeqRef = useRef(0)

  const effectiveBaseUrl = useMemo(
    () => normalizeBaseUrl(config.baseUrl || defaultBaseUrl()),
    [config.baseUrl],
  )

  const saveConfig = useCallback((patch) => {
    setConfig((previous) => {
      const next = { ...previous, ...(patch || {}) }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (error) {
        /* localStorage may be unavailable */
      }
      return next
    })
  }, [])

  const patchRequest = useCallback((key, updater) => {
    setRequests((previous) => {
      const current = previous[key] || createEmptyRequest()
      return {
        ...previous,
        [key]: typeof updater === 'function' ? updater(current) : { ...current, ...updater },
      }
    })
  }, [])

  const probeConnection = useCallback(
    async (baseUrl) => {
      const target = normalizeBaseUrl(baseUrl || effectiveBaseUrl)
      try {
        const models = await listModels({ baseUrl: target })
        return {
          status: models.length ? 'connected' : 'no-models',
          models,
          error: null,
          checkedAt: Date.now(),
        }
      } catch (error) {
        const payload = toErrorPayload(error)
        return {
          status: payload.code === 'offline' ? 'offline' : 'unreachable',
          models: [],
          error: payload,
          checkedAt: Date.now(),
        }
      }
    },
    [effectiveBaseUrl],
  )

  const checkConnection = useCallback(
    async ({ baseUrl } = {}) => {
      const target = normalizeBaseUrl(baseUrl || effectiveBaseUrl)
      const pending = checkPromiseRef.current
      if (pending && pending.baseUrl === target) return pending.promise

      setConnection((previous) => ({ ...previous, status: 'checking', error: null }))

      const seq = checkSeqRef.current + 1
      checkSeqRef.current = seq

      const promise = (async () => {
        const result = await probeConnection(target)
        if (checkSeqRef.current === seq) setConnection(result)
        return result
      })()

      checkPromiseRef.current = { baseUrl: target, promise }

      try {
        return await promise
      } finally {
        if (checkPromiseRef.current?.promise === promise) checkPromiseRef.current = null
      }
    },
    [effectiveBaseUrl, probeConnection],
  )

  const ask = useCallback(
    async ({ key, context, userQuestion = '' }) => {
      if (!key) return

      const model = config.model
      if (!model) {
        patchRequest(key, {
          status: 'error',
          phase: 'error',
          text: '',
          suggestedScore: null,
          error: {
            code: 'model-required',
            message: 'هنوز هیچ مدلی برای Ollama انتخاب نشده است.',
            hint: 'در تنظیمات Ollama یک مدل نصب‌شده را انتخاب کنید.',
            details: '',
          },
        })
        return
      }

      const previousRun = runsRef.current.get(key)
      previousRun?.controller.abort()

      const runId = runSeqRef.current + 1
      runSeqRef.current = runId
      const controller = new AbortController()
      runsRef.current.set(key, {
        runId,
        controller,
        context,
        userQuestion,
        startedAt: Date.now(),
      })

      patchRequest(key, {
        status: 'thinking',
        phase: 'waiting',
        text: '',
        suggestedScore: null,
        error: null,
        question: userQuestion,
        model,
        startedAt: Date.now(),
        finishedAt: null,
      })

      let fullText = ''
      let pushedText = ''
      let flushTimer = null
      let lastFlush = 0
      let sawThinking = false
      const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())

      const pushText = () => {
        flushTimer = null
        if (runsRef.current.get(key)?.runId !== runId) return
        if (fullText === pushedText) return
        pushedText = fullText
        lastFlush = now()
        patchRequest(key, (current) => ({ ...current, status: 'streaming', phase: 'answer', text: fullText }))
      }

      const scheduleText = () => {
        if (flushTimer) return
        const elapsed = now() - lastFlush
        if (elapsed >= 48) {
          pushText()
          return
        }
        flushTimer = setTimeout(pushText, Math.max(16, 48 - elapsed))
      }

      try {
        const messages = buildMessages(context, userQuestion, config.systemPrompt)

        await chatStream({
          baseUrl: effectiveBaseUrl,
          model,
          messages,
          temperature: config.temperature,
          think: config.think,
          signal: controller.signal,
          onThinking: () => {
            if (runsRef.current.get(key)?.runId !== runId) return
            if (sawThinking) return
            sawThinking = true
            patchRequest(key, (current) =>
              current.phase === 'reasoning' ? current : { ...current, phase: 'reasoning' },
            )
          },
          onToken: (token) => {
            if (runsRef.current.get(key)?.runId !== runId) return
            fullText += token
            scheduleText()
          },
        })

        if (runsRef.current.get(key)?.runId !== runId) return
        if (flushTimer) clearTimeout(flushTimer)
        flushTimer = null

        const finalText = fullText.trim()
        if (!finalText) {
          throw new OllamaError(
            'empty-response',
            'مدل پاسخی تولید نکرد.',
            'دوباره تلاش کنید یا مدل دیگری انتخاب کنید.',
          )
        }

        const suggestedScore = parseSuggestedScore(finalText)
        const normalizedText = normalizeSuggestedScoreText(finalText, suggestedScore)

        patchRequest(key, {
          status: 'done',
          phase: 'done',
          text: normalizedText,
          suggestedScore,
          error: null,
          finishedAt: Date.now(),
        })
      } catch (error) {
        if (flushTimer) clearTimeout(flushTimer)
        flushTimer = null

        if (runsRef.current.get(key)?.runId !== runId) return

        if (error?.name === 'AbortError' || error?.code === 'aborted') {
          patchRequest(key, { status: 'aborted', phase: 'aborted', finishedAt: Date.now() })
          return
        }

        const payload = toErrorPayload(error)
        patchRequest(key, { status: 'error', phase: 'error', error: payload, finishedAt: Date.now() })

        if (payload.code === 'unreachable' || payload.code === 'offline') {
          setConnection((previous) => ({
            ...previous,
            status: payload.code === 'offline' ? 'offline' : 'unreachable',
            error: payload,
            checkedAt: Date.now(),
          }))
        }
      }
    },
    [config.model, config.systemPrompt, config.temperature, config.think, effectiveBaseUrl, patchRequest],
  )

  const cancel = useCallback(
    (key) => {
      const run = runsRef.current.get(key)
      if (!run) return
      run.controller.abort()
      patchRequest(key, (current) => {
        if (current.status === 'thinking' || current.status === 'streaming') {
          return { ...current, status: 'aborted', phase: 'aborted', finishedAt: Date.now() }
        }
        return current
      })
    },
    [patchRequest],
  )

  const retry = useCallback(
    (key) => {
      const run = runsRef.current.get(key)
      if (!run) return false
      ask({ key, context: run.context, userQuestion: run.userQuestion })
      return true
    },
    [ask],
  )

  const clearRequest = useCallback((key) => {
    runsRef.current.delete(key)
    setRequests((previous) => {
      if (!previous[key]) return previous
      const next = { ...previous }
      delete next[key]
      return next
    })
  }, [])

  const openSettings = useCallback(() => setSettingsOpen(true), [])
  const closeSettings = useCallback(() => setSettingsOpen(false), [])

  useEffect(() => {
    checkConnection()
  }, [checkConnection])

  useEffect(() => {
    const handleOnline = () => checkConnection()
    const handleOffline = () =>
      setConnection((previous) => ({
        ...previous,
        status: 'offline',
        error: {
          code: 'offline',
          message: 'اتصال شبکه قطع است.',
          hint: 'اتصال شبکه را برقرار کنید و دوباره تلاش کنید.',
          details: '',
        },
        checkedAt: Date.now(),
      }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [checkConnection])

  const models = connection.models || []
  const hasModel = Boolean(config.model)
  const selectedModelAvailable = hasModel && models.some((model) => model.name === config.model)
  const isReady = hasModel && (connection.status === 'connected' ? selectedModelAvailable : connection.status === 'unknown')

  const value = {
    config,
    saveConfig,
    connection,
    models,
    hasModel,
    selectedModelAvailable,
    isReady,
    effectiveBaseUrl,
    requests,
    ask,
    cancel,
    retry,
    clearRequest,
    checkConnection,
    probeConnection,
    settingsOpen,
    openSettings,
    closeSettings,
  }

  return <AiContext.Provider value={value}>{children}</AiContext.Provider>
}

export function useAi() {
  const context = useContext(AiContext)
  if (!context) throw new Error('useAi must be used inside AiProvider')
  return context
}
