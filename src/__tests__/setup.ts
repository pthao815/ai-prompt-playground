import { vi } from 'vitest'

// Mock localStorage
const store: Record<string, string> = {}

vi.stubGlobal('localStorage', {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value },
  removeItem: (key: string) => { delete store[key] },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]) },
})

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => Math.random().toString(36).slice(2),
})
