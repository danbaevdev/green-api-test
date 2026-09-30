const MIN_DIGITS = 10
const MAX_DIGITS = 15

const RU_LOCAL_PREFIX = /^8(\d{10})$/

/** Digits only; Russian local format 8XXXXXXXXXX becomes international 7XXXXXXXXXX. */
export const toDigits = (input: string) =>
  input.replace(/\D/g, '').replace(RU_LOCAL_PREFIX, '7$1')

export const isValidPhone = (input: string) => {
  const { length } = toDigits(input)
  return length >= MIN_DIGITS && length <= MAX_DIGITS
}

export const phoneToChatId = (input: string) => `${toDigits(input)}@c.us`

export const chatIdToPhone = (chatId: string) => chatId.split('@')[0]
