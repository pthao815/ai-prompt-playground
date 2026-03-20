import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate'
import { authenticate } from '../middleware/authenticate'
import { registerUser, loginUser, signToken, getUserById } from '../services/auth.service'

const router = Router()

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post(
  '/register',
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body
      const user = await registerUser(name, email, password)
      const token = signToken(user.id, user.email, user.plan)
      res.cookie('token', token, COOKIE_OPTS)
      res.status(201).json({ user })
    } catch (err) {
      next(err)
    }
  },
)

router.post(
  '/login',
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body
      const user = await loginUser(email, password)
      const token = signToken(user.id, user.email, user.plan)
      res.cookie('token', token, COOKIE_OPTS)
      res.status(200).json({ user })
    } catch (err) {
      next(err)
    }
  },
)

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token')
  res.status(204).send()
})

router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserById(req.user!.sub)
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({ user })
  } catch (err) {
    next(err)
  }
})

export default router
