import { useAi } from '../../state/AiContext'

const STATES = {
  unknown: {
    label: 'AI تنظیم نشده',
    dot: 'bg-midnight-300',
    tone: 'border-line bg-canvas text-muted dark:border-white/10 dark:bg-white/[0.04] dark:text-midnight-300',
  },
  checking: {
    label: 'بررسی AI…',
    dot: 'bg-gold-500 animate-pulse',
    tone: 'border-gold-200 bg-gold-50 text-gold-800 dark:border-gold-400/30 dark:bg-gold-500/10 dark:text-gold-200',
  },
  offline: {
    label: 'AI قطع',
    dot: 'bg-rose-500',
    tone: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-300',
  },
  'no-models': {
    label: 'بدون مدل',
    dot: 'bg-amber-500',
    tone: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200',
  },
  'no-model': {
    label: 'مدل انتخاب نشده',
    dot: 'bg-amber-500',
    tone: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200',
  },
  'model-missing': {
    label: 'مدل در دسترس نیست',
    dot: 'bg-amber-500',
    tone: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200',
  },
  ready: {
    label: 'AI آماده',
    dot: 'bg-emerald-500',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300',
  },
}

export default function AiStatusBadge() {
  const { connection, config, selectedModelAvailable, openSettings } = useAi()

  let stateKey = 'unknown'
  if (connection.status === 'checking') stateKey = 'checking'
  else if (connection.status === 'unreachable' || connection.status === 'offline') stateKey = 'offline'
  else if (connection.status === 'no-models') stateKey = 'no-models'
  else if (connection.status === 'connected') {
    if (!config.model) stateKey = 'no-model'
    else if (!selectedModelAvailable) stateKey = 'model-missing'
    else stateKey = 'ready'
  }

  const state = STATES[stateKey] || STATES.unknown

  return (
    <button
      type="button"
      onClick={openSettings}
      title={`${state.label} — تنظیمات Ollama`}
      aria-label={`${state.label}. باز کردن تنظیمات Ollama`}
      className={`inline-flex items-center gap-2 rounded-xl border px-2.5 py-2 text-xs font-bold transition hover:brightness-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${state.tone}`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${state.dot}`} />
      <span className="hidden sm:inline">AI</span>
    </button>
  )
}
