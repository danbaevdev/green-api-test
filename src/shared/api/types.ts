export interface Credentials {
  idInstance: string
  apiTokenInstance: string
  apiUrl: string
}

export interface ContactInfo {
  /** profile name set by the contact */
  name: string
  /** name saved in the account's own contacts */
  contactName: string
  /** avatar image url, empty when hidden/absent */
  avatar: string
}

export interface GreenApi {
  sendMessage: (params: SendMessageParams) => Promise<SendMessageResponse>
  getContactInfo: (chatId: string) => Promise<ContactInfo>
  /** Server-side check that the phone number has an account. Rejects with 400 for malformed numbers. */
  isRegistered: (phoneNumber: string) => Promise<boolean>
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
