export const USER_STORAGE_KEY = 'user'

export const APP_EVENTS = {
  AUTH_STATE_CHANGED: 'authStateChanged',
  CART_CHANGED: 'cartChanged'
} as const

export function readStoredSession(): unknown | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function writeStoredSession(data: unknown): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data))
}

export function clearStoredSession(): void {
  localStorage.removeItem(USER_STORAGE_KEY)
}

export function getStoredToken(): string | null {
  const data = readStoredSession() as { token?: string; user?: { token?: string } } | null
  if (!data) {
    return null
  }

  return data.token || data.user?.token || null
}

export function emitAppEvent(eventName: string): void {
  window.dispatchEvent(new Event(eventName))
}
