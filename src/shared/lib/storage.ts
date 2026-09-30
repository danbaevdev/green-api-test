export const readJson = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage may be unavailable or full — persistence is best-effort
  }
}

export const removeKey = (key: string) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
