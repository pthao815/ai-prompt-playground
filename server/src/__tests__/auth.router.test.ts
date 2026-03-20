import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'

// Hoist mock declarations so they run before imports
vi.mock('../services/auth.service', () => ({
  registerUser: vi.fn(),
  loginUser: vi.fn(),
  signToken: vi.fn(),
  getUserById: vi.fn(),
}))

// Mock db/pool so the Pool constructor never tries to connect
vi.mock('../db/pool', () => ({
  pool: { query: vi.fn(), end: vi.fn() },
  query: vi.fn(),
}))

import { createApp } from '../app'
import * as authService from '../services/auth.service'

const app = createApp()

const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  plan: 'free' as const,
  avatarInitials: 'TU',
}

// Must match the fallback in src/config.ts (used when JWT_SECRET env var is unset)
const TEST_JWT_SECRET = 'dev-secret-change-in-production'

function makeToken(payload = { sub: 'user-123', email: 'test@example.com', plan: 'free' }) {
  return jwt.sign(payload, TEST_JWT_SECRET, { expiresIn: '1h' })
}

// ─── POST /api/auth/register ─────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 201 with user object on success', async () => {
    vi.mocked(authService.registerUser).mockResolvedValue(mockUser)
    vi.mocked(authService.signToken).mockReturnValue('signed-token')

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })

    expect(res.status).toBe(201)
    expect(res.body.user).toMatchObject({
      id: 'user-123',
      email: 'test@example.com',
      plan: 'free',
    })
  })

  it('sets an HttpOnly token cookie on success', async () => {
    vi.mocked(authService.registerUser).mockResolvedValue(mockUser)
    vi.mocked(authService.signToken).mockReturnValue('signed-token')

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })

    const cookies: string[] = res.headers['set-cookie'] ?? []
    expect(cookies.some((c) => c.startsWith('token='))).toBe(true)
    expect(cookies.some((c) => c.includes('HttpOnly'))).toBe(true)
  })

  it('calls registerUser with correct arguments', async () => {
    vi.mocked(authService.registerUser).mockResolvedValue(mockUser)
    vi.mocked(authService.signToken).mockReturnValue('signed-token')

    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Alice Smith', email: 'alice@example.com', password: 'securepass' })

    expect(authService.registerUser).toHaveBeenCalledWith('Alice Smith', 'alice@example.com', 'securepass')
  })

  it('returns 422 when name is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123' })

    expect(res.status).toBe(422)
    expect(res.body.error).toBe('Validation failed')
  })

  it('returns 422 when email is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'not-an-email', password: 'password123' })

    expect(res.status).toBe(422)
  })

  it('returns 422 when password is shorter than 8 characters', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'short' })

    expect(res.status).toBe(422)
  })

  it('returns 409 when email is already registered', async () => {
    const err = Object.assign(
      new Error('An account with this email already exists.'),
      { status: 409 },
    )
    vi.mocked(authService.registerUser).mockRejectedValue(err)

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'existing@example.com', password: 'password123' })

    expect(res.status).toBe(409)
    expect(res.body.error).toContain('already exists')
  })

  it('returns 500 on unexpected service error', async () => {
    vi.mocked(authService.registerUser).mockRejectedValue(new Error('DB connection lost'))

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })

    expect(res.status).toBe(500)
  })
})

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 200 with user object on success', async () => {
    vi.mocked(authService.loginUser).mockResolvedValue(mockUser)
    vi.mocked(authService.signToken).mockReturnValue('signed-token')

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body.user).toMatchObject({ email: 'test@example.com' })
  })

  it('sets an HttpOnly token cookie on success', async () => {
    vi.mocked(authService.loginUser).mockResolvedValue(mockUser)
    vi.mocked(authService.signToken).mockReturnValue('signed-token')

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })

    const cookies: string[] = res.headers['set-cookie'] ?? []
    expect(cookies.some((c) => c.startsWith('token='))).toBe(true)
    expect(cookies.some((c) => c.includes('HttpOnly'))).toBe(true)
  })

  it('calls loginUser with correct arguments', async () => {
    vi.mocked(authService.loginUser).mockResolvedValue(mockUser)
    vi.mocked(authService.signToken).mockReturnValue('signed-token')

    await request(app)
      .post('/api/auth/login')
      .send({ email: 'Test@Example.COM', password: 'mypassword' })

    expect(authService.loginUser).toHaveBeenCalledWith('Test@Example.COM', 'mypassword')
  })

  it('returns 401 with invalid credentials', async () => {
    const err = Object.assign(new Error('Invalid email or password.'), { status: 401 })
    vi.mocked(authService.loginUser).mockRejectedValue(err)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
    expect(res.body.error).toContain('Invalid email or password')
  })

  it('returns 422 when email is invalid format', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'password123' })

    expect(res.status).toBe(422)
  })

  it('returns 422 when password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' })

    expect(res.status).toBe(422)
  })
})

// ─── POST /api/auth/logout ───────────────────────────────────────────────────

describe('POST /api/auth/logout', () => {
  it('returns 204 No Content', async () => {
    const res = await request(app).post('/api/auth/logout')
    expect(res.status).toBe(204)
  })

  it('clears the token cookie', async () => {
    const res = await request(app).post('/api/auth/logout')
    const cookies: string[] = res.headers['set-cookie'] ?? []
    // Express clearCookie sets Expires to epoch or Max-Age=0
    const tokenCookie = cookies.find((c) => c.startsWith('token='))
    expect(tokenCookie).toBeDefined()
    expect(tokenCookie).toMatch(/Expires=Thu, 01 Jan 1970|Max-Age=0/i)
  })

  it('does not require authentication', async () => {
    // Logout should work even without a cookie (idempotent)
    const res = await request(app).post('/api/auth/logout')
    expect(res.status).toBe(204)
  })
})

// ─── GET /api/auth/me ────────────────────────────────────────────────────────

describe('GET /api/auth/me', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns user when a valid token cookie is provided', async () => {
    vi.mocked(authService.getUserById).mockResolvedValue(mockUser)
    const token = makeToken()

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', `token=${token}`)

    expect(res.status).toBe(200)
    expect(res.body.user).toMatchObject({ id: 'user-123', email: 'test@example.com' })
    expect(authService.getUserById).toHaveBeenCalledWith('user-123')
  })

  it('returns 401 when no token cookie is present', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Not authenticated')
  })

  it('returns 401 when token is malformed', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', 'token=this.is.not.a.valid.jwt')

    expect(res.status).toBe(401)
    expect(res.body.error).toBe('Invalid or expired token')
  })

  it('returns 401 when token is signed with wrong secret', async () => {
    const badToken = jwt.sign(
      { sub: 'user-123', email: 'test@example.com', plan: 'free' },
      'completely-different-secret-not-matching-config',
      { expiresIn: '1h' },
    )

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', `token=${badToken}`)

    expect(res.status).toBe(401)
  })

  it('returns 404 when user is not found in the database', async () => {
    vi.mocked(authService.getUserById).mockResolvedValue(null)
    const token = makeToken({ sub: 'deleted-user', email: 'gone@example.com', plan: 'free' })

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', `token=${token}`)

    expect(res.status).toBe(404)
    expect(res.body.error).toBe('User not found')
  })

  it('returns 500 when getUserById throws unexpectedly', async () => {
    vi.mocked(authService.getUserById).mockRejectedValue(new Error('DB timeout'))
    const token = makeToken()

    const res = await request(app)
      .get('/api/auth/me')
      .set('Cookie', `token=${token}`)

    expect(res.status).toBe(500)
  })
})

// ─── GET /api/health ─────────────────────────────────────────────────────────

describe('GET /api/health', () => {
  it('returns { ok: true }', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })
})
