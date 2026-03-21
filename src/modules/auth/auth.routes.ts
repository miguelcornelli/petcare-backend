import { Router } from 'express'
import { asyncHandler } from '../../shared/utils/asyncHandler'
import * as controller from './auth.controller'
import { authLimiter } from '../../shared/middlewares/rateLimiter'
import { authenticate } from '../../shared/middlewares/auth'

export const authRouter = Router()

authRouter.post('/register', authLimiter, asyncHandler(controller.register))
authRouter.post('/login', authLimiter, asyncHandler(controller.login))
authRouter.post('/refresh', asyncHandler(controller.refresh))
authRouter.post('/logout', asyncHandler(controller.logout))
authRouter.get('/profile', authenticate, asyncHandler(controller.getProfile))
authRouter.put('/profile', authenticate, asyncHandler(controller.updateProfile))
