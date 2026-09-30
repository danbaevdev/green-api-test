const MS_IN_DAY = 86_400_000

const toDate = (unixSeconds: number) => new Date(unixSeconds * 1000)
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

export const formatTime = (unixSeconds: number) =>
  toDate(unixSeconds).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

/** Stable per-day key used to group messages under date separators. */
export const dayKey = (unixSeconds: number) => startOfDay(toDate(unixSeconds))

/** Separator label inside a chat: "Сегодня", "Вчера", "28 сентября" (+ year for past years). */
export const formatDayLabel = (unixSeconds: number, now = new Date()) => {
  const date = toDate(unixSeconds)
  const daysAgo = Math.round((startOfDay(now) - startOfDay(date)) / MS_IN_DAY)
  if (daysAgo === 0) return 'Сегодня'
  if (daysAgo === 1) return 'Вчера'
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  })
}

/** Chat list label: time for today, "28 сент." this year, "24.08.25" otherwise. */
export const formatChatDate = (unixSeconds: number, now = new Date()) => {
  const date = toDate(unixSeconds)
  if (startOfDay(date) === startOfDay(now)) return formatTime(unixSeconds)
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  }
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
