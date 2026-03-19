import { Router } from 'express'
import { asyncHandler } from '../../shared/utils/asyncHandler'
import * as controller from './auth.controller'
import { authLimiter } from '../../shared/middlewares/rateLimiter'

export const authRouter = Router()

authRouter.post('/register', authLimiter, asyncHandler(controller.register))
authRouter.post('/login', authLimiter, asyncHandler(controller.login))
authRouter.post('/refresh', asyncHandler(controller.refresh))
authRouter.post('/logout', asyncHandler(controller.logout))
