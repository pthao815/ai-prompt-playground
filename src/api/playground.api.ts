import { apiFetch } from './client'
import type { HistoryItem, Role } from '../stores/playground'

export function apiGenerate(prompt: string, role: Role, model: string) {
  return apiFetch<{ output: string; historyItem: HistoryItem }>('/api/playground/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt, role, model }),
  })
}

export function apiGetHistory(limit = 50) {
  return apiFetch<{ items: HistoryItem[] }>(`/api/playground/history?limit=${limit}`)
}

export function apiClearHistory() {
  return apiFetch<void>('/api/playground/history', { method: 'DELETE' })
}
