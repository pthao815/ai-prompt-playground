import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { validate } from '../middleware/validate'
import { authenticate } from '../middleware/authenticate'
import { generateResponse, getHistory, clearHistory } from '../services/playground.service'

const router = Router()

router.use(authenticate)

const generateSchema = z.object({
  prompt: z.string().min(1),
  role: z.enum(['user', 'assistant', 'system']),
  model: z.string().min(1),
})

router.post(
  '/generate',
  validate(generateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prompt, role, model } = req.body
      const result = await generateResponse(req.user!.sub, prompt, role, model)
      res.json(result)
    } catch (err) {
      next(err)
    }
  },
)

router.get('/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt((req.query.limit as string) ?? '50', 10)
    const items = await getHistory(req.user!.sub, limit)
    res.json({ items })
  } catch (err) {
    next(err)
  }
})

router.delete('/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await clearHistory(req.user!.sub)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

export default router
