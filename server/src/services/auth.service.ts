import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { query } from '../db/pool'
import { config } from '../config'

interface DbUser {
  id: string
  name: string
  email: string
  password_hash: string
  plan: 'free' | 'pro'
  avatar_initials: string
}

export interface UserResponse {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro'
  avatarInitials: string
}

function toResponse(user: DbUser): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    plan: user.plan,
    avatarInitials: user.avatar_initials,
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<UserResponse> {
  const existing = await query<{ id: string }>(
    'SELECT id FROM users WHERE email = $1',
    [email.toLowerCase()],
  )
  if (existing.length > 0) {
    throw Object.assign(new Error('An account with this email already exists.'), { status: 409 })
  }

  const hash = await bcrypt.hash(password, 12)
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const [user] = await query<DbUser>(
    `INSERT INTO users (name, email, password_hash, plan, avatar_initials)
     VALUES ($1, $2, $3, 'free', $4)
     RETURNING *`,
    [name, email.toLowerCase(), hash, initials],
  )
  return toResponse(user)
}

export async function loginUser(email: string, password: string): Promise<UserResponse> {
  const [user] = await query<DbUser>(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()],
  )
  if (!user) {
    throw Object.assign(new Error('Invalid email or password.'), { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    throw Object.assign(new Error('Invalid email or password.'), { status: 401 })
  }

  return toResponse(user)
}

export function signToken(userId: string, email: string, plan: string): string {
  return jwt.sign({ sub: userId, email, plan }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions)
}

export async function getUserById(id: string): Promise<UserResponse | null> {
  const [user] = await query<DbUser>('SELECT * FROM users WHERE id = $1', [id])
  return user ? toResponse(user) : null
}
