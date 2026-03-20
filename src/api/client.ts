const BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { headers: _, ...restInit } = init ?? {}
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...restInit,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })

  if (res.status === 204) return undefined as T

  const data = await res.json()

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('promptlab_user')
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }
    throw new ApiError(res.status, data.error ?? 'Request failed')
  }

  return data as T
}
