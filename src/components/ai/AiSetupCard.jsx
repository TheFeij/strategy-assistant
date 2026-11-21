import { useAi } from '../../state/AiContext'
import { toFaNumber } from '../../utils/numbers'

function StepRow({ index, done, title, detail }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-line bg-white px-2.5 py-2 dark:border-white/10 dark:bg-white/[0.03]">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-black ${
          done
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
            : 'bg-midnight-100 text-muted dark:bg-white/10 dark:text-midnight-300'
        }`}
      >
        {done ? '✓' : toFaNumber(index)}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold text-midnight-800 dark:text-midnight-100">{title}</span>
        {detail && <span className="mt-0.5 block text-[0.68rem] leading-5 text-muted">{detail}</span>}
      </span>
    </div>
  )
}

export default function AiSetupCard() {
  const { config, connection, models, selectedModelAvailable, openSettings, checkConnection } = useAi()

  const serverReachable = connection.status === 'connected' || connection.status === 'no-models'
  const ready = connection.status === 'connected' && selectedModelAvailable
  const checking = connection.status === 'checking'
  const noModels = connection.status === 'no-models' || (serverReachable && models.length === 0)
  const offline = connection.status === 'unreachable' || connection.status === 'offline'
  const needsModel = serverReachable && !config.model

  if (ready) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-3 shadow-sm dark:border-emerald-400/25 dark:bg-emerald-500/10">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-sm text-white shadow-sm">
            ✓
          </span>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-emerald-900 dark:text-emerald-100">
              دستیار هوش مصنوعی آماده است
            </p>
            <p className="mt-0.5 truncate text-xs text-emerald-800/80 dark:text-emerald-200/80" dir="ltr">
              {config.model}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openSettings}
          className="rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-extrabold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/20"
        >
          تنظیمات Ollama
        </button>
      </div>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm dark:border-midnight-700 dark:bg-midnight-900">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3 dark:border-white/10">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                checking
                  ? 'bg-gold-500 animate-pulse'
                  : offline
                    ? 'bg-rose-500'
                    : noModels || needsModel
                      ? 'bg-amber-500'
                      : 'bg-midnight-300'
              }`}
            />
            <h2 className="text-sm font-black text-midnight-900 dark:text-white">دستیار هوش مصنوعی (Ollama)</h2>
          </div>
          <p className="mt-1 max-w-2xl text-xs leading-6 text-muted">
            برای دریافت تحلیل واقعی، دکمه‌های «مشورت با AI» سوال و داده‌های مرتبط همین صفحه را به مدل محلی Ollama
            می‌فرستند. هیچ داده‌ای به فضای ابری نمی‌رود.
          </p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[0.7rem] font-extrabold ${
            checking
              ? 'border-gold-200 bg-gold-50 text-gold-800 dark:border-gold-400/30 dark:bg-gold-500/10 dark:text-gold-200'
              : offline
                ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-300'
                : noModels || needsModel
                  ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200'
                  : 'border-line bg-canvas text-muted'
          }`}
        >
          {checking
            ? 'در حال بررسی…'
            : offline
              ? 'اتصال قطع است'
              : noModels
                ? 'مدلی نصب نیست'
                : needsModel
                  ? 'مدل انتخاب نشده'
                  : connection.status === 'connected' && config.model
                    ? 'مدل در دسترس نیست'
                    : 'بررسی نشده'}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <StepRow
            index={1}
            done={serverReachable}
            title="Ollama را اجرا کنید"
            detail="برنامه Ollama باید روی همین دستگاه در حال اجرا باشد."
          />
          <StepRow
            index={2}
            done={models.length > 0}
            title="یک مدل نصب کنید"
            detail={models.length ? `${toFaNumber(models.length)} مدل در دسترس است` : 'مثلاً qwen2.5:7b'}
          />
          <StepRow
            index={3}
            done={selectedModelAvailable}
            title="مدل را انتخاب و تست کنید"
            detail={config.model || 'در تنظیمات، مدل را انتخاب کنید.'}
          />
        </div>

        {noModels && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-6 text-amber-900 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
            <p className="font-extrabold">هنوز هیچ مدلی نصب نیست.</p>
            <p className="mt-0.5">برای شروع، یک مدل نصب کنید؛ سپس دکمه «تست اتصال» را بزنید.</p>
            <code className="mt-1.5 block w-fit rounded-lg bg-white/80 px-2 py-1 font-mono text-[0.7rem] dark:bg-black/20" dir="ltr">
              ollama pull qwen2.5:7b
            </code>
          </div>
        )}

        {offline && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs leading-6 text-rose-900 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-100">
            <p className="font-extrabold">{connection.error?.message || 'Ollama در دسترس نیست.'}</p>
            <p className="mt-0.5">
              {connection.error?.hint ||
                'Ollama را اجرا کنید. اگر اجراست، ممکن است مرورگر به دلیل CORS اجازه اتصال نداده باشد.'}
            </p>
          </div>
        )}

        {models.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[0.7rem] text-muted">
            <span className="font-bold">مدل‌های نصب‌شده:</span>
            {models.slice(0, 8).map((model) => (
              <span
                key={model.name}
                className={`rounded-md border px-1.5 py-0.5 font-mono text-[0.68rem] ${
                  model.name === config.model
                    ? 'border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-400/40 dark:bg-brand-500/15 dark:text-brand-200'
                    : 'border-line bg-canvas text-muted dark:border-white/10 dark:bg-white/[0.04]'
                }`}
                dir="ltr"
              >
                {model.name}
              </span>
            ))}
            {models.length > 8 && <span>و {toFaNumber(models.length - 8)} مدل دیگر</span>}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={openSettings}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <span>تنظیم اتصال Ollama</span>
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => checkConnection()}
            disabled={checking}
            className="rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-xs font-bold text-muted transition hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-midnight-200"
          >
            {checking ? 'در حال تست…' : 'تست اتصال'}
          </button>
        </div>
      </div>
    </section>
  )
}
