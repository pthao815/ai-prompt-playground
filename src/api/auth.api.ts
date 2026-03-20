import { apiFetch } from './client'
import type { User } from '../stores/auth'

export function apiRegister(name: string, email: string, password: string) {
  return apiFetch<{ user: User }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export function apiLogin(email: string, password: string) {
  return apiFetch<{ user: User }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function apiLogout() {
  return apiFetch<void>('/api/auth/logout', { method: 'POST' })
}

export function apiGetMe() {
  return apiFetch<{ user: User }>('/api/auth/me')
}
