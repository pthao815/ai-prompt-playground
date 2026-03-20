import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config'
import authRouter from './routes/auth.router'
import playgroundRouter from './routes/playground.router'
import { errorHandler } from './middleware/errorHandler'

export function createApp() {
  const app = express()

  app.use(cors({ origin: config.corsOrigin, credentials: true }))
  app.use(express.json())
  app.use(cookieParser())

  app.get('/api/health', (_req, res) => res.json({ ok: true }))
  app.use('/api/auth', authRouter)
  app.use('/api/playground', playgroundRouter)

  app.use(errorHandler)

  return app
}
