import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../stores/auth'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  plan: 'free' as const,
  avatarInitials: 'TU',
}

function stubFetch(body: unknown, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status < 400,
      status,
      json: async () => body,
    }),
  )
}

function stubFetch204() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => undefined }),
  )
}

// ─── useAuthStore ─────────────────────────────────────────────────────────────

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ── initial state ──────────────────────────────────────────────────────────

  it('starts unauthenticated when localStorage is empty', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('hydrates user from localStorage on init', () => {
    localStorage.setItem('promptlab_user', JSON.stringify(mockUser))
    const store = useAuthStore()
    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  // ── login ──────────────────────────────────────────────────────────────────

  it('login sets user and persists to localStorage on success', async () => {
    stubFetch({ user: mockUser })
    const store = useAuthStore()

    await store.login('test@example.com', 'password123')

    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
    expect(JSON.parse(localStorage.getItem('promptlab_user') ?? 'null')).toEqual(mockUser)
  })

  it('login calls the correct endpoint with credentials', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ user: mockUser }),
    })
    vi.stubGlobal('fetch', fetchSpy)
    const store = useAuthStore()

    await store.login('test@example.com', 'password123')

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/login'),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      }),
    )
  })

  it('login throws ApiError on 401', async () => {
    stubFetch({ error: 'Invalid email or password.' }, 401)
    const store = useAuthStore()

    await expect(store.login('test@example.com', 'wrong')).rejects.toThrow('Invalid email or password.')
    expect(store.user).toBeNull()
  })

  // ── register ───────────────────────────────────────────────────────────────

  it('register sets user and persists to localStorage on success', async () => {
    stubFetch({ user: mockUser }, 201)
    const store = useAuthStore()

    await store.register('Test User', 'test@example.com', 'password123')

    expect(store.user).toEqual(mockUser)
    expect(JSON.parse(localStorage.getItem('promptlab_user') ?? 'null')).toEqual(mockUser)
  })

  it('register calls the correct endpoint', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ user: mockUser }),
    })
    vi.stubGlobal('fetch', fetchSpy)
    const store = useAuthStore()

    await store.register('Test User', 'test@example.com', 'password123')

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/register'),
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('register throws ApiError on 409 duplicate email', async () => {
    stubFetch({ error: 'An account with this email already exists.' }, 409)
    const store = useAuthStore()

    await expect(
      store.register('Test User', 'existing@example.com', 'password123'),
    ).rejects.toThrow('An account with this email already exists.')
  })

  // ── logout ─────────────────────────────────────────────────────────────────

  it('logout clears user and localStorage immediately', () => {
    stubFetch204()
    localStorage.setItem('promptlab_user', JSON.stringify(mockUser))
    const store = useAuthStore()
    store.user = { ...mockUser }

    store.logout()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('promptlab_user')).toBeNull()
  })

  // ── initializeFromServer ───────────────────────────────────────────────────

  it('initializeFromServer refreshes user data from server', async () => {
    const updatedUser = { ...mockUser, plan: 'pro' as const }
    localStorage.setItem('promptlab_user', JSON.stringify(mockUser))
    stubFetch({ user: updatedUser })

    const store = useAuthStore()
    await store.initializeFromServer()

    expect(store.user?.plan).toBe('pro')
  })

  it('initializeFromServer does nothing when user is null', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const store = useAuthStore()

    await store.initializeFromServer()

    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('initializeFromServer clears user when server returns 401', async () => {
    localStorage.setItem('promptlab_user', JSON.stringify(mockUser))
    stubFetch({ error: 'Invalid or expired token' }, 401)

    const store = useAuthStore()
    await store.initializeFromServer()

    expect(store.user).toBeNull()
    expect(localStorage.getItem('promptlab_user')).toBeNull()
  })

  // ── auth:expired event ─────────────────────────────────────────────────────

  it('auth:expired event clears user and localStorage', () => {
    localStorage.setItem('promptlab_user', JSON.stringify(mockUser))
    const store = useAuthStore()
    store.user = { ...mockUser }

    window.dispatchEvent(new CustomEvent('auth:expired'))

    expect(store.user).toBeNull()
    expect(localStorage.getItem('promptlab_user')).toBeNull()
  })
})
