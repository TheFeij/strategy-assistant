import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAi } from '../../state/AiContext'
import { useAiWorkspace } from '../../state/useAiWorkspace'
import { summarizeWorkspace } from '../../utils/aiContext'
import { toFaNumber } from '../../utils/numbers'

const EMPTY_REQUEST = {
  status: 'idle',
  phase: 'idle',
  text: '',
  suggestedScore: null,
  error: null,
}

const PANEL_WIDTH = 400

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      <span className="ai-thinking-dot" />
      <span className="ai-thinking-dot" />
      <span className="ai-thinking-dot" />
    </span>
  )
}

function statusText(request, connection, hasModel, modelMissing) {
  if (!hasModel) return 'برای شروع، یک مدل انتخاب کنید'
  if (modelMissing) return 'مدل انتخاب‌شده در فهرست نصب‌شده‌ها نیست'
  if (request.status === 'thinking') {
    return request.phase === 'reasoning' ? 'AI در حال استدلال است…' : 'AI در حال بررسی زمینه است…'
  }
  if (request.status === 'streaming') return 'AI در حال نوشتن پاسخ است…'
  if (request.status === 'done') return 'پاسخ آماده است'
  if (request.status === 'aborted') return 'تولید پاسخ متوقف شد'
  if (request.status === 'error') return 'دریافت پاسخ با خطا روبه‌رو شد'
  if (connection.status === 'unreachable' || connection.status === 'offline') return 'Ollama در دسترس نیست'
  if (connection.status === 'no-models') return 'هیچ مدلی روی Ollama نصب نیست'
  return 'آماده پاسخ‌گویی'
}

function triggerDotTone(request) {
  if (request.status === 'error') return 'bg-rose-500'
  if (request.status === 'thinking' || request.status === 'streaming') return 'bg-brand-500 animate-pulse'
  if (request.status === 'done') return 'bg-emerald-500'
  return 'bg-brand-400'
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function WorkspaceSummary({ workspace = {}, relatedAnswers = {} }) {
  const items = summarizeWorkspace(workspace)
  const hasUserData = workspace.hasUserData === true
  const hasProfile = workspace.hasProfile === true || Boolean(workspace.company || workspace.industry)
  const related = Object.entries(relatedAnswers).filter(
    ([, value]) => value !== null && value !== undefined && value !== '' && typeof value !== 'object',
  )

  return (
    <details className="group overflow-hidden rounded-xl border border-line bg-white dark:border-white/10 dark:bg-white/[0.03]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-[0.72rem] font-extrabold text-midnight-700 transition hover:bg-canvas/70 dark:text-midnight-100 dark:hover:bg-white/[0.05] [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <ellipse cx="12" cy="5" rx="8" ry="3" />
              <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
              <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
            </svg>
          </span>
          <span className="truncate">داده‌های ارسالی به AI</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-line bg-canvas px-2 py-0.5 text-[0.6rem] font-bold text-muted dark:border-white/10 dark:bg-white/[0.04] dark:text-midnight-300">
            {hasUserData ? 'زنده از فرم' : 'بدون پاسخ ثبت‌شده'}
          </span>
          <Chevron />
        </span>
      </summary>

      <div className="max-h-56 overflow-y-auto border-t border-line px-3 py-2.5 text-xs dark:border-white/10">
        {items.length > 0 && (
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.label} className="flex gap-1.5 leading-5">
                <span className="shrink-0 text-muted">{item.label}:</span>
                <span className="font-semibold text-midnight-700 dark:text-midnight-100">{item.value}</span>
              </li>
            ))}
          </ul>
        )}

        {related.length > 0 && (
          <p className="mt-1.5 border-t border-line pt-1.5 leading-5 text-midnight-600 dark:border-white/10 dark:text-midnight-300">
            <span className="font-bold">همین صفحه: </span>
            {related
              .slice(0, 6)
              .map(([key, value]) => `${key}=${value}`)
              .join('، ')}
          </p>
        )}

        {!hasUserData && (
          <p className="mt-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 leading-5 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
            {hasProfile
              ? 'هنوز پاسخ ماژول‌ها ثبت نشده است؛ AI بر اساس نام شرکت/صنعت، ابتدا این سوال را توضیح می‌دهد و سپس یک پیشنهاد اولیه از دانش خود ارائه می‌کند.'
              : 'هنوز اطلاعاتی ثبت نشده است. برای پاسخ مرتبط، نام شرکت/بنگاه و صنعت را در ماژول ۱ وارد کنید.'}
          </p>
        )}
      </div>
    </details>
  )
}

export default function AiConsult({
  consultKey,
  context,
  buttonLabel = '🤖 مشورت با AI',
  onApply,
  applyLabel,
  fallbackValue,
  showScore = true,
  disabled = false,
  className = '',
}) {
  const workspace = useAiWorkspace()
  const {
    config,
    requests,
    connection,
    ask,
    cancel,
    retry,
    checkConnection,
    openSettings,
    settingsOpen,
    selectedModelAvailable,
  } = useAi()

  const request = requests[consultKey] || EMPTY_REQUEST
  const finalContext = useMemo(() => ({ ...(context || {}), workspace }), [context, workspace])
  const scale = finalContext.scale || {}
  const hasModel = Boolean(config.model)
  const modelMissing = hasModel && connection.status === 'connected' && !selectedModelAvailable
  const busy = request.status === 'thinking' || request.status === 'streaming'

  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [copied, setCopied] = useState(false)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches,
  )
  const [position, setPosition] = useState({ left: 12, top: 80, width: PANEL_WIDTH, maxHeight: 480 })

  const buttonRef = useRef(null)
  const panelRef = useRef(null)
  const contentRef = useRef(null)
  const restoreFocusRef = useRef(null)
  const copyTimerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const media = window.matchMedia('(max-width: 639px)')
    const handleChange = (event) => setIsMobile(event.matches)
    setIsMobile(media.matches)
    media.addEventListener?.('change', handleChange)
    return () => media.removeEventListener?.('change', handleChange)
  }, [])

  useEffect(() => {
    setOpen(false)
    setQuestion('')
    setCopied(false)
  }, [consultKey])

  useEffect(() => {
    if (disabled) setOpen(false)
  }, [disabled])

  useEffect(
    () => () => {
      cancel(consultKey)
    },
    [consultKey, cancel],
  )

  const handleClose = useCallback(() => {
    if (busy) cancel(consultKey)
    setOpen(false)
    if (restoreFocusRef.current && typeof restoreFocusRef.current.focus === 'function') {
      restoreFocusRef.current.focus()
    }
  }, [busy, cancel, consultKey])

  const handleToggle = () => {
    if (disabled) return
    if (open) {
      handleClose()
      return
    }
    setOpen(true)
    if (connection.status === 'unknown') checkConnection()
  }

  useEffect(() => {
    if (!open || settingsOpen) return undefined

    const handlePointerDown = (event) => {
      if (panelRef.current?.contains(event.target)) return
      if (buttonRef.current?.contains(event.target)) return
      handleClose()
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') handleClose()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, settingsOpen, handleClose])

  useEffect(() => {
    if (!open) return undefined
    restoreFocusRef.current = document.activeElement
    const timer = window.setTimeout(() => panelRef.current?.focus(), 30)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open || !isMobile) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open, isMobile])

  useLayoutEffect(() => {
    if (!open || isMobile) return undefined

    const update = () => {
      const button = buttonRef.current
      if (!button) return

      const rect = button.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const width = Math.min(PANEL_WIDTH, viewportWidth - 24)
      const left = Math.min(Math.max(rect.right - width, 12), Math.max(12, viewportWidth - width - 12))
      const belowTop = rect.bottom + 8
      const belowSpace = viewportHeight - belowTop - 12
      const aboveSpace = rect.top - 20

      if (belowSpace >= 280 || belowSpace >= aboveSpace) {
        setPosition({
          left,
          width,
          top: belowTop,
          bottom: undefined,
          maxHeight: Math.max(200, belowSpace),
        })
      } else {
        setPosition({
          left,
          width,
          top: undefined,
          bottom: viewportHeight - rect.top + 8,
          maxHeight: Math.max(200, aboveSpace),
        })
      }
    }

    update()
    const handleScroll = (event) => {
      if (panelRef.current && event.target instanceof Node && panelRef.current.contains(event.target)) return
      update()
    }
    window.addEventListener('resize', update)
    window.addEventListener('scroll', handleScroll, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [open, isMobile])

  useEffect(() => {
    const element = contentRef.current
    if (!element) return
    const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 90
    if (nearBottom || request.status === 'thinking') element.scrollTop = element.scrollHeight
  }, [open, request.text, request.status])

  useEffect(
    () => () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current)
    },
    [],
  )

  const handleSend = () => {
    ask({ key: consultKey, context: finalContext, userQuestion: question.trim() })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!busy && hasModel) handleSend()
    }
  }

  const handleCopy = async () => {
    if (!request.text) return
    try {
      await navigator.clipboard.writeText(request.text)
      setCopied(true)
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current)
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 1600)
    } catch (error) {
      /* clipboard may be unavailable */
    }
  }

  const handleApply = (score) => {
    if (!onApply) return
    onApply(score)
  }

  const error = request.status === 'error' ? request.error : null
  const isScore = showScore && request.suggestedScore != null
  const normalizedFallback =
    fallbackValue != null && Number.isFinite(Number(fallbackValue))
      ? Math.round(Math.min(5, Math.max(1, Number(fallbackValue))))
      : null
  const showFallbackApply =
    Boolean(onApply) &&
    !isScore &&
    !busy &&
    (normalizedFallback != null || !showScore || Boolean(applyLabel))

  const fallbackLabel =
    normalizedFallback != null
      ? `قرار دادن عدد مرجع (${toFaNumber(normalizedFallback)})`
      : applyLabel || 'اعمال پیشنهاد'

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={disabled ? false : open}
        aria-disabled={disabled || undefined}
        aria-haspopup="dialog"
        title={
          disabled
            ? 'برای تولید استراتژی، ابتدا امتیازهای داشبورد را تکمیل کنید'
            : 'مشاوره با هوش مصنوعی محلی'
        }
        className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-extrabold text-brand-800 transition-colors hover:border-brand-300 hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-brand-200 disabled:hover:bg-brand-50 dark:border-brand-400/30 dark:bg-brand-500/15 dark:text-brand-200 dark:hover:bg-brand-500/25 dark:disabled:hover:bg-brand-500/15"
      >
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${triggerDotTone(request)}`} aria-hidden="true" />
        <span>{buttonLabel}</span>
      </button>

      {open &&
        createPortal(
          <>
            {isMobile && (
              <div
                className="fixed inset-0 z-[75] bg-midnight-950/50 backdrop-blur-sm"
                role="presentation"
                onClick={handleClose}
              />
            )}

            <div
              ref={panelRef}
              role="dialog"
              aria-modal={isMobile ? 'true' : undefined}
              aria-label="مشاور هوش مصنوعی"
              tabIndex={-1}
              onClick={(event) => event.stopPropagation()}
              style={
                isMobile
                  ? { maxHeight: '85vh' }
                  : {
                      left: `${position.left}px`,
                      width: `${position.width}px`,
                      top: position.top != null ? `${position.top}px` : undefined,
                      bottom: position.bottom != null ? `${position.bottom}px` : undefined,
                      maxHeight: `${position.maxHeight}px`,
                    }
              }
              className={
                isMobile
                  ? 'fixed inset-x-0 bottom-0 z-[80] flex flex-col overflow-hidden rounded-t-2xl border-t border-line bg-white text-ink shadow-card outline-none dark:border-midnight-600 dark:bg-midnight-900 dark:text-white'
                  : 'fixed z-[80] flex flex-col overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-card outline-none dark:border-midnight-600 dark:bg-midnight-900 dark:text-white'
              }
            >
              {isMobile && (
                <div className="flex justify-center pt-2" aria-hidden="true">
                  <span className="h-1 w-10 rounded-full bg-midnight-200 dark:bg-white/20" />
                </div>
              )}

              <div className="relative overflow-hidden border-b border-line bg-gradient-to-l from-brand-50/90 via-white to-canvas/80 px-3.5 py-3 dark:border-white/10 dark:from-brand-500/10 dark:via-midnight-900 dark:to-midnight-950">
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-l from-transparent via-brand-500/30 to-transparent" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-industry-600 text-white shadow-sm ring-1 ring-white/20">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 3l1.8 4.6L18.5 9.4 13.8 11.2 12 16l-1.8-4.8L5.5 9.4l4.7-1.8L12 3z" />
                        <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-black text-midnight-900 dark:text-white">دستیار استراتژی</p>
                        <span
                          className="max-w-[9rem] truncate rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 font-mono text-[0.6rem] text-brand-700 dark:border-brand-400/30 dark:bg-brand-500/15 dark:text-brand-200"
                          dir="ltr"
                          title={config.model || 'مدل انتخاب نشده'}
                        >
                          {config.model || 'بدون مدل'}
                        </span>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-[0.68rem] leading-5 text-muted" aria-live="polite">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${triggerDotTone(request)}`} aria-hidden="true" />
                        {statusText(request, connection, hasModel, modelMissing)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="بستن مشاور AI"
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-white hover:text-ink dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
              </div>

              <div ref={contentRef} className="min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-3 py-3">
                {!hasModel && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
                    <p className="font-extrabold">هنوز یک مدل برای Ollama انتخاب نشده است.</p>
                    <p className="mt-1">
                      برای دریافت تحلیل واقعی، در تنظیمات یک مدل نصب‌شده را انتخاب و اتصال را تست کنید.
                    </p>
                    <button
                      type="button"
                      onClick={openSettings}
                      className="mt-2 rounded-lg bg-amber-600 px-2.5 py-1.5 text-[0.7rem] font-extrabold text-white transition hover:bg-amber-700"
                    >
                      باز کردن تنظیمات Ollama
                    </button>
                  </div>
                )}

                {modelMissing && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
                    <p className="font-extrabold">
                      مدل «{config.model}» در فهرست مدل‌های نصب‌شده نیست.
                    </p>
                    <p className="mt-1">یک مدل دیگر انتخاب کنید یا این مدل را دوباره نصب کنید.</p>
                    <button
                      type="button"
                      onClick={openSettings}
                      className="mt-2 rounded-lg bg-amber-600 px-2.5 py-1.5 text-[0.7rem] font-extrabold text-white transition hover:bg-amber-700"
                    >
                      تنظیمات Ollama
                    </button>
                  </div>
                )}

                {hasModel &&
                  (connection.status === 'unreachable' || connection.status === 'offline') &&
                  request.status !== 'error' && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-6 text-rose-900 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-100">
                      <p className="font-extrabold">{connection.error?.message || 'Ollama در دسترس نیست.'}</p>
                      <p className="mt-1">
                        {connection.error?.hint ||
                          'Ollama را اجرا کنید. اگر اجراست، تنظیمات CORS را بررسی کنید.'}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => checkConnection()}
                          className="rounded-lg border border-rose-300 bg-white px-2.5 py-1.5 text-[0.7rem] font-extrabold text-rose-800 transition hover:bg-rose-100 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200"
                        >
                          تست دوباره اتصال
                        </button>
                        <button
                          type="button"
                          onClick={openSettings}
                          className="rounded-lg border border-rose-300 bg-white px-2.5 py-1.5 text-[0.7rem] font-extrabold text-rose-800 transition hover:bg-rose-100 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200"
                        >
                          تنظیمات
                        </button>
                      </div>
                    </div>
                  )}

                {hasModel && connection.status === 'no-models' && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
                    <p className="font-extrabold">هیچ مدلی روی Ollama نصب نیست.</p>
                    <p className="mt-1">یک مدل نصب کنید و سپس فهرست مدل‌ها را دوباره دریافت کنید.</p>
                    <button
                      type="button"
                      onClick={openSettings}
                      className="mt-2 rounded-lg bg-amber-600 px-2.5 py-1.5 text-[0.7rem] font-extrabold text-white transition hover:bg-amber-700"
                    >
                      تنظیمات Ollama
                    </button>
                  </div>
                )}

                <WorkspaceSummary
                  workspace={finalContext.workspace}
                  relatedAnswers={finalContext.relatedAnswers}
                />

                <details className="group overflow-hidden rounded-xl border border-line bg-white dark:border-white/10 dark:bg-white/[0.03]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-[0.72rem] font-extrabold text-midnight-700 transition hover:bg-canvas/70 dark:text-midnight-100 dark:hover:bg-white/[0.05] [&::-webkit-details-marker]:hidden">
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-industry-50 text-industry-700 dark:bg-industry-500/15 dark:text-industry-300">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </span>
                      <span className="truncate">سوال دقیق‌تر (اختیاری)</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {question.trim() ? (
                        <span className="rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-[0.6rem] font-bold text-brand-700 dark:border-brand-400/30 dark:bg-brand-500/15 dark:text-brand-200">
                          ثبت شد
                        </span>
                      ) : null}
                      <Chevron />
                    </span>
                  </summary>
                  <div className="border-t border-line px-3 py-2.5 dark:border-white/10">
                    <textarea
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={3}
                      disabled={!hasModel}
                      placeholder="مثلاً: برای این منبع چه شواهدی از رقبا وجود دارد؟"
                      className="w-full resize-y rounded-xl border border-line bg-white px-2.5 py-2 text-xs leading-6 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-midnight-950 dark:text-white"
                    />
                    <p className="mt-1.5 text-[0.62rem] text-muted">Enter = ارسال · Shift+Enter = خط جدید</p>
                  </div>
                </details>

                {request.status === 'thinking' && (
                  <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-xs font-bold text-brand-800 dark:border-brand-400/30 dark:bg-brand-500/10 dark:text-brand-200">
                    <ThinkingDots />
                    <span>{request.phase === 'reasoning' ? 'AI در حال استدلال است…' : 'AI در حال بررسی زمینه است…'}</span>
                  </div>
                )}

                {request.text && (
                  <div className="overflow-hidden rounded-xl border border-line bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex items-center justify-between gap-2 border-b border-line bg-canvas/60 px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
                      <span className="flex items-center gap-1.5 text-[0.68rem] font-extrabold text-midnight-700 dark:text-midnight-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                        پاسخ AI
                      </span>
                      <span className="truncate font-mono text-[0.58rem] text-muted" dir="ltr">
                        {config.model || '—'}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap break-words px-3 py-2.5 text-sm leading-7 text-midnight-800 dark:text-midnight-100">
                      {request.text}
                      {request.status === 'streaming' && <span className="ai-caret" aria-hidden="true" />}
                    </div>
                  </div>
                )}

                {request.status === 'aborted' && !request.text && (
                  <div className="rounded-xl border border-gold-200 bg-gold-50 p-3 text-xs leading-6 text-gold-900 dark:border-gold-400/30 dark:bg-gold-500/10 dark:text-gold-100">
                    <p className="font-extrabold">تولید پاسخ متوقف شد.</p>
                    <button
                      type="button"
                      onClick={() => retry(consultKey)}
                      className="mt-2 rounded-lg bg-gold-600 px-2.5 py-1.5 text-[0.7rem] font-extrabold text-white transition hover:bg-gold-700"
                    >
                      تلاش دوباره
                    </button>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-6 text-rose-900 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-100">
                    <p className="font-extrabold">{error.message}</p>
                    {error.hint && <p className="mt-1">{error.hint}</p>}
                    {error.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-bold">جزئیات فنی</summary>
                        <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white/70 p-2 text-[0.68rem] dark:bg-black/20" dir="ltr">
                          {error.details}
                        </pre>
                      </details>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {error.code !== 'model-required' && (
                        <button
                          type="button"
                          onClick={() => retry(consultKey)}
                          className="rounded-lg border border-rose-300 bg-white px-2.5 py-1.5 text-[0.7rem] font-extrabold text-rose-800 transition hover:bg-rose-100 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200"
                        >
                          تلاش دوباره
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={openSettings}
                        className="rounded-lg border border-rose-300 bg-white px-2.5 py-1.5 text-[0.7rem] font-extrabold text-rose-800 transition hover:bg-rose-100 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200"
                      >
                        تنظیمات Ollama
                      </button>
                    </div>
                  </div>
                )}

                {isScore && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 dark:border-brand-400/30 dark:bg-brand-500/10">
                    <div>
                      <p className="text-[0.68rem] font-extrabold text-brand-800 dark:text-brand-200">
                        امتیاز پیشنهادی AI
                      </p>
                      <p className="text-xl font-black text-brand-900 dark:text-brand-100">
                        {toFaNumber(request.suggestedScore)}
                        <span className="mr-1 text-[0.7rem] font-bold text-brand-700 dark:text-brand-300">
                          از {toFaNumber(scale.max ?? 5)}
                        </span>
                      </p>
                    </div>
                    {onApply && (
                      <button
                        type="button"
                        onClick={() => handleApply(request.suggestedScore)}
                        className="rounded-lg bg-brand-600 px-3 py-2 text-[0.72rem] font-extrabold text-white transition hover:bg-brand-700"
                      >
                        قرار دادن این عدد
                      </button>
                    )}
                  </div>
                )}

                {showScore && request.status === 'done' && !isScore && (
                  <p className="rounded-lg border border-line bg-canvas/60 px-2.5 py-2 text-[0.7rem] leading-6 text-muted dark:border-white/10 dark:bg-white/[0.03]">
                    مدل عدد مشخصی در قالب «پیشنهاد امتیاز» برنگرداند؛ می‌توانید دوباره بپرسید یا از عدد مرجع استفاده کنید.
                  </p>
                )}
              </div>

              <div className="border-t border-line bg-canvas/70 px-3 py-2.5 backdrop-blur dark:border-white/10 dark:bg-midnight-950/50">
                <div className="flex flex-wrap items-center gap-2">
                  {busy ? (
                    <button
                      type="button"
                      onClick={() => cancel(consultKey)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gold-300 bg-gold-50 px-3.5 py-2 text-[0.72rem] font-extrabold text-gold-800 transition hover:bg-gold-100 dark:border-gold-400/30 dark:bg-gold-500/10 dark:text-gold-200"
                    >
                      <span className="h-2 w-2 rounded-sm bg-gold-600" aria-hidden="true" />
                      توقف
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!hasModel}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-3.5 py-2 text-[0.72rem] font-extrabold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {request.status === 'done' || request.text ? 'پرسش دوباره' : 'دریافت تحلیل AI'}
                      <span aria-hidden="true">←</span>
                    </button>
                  )}

                  {showFallbackApply && (
                    <button
                      type="button"
                      onClick={() => handleApply(normalizedFallback ?? undefined)}
                      className="rounded-xl border border-brand-200 bg-brand-50 px-2.5 py-2 text-[0.7rem] font-extrabold text-brand-800 transition hover:bg-brand-100 dark:border-brand-400/30 dark:bg-brand-500/10 dark:text-brand-200"
                    >
                      {fallbackLabel}
                    </button>
                  )}
                  {(request.status === 'done' || request.status === 'aborted') && (
                    <button
                      type="button"
                      onClick={() => retry(consultKey)}
                      className="rounded-xl border border-line bg-white px-2.5 py-2 text-[0.7rem] font-bold text-muted transition hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-midnight-200"
                    >
                      {request.status === 'aborted' ? 'تلاش دوباره' : 'تولید دوباره'}
                    </button>
                  )}
                  {request.text && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="rounded-xl border border-line bg-white px-2.5 py-2 text-[0.7rem] font-bold text-muted transition hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-midnight-200"
                    >
                      {copied ? 'کپی شد' : 'کپی پاسخ'}
                    </button>
                  )}
                </div>
                {!hasModel && (
                  <p className="mt-1.5 text-[0.62rem] leading-5 text-muted">
                    برای فعال شدن پرسش، ابتدا یک مدل Ollama انتخاب کنید.
                  </p>
                )}
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  )
}
