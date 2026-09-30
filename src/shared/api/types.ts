export interface Credentials {
  idInstance: string
  apiTokenInstance: string
  apiUrl: string
  /** offline simulation instead of real GREEN-API */
  demo?: boolean
}

export interface GreenApi {
  sendMessage: (params: SendMessageParams) => Promise<SendMessageResponse>
  /** Resolves `null` when the queue is empty. */
  receiveNotification: (signal?: AbortSignal) => Promise<Notification | null>
  deleteNotification: (receiptId: number) => Promise<unknown>
}

export interface SendMessageParams {
  chatId: string
  message: string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface Notification {
  receiptId: number
  body: NotificationBody
}

export interface NotificationBody {
  typeWebhook: string
  idMessage?: string
  timestamp?: number
  senderData?: { chatId: string; senderName?: string }
  messageData?: {
    typeMessage: string
    textMessageData?: { textMessage: string }
    extendedTextMessageData?: { text: string }
  }
}
