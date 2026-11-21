import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAi } from '../../state/AiContext'
import { defaultBaseUrl } from '../../services/ollamaClient'
import { toFaNumber } from '../../utils/numbers'

function StatusDot({ tone = 'neutral', pulse = false }) {
  const tones = {
    neutral: 'bg-midnight-300',
    checking: 'bg-gold-500',
    ok: 'bg-emerald-500',
    warn: 'bg-amber-500',
    error: 'bg-rose-500',
  }
  return (
    <span className={`inline-flex h-2.5 w-2.5 shrink-0 rounded-full ${tones[tone] || tones.neutral} ${pulse ? 'animate-pulse' : ''}`} />
  )
}

function Step({ status, label, detail }) {
  const icon =
    status === 'ok' ? (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[0.65rem] font-black text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
        ✓
      </span>
    ) : status === 'fail' ? (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-[0.65rem] font-black text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
        ✕
      </span>
    ) : (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-midnight-100 text-[0.6rem] font-black text-muted dark:bg-white/10">
        …
      </span>
    )

  return (
    <div className="flex items-start gap-2">
      {icon}
      <div className="min-w-0">
        <p className="text-xs font-bold text-midnight-800 dark:text-midnight-100">{label}</p>
        {detail && <p className="mt-0.5 text-[0.7rem] text-muted">{detail}</p>}
      </div>
    </div>
  )
}

function formatModelSize(size) {
  if (!size) return ''
  const gb = size / 1_000_000_000
  if (gb < 1) return `${toFaNumber((size / 1_000_000).toFixed(0))} MB`
  return `${toFaNumber(gb.toFixed(1))} GB`
}

export default function OllamaSettingsModal() {
  const {
    settingsOpen,
    closeSettings,
    config,
    saveConfig,
    connection,
    checkConnection,
    probeConnection,
    effectiveBaseUrl,
  } = useAi()

  const [baseUrl, setBaseUrl] = useState('')
  const [model, setModel] = useState('')
  const [temperature, setTemperature] = useState('0.4')
  const [think, setThink] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState('')
  const [models, setModels] = useState([])
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [formError, setFormError] = useState('')

  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)
  const probeIdRef = useRef(0)

  useEffect(() => {
    if (!settingsOpen) return undefined

    setBaseUrl(config.baseUrl || '')
    setModel(config.model || '')
    setTemperature(String(config.temperature ?? 0.4))
    setThink(config.think === true)
    setSystemPrompt(config.systemPrompt || '')
    setFormError('')
    setModels(connection.models || [])
    setTestResult(null)
    setTesting(true)

    const probeId = probeIdRef.current + 1
    probeIdRef.current = probeId
    checkConnection()
      .then((result) => {
        if (probeIdRef.current !== probeId) return
        setTestResult(result)
        setModels(result.models || [])
      })
      .finally(() => {
        if (probeIdRef.current === probeId) setTesting(false)
      })

    return () => {
      probeIdRef.current += 1
    }
    // The form is intentionally initialized once per opening; live edits are local.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsOpen])

  useEffect(() => {
    if (!settingsOpen) return undefined

    previousFocusRef.current = document.activeElement
    const focusTimer = window.setTimeout(() => dialogRef.current?.focus(), 30)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus()
      }
    }
  }, [settingsOpen])

  useEffect(() => {
    if (!settingsOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        closeSettings()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [settingsOpen, closeSettings])

  if (!settingsOpen) return null

  const handleTest = async () => {
    setTesting(true)
    setFormError('')
    try {
      const result = await probeConnection(baseUrl || defaultBaseUrl())
      setTestResult(result)
      setModels(result.models || [])
    } finally {
      setTesting(false)
    }
  }

  const handleRefreshModels = async () => {
    setTesting(true)
    setFormError('')
    try {
      const result = await probeConnection(baseUrl || defaultBaseUrl())
      setTestResult(result)
      setModels(result.models || [])
    } finally {
      setTesting(false)
    }
  }

  const handleSave = async () => {
    const cleanBase = baseUrl.trim()
    if (cleanBase && !cleanBase.startsWith('/')) {
      try {
        const candidate = /^https?:\/\//i.test(cleanBase) ? cleanBase : `http://${cleanBase}`
        const parsed = new URL(candidate)
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('invalid protocol')
      } catch (error) {
        setFormError('آدرس سرور معتبر نیست. یک آدرس مانند http://127.0.0.1:11434 یا مسیر نسبی /ollama وارد کنید.')
        return
      }
    }

    const numericTemperature = Number(temperature)
    const safeTemperature = Number.isFinite(numericTemperature)
      ? Math.min(1, Math.max(0, numericTemperature))
      : 0.4

    saveConfig({
      baseUrl: cleanBase,
      model,
      temperature: safeTemperature,
      think,
      systemPrompt,
    })
    closeSettings()
    checkConnection({ baseUrl: cleanBase || defaultBaseUrl() })
  }

  const handleFocusTrap = (event) => {
    if (event.key !== 'Tab') return
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) || [],
    ).filter((element) => element.offsetParent !== null)
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const connected = testResult?.status === 'connected'
  const serverReachable = testResult?.status === 'connected' || testResult?.status === 'no-models'
  const noModels = testResult?.status === 'no-models' || (serverReachable && models.length === 0)
  const modelAvailable = Boolean(model) && models.some((item) => item.name === model)
  const testFailed = Boolean(testResult) && !serverReachable
  const hasModelList = models.length > 0

  const stepOneStatus = testing ? 'pending' : serverReachable ? 'ok' : testResult ? 'fail' : 'pending'
  const stepTwoStatus = testing ? 'pending' : models.length > 0 ? 'ok' : testResult ? 'fail' : 'pending'
  const stepThreeStatus = testing ? 'pending' : modelAvailable ? 'ok' : model ? 'fail' : 'pending'

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-midnight-950/55 p-3 backdrop-blur-sm sm:p-5"
      role="presentation"
      onClick={closeSettings}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ollama-settings-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleFocusTrap}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-card outline-none dark:border-midnight-700 dark:bg-midnight-900 dark:text-white"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-3 dark:border-white/10">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <StatusDot
                tone={connected ? 'ok' : testFailed ? 'error' : noModels ? 'warn' : 'checking'}
                pulse={testing}
              />
              <h2 id="ollama-settings-title" className="text-sm font-black">
                اتصال به Ollama
              </h2>
            </div>
            <p className="mt-1 text-[0.7rem] leading-5 text-muted">
              مدل محلی را انتخاب کنید تا دکمه‌های «مشورت با AI» تحلیل واقعی دریافت کنند.
            </p>
          </div>
          <button
            type="button"
            onClick={closeSettings}
            aria-label="بستن تنظیمات Ollama"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-canvas hover:text-ink dark:hover:bg-white/10 dark:hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <div className="rounded-xl border border-line bg-canvas/70 p-3 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-extrabold text-midnight-900 dark:text-white">وضعیت اتصال</p>
                <p className="mt-0.5 text-[0.7rem] text-muted" dir="ltr">
                  {effectiveBaseUrl}
                </p>
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 text-[0.7rem] font-extrabold ${
                  testing
                    ? 'border-gold-200 bg-gold-50 text-gold-800 dark:border-gold-400/30 dark:bg-gold-500/15 dark:text-gold-200'
                    : connected
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-300'
                      : noModels
                        ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-200'
                        : testFailed
                          ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-300'
                          : 'border-line bg-white text-muted'
                }`}
              >
                {testing ? 'در حال بررسی…' : connected ? 'متصل' : noModels ? 'بدون مدل' : testFailed ? 'قطع' : 'بررسی نشده'}
              </span>            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Step
                status={stepOneStatus}
                label="سرور Ollama در دسترس است"
                detail={testFailed ? testResult?.error?.message : undefined}
              />
              <Step
                status={stepTwoStatus}
                label="فهرست مدل‌ها دریافت شد"
                detail={models.length ? `${toFaNumber(models.length)} مدل نصب‌شده` : 'هنوز مدلی دیده نشد'}
              />
              <Step
                status={stepThreeStatus}
                label="مدل انتخاب‌شده نصب است"
                detail={model ? model : 'مدلی انتخاب نشده'}
              />
            </div>
          </div>

          {noModels && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-6 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
              <p className="font-extrabold">هنوز هیچ مدلی روی Ollama نصب نیست.</p>
              <p className="mt-1">
                برای استفاده از دستیار، حداقل یک مدل نصب کنید. برای فارسی مدل‌های ۷ تا ۸ میلیارد پارامتری معمولاً پاسخ
                بهتری می‌دهند:
              </p>
              <div className="mt-2 space-y-1 font-mono text-[0.72rem]" dir="ltr">
                <code className="block rounded-lg bg-white/70 px-2 py-1 dark:bg-black/20">ollama pull qwen2.5:7b</code>
                <code className="block rounded-lg bg-white/70 px-2 py-1 dark:bg-black/20">ollama pull llama3.1:8b</code>
              </div>
            </div>
          )}

          {testFailed && testResult?.error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-6 text-rose-900 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-100">
              <p className="font-extrabold">{testResult.error.message}</p>
              {testResult.error.hint && <p className="mt-1">{testResult.error.hint}</p>}
              {testResult.error.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer font-bold">جزئیات فنی</summary>
                  <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white/70 p-2 text-[0.68rem] dark:bg-black/20" dir="ltr">
                    {testResult.error.details}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-bold text-midnight-800 dark:text-midnight-100">
              آدرس سرور Ollama
              <input
                type="text"
                value={baseUrl}
                onChange={(event) => setBaseUrl(event.target.value)}
                placeholder={defaultBaseUrl()}
                dir="ltr"
                className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 font-mono text-xs text-left outline-none transition focus:border-brand-400 dark:border-white/15 dark:bg-midnight-950 dark:text-white"
              />
              <span className="mt-1 block text-[0.68rem] font-normal leading-5 text-muted">
                خالی بگذارید تا از آدرس پیش‌فرض استفاده شود. در حالت توسعه، درخواست‌ها از پروکسی <code>/ollama</code>{' '}
                عبور می‌کنند.
              </span>
            </label>

            <label className="block text-xs font-bold text-midnight-800 dark:text-midnight-100">
              مدل
              <div className="mt-1 flex gap-2">
                <select
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                  disabled={!hasModelList}
                  dir="ltr"
                  className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 py-2 text-xs outline-none transition focus:border-brand-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-midnight-950 dark:text-white"
                >
                  <option value="">— انتخاب مدل —</option>
                  {models.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                      {item.parameterSize ? ` · ${item.parameterSize}` : ''}
                      {item.size ? ` · ${formatModelSize(item.size)}` : ''}
                    </option>
                  ))}
                  {model && !models.some((item) => item.name === model) && (
                    <option value={model}>{model} (در فهرست نیست)</option>
                  )}
                </select>
                <button
                  type="button"
                  onClick={handleRefreshModels}
                  disabled={testing}
                  title="دریافت دوباره فهرست مدل‌ها"
                  className="shrink-0 rounded-xl border border-line bg-canvas px-3 py-2 text-xs font-bold text-muted transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.06] dark:text-midnight-200"
                >
                  ↻
                </button>
              </div>
              <span className="mt-1 block text-[0.68rem] font-normal leading-5 text-muted">
                فقط مدل‌های نصب‌شده نمایش داده می‌شوند.
              </span>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-bold text-midnight-800 dark:text-midnight-100">
              خلاقیت پاسخ (Temperature)
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(event) => setTemperature(event.target.value)}
                dir="ltr"
                className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2 text-xs outline-none transition focus:border-brand-400 dark:border-white/15 dark:bg-midnight-950 dark:text-white"
              />
              <span className="mt-1 block text-[0.68rem] font-normal leading-5 text-muted">
                مقدار کمتر = پاسخ محافظه‌کارانه‌تر و پایدارتر.
              </span>
            </label>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 text-xs font-extrabold text-brand-800 transition hover:border-brand-300 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-brand-400/30 dark:bg-brand-500/15 dark:text-brand-200"
              >
                {testing ? 'در حال تست…' : 'تست اتصال'}
              </button>
            </div>
          </div>

          {formError && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200">
              {formError}
            </p>
          )}

          <details className="rounded-xl border border-line bg-canvas/60 p-3 dark:border-white/10 dark:bg-white/[0.04]">
            <summary className="cursor-pointer text-xs font-extrabold text-midnight-800 dark:text-midnight-100">
              راهنمای راه‌اندازی و رفع خطای CORS
            </summary>
            <div className="mt-2 space-y-2 text-xs leading-6 text-midnight-700 dark:text-midnight-200">
              <p>
                <strong>۱.</strong> Ollama را از <span dir="ltr">ollama.com</span> نصب و اجرا کنید.
              </p>
              <p>
                <strong>۲.</strong> یک مدل نصب کنید:
              </p>
              <pre className="overflow-auto rounded-lg bg-white/80 px-2 py-1.5 font-mono text-[0.7rem] dark:bg-black/20" dir="ltr">
                ollama pull qwen2.5:7b
              </pre>
              <p>
                <strong>۳.</strong> اگر از نسخه ساخته‌شده (فایل استاتیک) استفاده می‌کنید، مرورگر ممکن است به دلیل CORS
                اجازه اتصال ندهد. Ollama را با اجازه مبدأ اجرا کنید:
              </p>
              <pre className="overflow-auto rounded-lg bg-white/80 px-2 py-1.5 font-mono text-[0.7rem] dark:bg-black/20" dir="ltr">
                setx OLLAMA_ORIGINS "*"
              </pre>
              <p>
                سپس Ollama را کامل ببندید (از سینی سیستم) و دوباره باز کنید. برای اجرای موقت در PowerShell:
              </p>
              <pre className="overflow-auto rounded-lg bg-white/80 px-2 py-1.5 font-mono text-[0.7rem] dark:bg-black/20" dir="ltr">
                $env:OLLAMA_ORIGINS="*"; ollama serve
              </pre>
              <p className="text-muted">
                در حالت توسعه (<span dir="ltr">npm run dev</span>) درخواست‌ها از پروکسی Vite عبور می‌کنند و معمولاً
                نیازی به تنظیم CORS نیست. Ollama را روی شبکه عمومی باز نکنید؛ این اتصال فقط برای همین دستگاه است.
              </p>
            </div>
          </details>

          <details className="rounded-xl border border-line bg-canvas/60 p-3 dark:border-white/10 dark:bg-white/[0.04]">
            <summary className="cursor-pointer text-xs font-extrabold text-midnight-800 dark:text-midnight-100">
              تنظیمات پیشرفته (دستور سیستم)
            </summary>
            <label className="mt-2 flex items-start gap-2 rounded-lg border border-line bg-white/70 p-2 text-xs text-midnight-800 dark:border-white/10 dark:bg-white/[0.03] dark:text-midnight-100">
              <input
                type="checkbox"
                checked={think}
                onChange={(event) => setThink(event.target.checked)}
                className="mt-0.5"
              />
              <span>
                اجازه دادن به مدل برای استدلال طولانی (کندتر)
                <span className="mt-0.5 block text-[0.68rem] font-normal leading-5 text-muted">
                  برای پاسخ‌های کوتاه و سریع خاموش بماند. بعضی مدل‌های استدلالی در این حالت فقط «فکر» می‌کنند و پاسخ
                  نهایی دیرتر می‌آید.
                </span>
              </span>
            </label>
            <label className="mt-2 block text-xs font-bold text-midnight-800 dark:text-midnight-100">
              دستور سیستم سفارشی
              <textarea
                value={systemPrompt}
                onChange={(event) => setSystemPrompt(event.target.value)}
                rows={5}
                placeholder="خالی بگذارید تا دستور پیش‌فرض StratBI استفاده شود."
                className="mt-1 w-full resize-y rounded-xl border border-line bg-white px-3 py-2 text-xs leading-6 outline-none transition focus:border-brand-400 dark:border-white/15 dark:bg-midnight-950 dark:text-white"
              />
              <span className="mt-1 block text-[0.68rem] font-normal leading-5 text-muted">
                تغییر این متن می‌تواند قالب «پیشنهاد امتیاز» را از کار بیندازد.
              </span>
            </label>
          </details>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-3 dark:border-white/10">
          <p className="text-[0.7rem] text-muted">
            تنظیمات فقط روی همین دستگاه ذخیره می‌شود.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeSettings}
              className="rounded-xl border border-line bg-canvas px-3.5 py-2 text-xs font-bold text-muted transition hover:border-line hover:text-ink dark:border-white/10 dark:bg-white/[0.06] dark:text-midnight-200"
            >
              انصراف
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              ذخیره تنظیمات
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
