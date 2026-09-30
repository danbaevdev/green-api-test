import type {
  ContactInfo,
  Credentials,
  GreenApi,
  Notification,
  SendMessageParams,
  SendMessageResponse,
} from './types'

const RECEIVE_TIMEOUT_SEC = 5

const HTTP_ERRORS: Record<number, string> = {
  400: 'Некорректный запрос (проверьте номер получателя)',
  401: 'Неверные idInstance или apiTokenInstance',
  403: 'Доступ запрещён: проверьте тариф и авторизацию инстанса',
  429: 'Слишком много запросов, повторите позже',
}

export class GreenApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const LEGACY_API_URL = 'https://api.green-api.com'

/** Instances with 10+ digit ids live on a per-prefix host: 7107xxxxxxxx -> https://7107.api.greenapi.com */
export const resolveApiUrl = (idInstance: string) =>
  idInstance.length >= 10 ? `https://${idInstance.slice(0, 4)}.api.greenapi.com` : LEGACY_API_URL

export const createGreenApi = ({
  idInstance,
  apiTokenInstance,
  apiUrl,
}: Credentials): GreenApi => {
  const host = /^https?:\/\//.test(apiUrl) ? apiUrl : `https://${apiUrl}`
  const base = `${host.replace(/\/+$/, '')}/waInstance${idInstance}`
  const url = (method: string, suffix = '') =>
    `${base}/${method}/${apiTokenInstance}${suffix}`

  const request = async <T>(input: string, init?: RequestInit): Promise<T> => {
    let response: Response
    try {
      response = await fetch(input, init)
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') throw e
      throw new GreenApiError(
        0,
        `Нет соединения с ${new URL(base).host}. Проверьте apiUrl (в личном кабинете GREEN-API) и интернет.`,
      )
    }
    if (!response.ok) {
      throw new GreenApiError(response.status, HTTP_ERRORS[response.status] ?? `GREEN-API: ${response.status} ${response.statusText}`)
    }
    return (await response.json()) as T
  }

  return {
    sendMessage: (params: SendMessageParams) =>
      request<SendMessageResponse>(url('sendMessage'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }),

    getContactInfo: (chatId) =>
      request<ContactInfo>(url('getContactInfo'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId }),
      }),

    /** Long-polls one notification from the queue; resolves `null` when queue is empty. */
    receiveNotification: (signal?: AbortSignal) =>
      request<Notification | null>(
        url('receiveNotification', `?receiveTimeout=${RECEIVE_TIMEOUT_SEC}`),
        { signal },
      ),

    deleteNotification: (receiptId: number) =>
      request<{ result: boolean }>(url('deleteNotification', `/${receiptId}`), {
        method: 'DELETE',
      }),
  }
}
