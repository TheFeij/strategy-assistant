/**
 * Minimal browser client for the local Ollama HTTP API.
 *
 * During development the app talks to the Vite `/ollama` proxy so Ollama does
 * not need a CORS exception. Production/static builds talk to Ollama directly
 * (or to whatever proxy URL the user configures).
 */

const DIRECT_BASE_URL = 'http://127.0.0.1:11434'

export function defaultBaseUrl() {
  try {
    return import.meta.env?.DEV ? '/ollama' : DIRECT_BASE_URL
  } catch (error) {
    return DIRECT_BASE_URL
  }
}

export function normalizeBaseUrl(raw) {
  const value = String(raw ?? '').trim()
  if (!value) return defaultBaseUrl()
  if (value.startsWith('/')) return value.replace(/\/+$/, '') || '/'

  const withScheme = /^https?:\/\//i.test(value) ? value : `http://${value}`
  return withScheme.replace(/\/+$/, '')
}

export class OllamaError extends Error {
  constructor(code, message, hint = '', details = '') {
    super(message)
    this.name = 'OllamaError'
    this.code = code
    this.hint = hint
    this.details = details
  }
}

export function toErrorPayload(error) {
  if (error instanceof OllamaError) {
    return {
      code: error.code,
      message: error.message,
      hint: error.hint,
      details: error.details,
    }
  }

  return {
    code: 'unknown',
    message: 'خطای پیش‌بینی‌نشده در ارتباط با Ollama رخ داد.',
    hint: 'دوباره تلاش کنید. اگر مشکل ادامه داشت، تنظیمات اتصال را بررسی کنید.',
    details: error?.message ? String(error.message) : '',
  }
}

async function readErrorBody(response) {
  try {
    const text = await response.text()
    if (!text) return ''
    try {
      const parsed = JSON.parse(text)
      return parsed?.error ? String(parsed.error) : text
    } catch (error) {
      return text
    }
  } catch (error) {
    return ''
  }
}

function connectionError() {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return new OllamaError(
      'offline',
      'اتصال اینترنت/شبکه قطع است.',
      'اتصال شبکه را برقرار کنید و دوباره تلاش کنید.',
    )
  }

  return new OllamaError(
    'unreachable',
    'اتصال به Ollama برقرار نشد.',
    'مطمئن شوید Ollama اجرا شده است. اگر اجراست، ممکن است مرورگر به دلیل CORS اجازه اتصال نداده باشد؛ راهنمای OLLAMA_ORIGINS را در تنظیمات ببینید.',
  )
}

function timeoutError() {
  return new OllamaError(
    'timeout',
    'Ollama در زمان انتظار پاسخ نداد.',
    'مدل ممکن است سنگین باشد. مدل کوچک‌تری انتخاب کنید یا دوباره تلاش کنید.',
  )
}

function modelMissingError(model) {
  return new OllamaError(
    'model-missing',
    `مدل «${model}» روی Ollama نصب نیست.`,
    `در ترمینال اجرا کنید: ollama pull ${model}`,
  )
}

export async function listModels({ baseUrl, signal, timeoutMs = 8000 } = {}) {
  const url = `${normalizeBaseUrl(baseUrl)}/api/tags`
  const controller = new AbortController()
  let timedOut = false
  let timer = null

  const onExternalAbort = () => controller.abort()
  if (signal) {
    if (signal.aborted) throw new OllamaError('aborted', 'درخواست لغو شد.')
    signal.addEventListener('abort', onExternalAbort, { once: true })
  }

  timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      const body = await readErrorBody(response)
      throw new OllamaError(
        'server-error',
        `Ollama پاسخ ناموفق داد (${response.status}).`,
        'آدرس سرور را بررسی کنید و مطمئن شوید Ollama اجرا شده است.',
        body,
      )
    }

    const data = await response.json()
    const models = Array.isArray(data?.models) ? data.models : null
    if (!models) {
      throw new OllamaError(
        'invalid-response',
        'پاسخ فهرست مدل‌های Ollama قابل خواندن نبود.',
        'نسخه Ollama را به‌روزرسانی کنید و دوباره تلاش کنید.',
        JSON.stringify(data).slice(0, 500),
      )
    }

    return models
      .map((model) => ({
        name: model?.name || model?.model || '',
        size: Number(model?.size) || 0,
        modifiedAt: model?.modified_at || '',
        family: model?.details?.family || '',
        parameterSize: model?.details?.parameter_size || '',
        quantization: model?.details?.quantization_level || '',
      }))
      .filter((model) => model.name)
  } catch (error) {
    if (timedOut) throw timeoutError()
    if (error?.name === 'AbortError') throw new OllamaError('aborted', 'درخواست لغو شد.')
    if (error instanceof OllamaError) throw error
    throw connectionError()
  } finally {
    if (timer) clearTimeout(timer)
    signal?.removeEventListener('abort', onExternalAbort)
  }
}

/**
 * Stream a chat completion. Ollama emits one JSON object per line (NDJSON).
 * `onToken` receives each non-empty content chunk as it arrives.
 */
export async function chatStream({
  baseUrl,
  model,
  messages,
  temperature = 0.4,
  think = false,
  signal,
  onToken,
  onThinking,
  connectTimeoutMs = 120000,
  idleTimeoutMs = 180000,
} = {}) {
  const url = `${normalizeBaseUrl(baseUrl)}/api/chat`
  const controller = new AbortController()
  let timedOut = false
  let timer = null

  const armWatchdog = (timeout) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, timeout)
  }

  const onExternalAbort = () => controller.abort()
  if (signal) {
    if (signal.aborted) throw new OllamaError('aborted', 'درخواست لغو شد.')
    signal.addEventListener('abort', onExternalAbort, { once: true })
  }

  armWatchdog(connectTimeoutMs)

  try {
    const temperatureValue = Number(temperature)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/x-ndjson',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        think: Boolean(think),
        options: {
          temperature: Number.isFinite(temperatureValue)
            ? Math.min(1, Math.max(0, temperatureValue))
            : 0.4,
          num_predict: 768,
        },
      }),
      signal: controller.signal,
    })

    armWatchdog(idleTimeoutMs)

    if (!response.ok) {
      const body = await readErrorBody(response)
      if (response.status === 404) throw modelMissingError(model)
      throw new OllamaError(
        'server-error',
        `Ollama پاسخ ناموفق داد (${response.status}).`,
        'مدل انتخاب‌شده و وضعیت سرور را بررسی کنید.',
        body,
      )
    }

    let received = ''
    let done = false

    const handleLine = (line) => {
      const trimmed = line.trim()
      if (!trimmed) return

      let payload
      try {
        payload = JSON.parse(trimmed)
      } catch (error) {
        // A stray line should not kill an otherwise healthy stream.
        return
      }

      if (payload?.error) {
        throw new OllamaError(
          'server-error',
          'Ollama در میانه تولید پاسخ خطا داد.',
          'دوباره تلاش کنید یا مدل کوچک‌تری انتخاب کنید.',
          String(payload.error),
        )
      }

      const thinking = payload?.message?.thinking || payload?.message?.reasoning || ''
      if (thinking) {
        armWatchdog(idleTimeoutMs)
        onThinking?.(thinking)
      }

      const token = payload?.message?.content || ''
      if (token) {
        received += token
        armWatchdog(idleTimeoutMs)
        onToken?.(token)
      }

      if (payload?.done) done = true
    }

    if (!response.body) {
      const text = await response.text()
      text.split(/\r?\n/).forEach(handleLine)
      return { text: received }
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (!done) {
      const { value, done: streamDone } = await reader.read()
      if (streamDone) break

      buffer += decoder.decode(value, { stream: true })
      let newlineIndex = buffer.indexOf('\n')
      while (newlineIndex >= 0) {
        const line = buffer.slice(0, newlineIndex)
        buffer = buffer.slice(newlineIndex + 1)
        handleLine(line)
        if (done) break
        newlineIndex = buffer.indexOf('\n')
      }
    }

    buffer += decoder.decode()
    if (!done && buffer.trim()) handleLine(buffer)

    return { text: received }
  } catch (error) {
    if (timedOut) throw timeoutError()
    if (error?.name === 'AbortError') throw new OllamaError('aborted', 'درخواست لغو شد.')
    if (error instanceof OllamaError) throw error
    throw connectionError()
  } finally {
    if (timer) clearTimeout(timer)
    signal?.removeEventListener('abort', onExternalAbort)
  }
}
