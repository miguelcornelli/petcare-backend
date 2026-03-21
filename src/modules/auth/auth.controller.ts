import { Request, Response } from 'express'
import * as authService from './auth.service'
import { loginSchema, registerSchema, refreshTokenSchema, updateProfileSchema } from './auth.schemas'

export async function register(req: Request, res: Response): Promise<void> {
  const data = registerSchema.parse(req.body)
  const user = await authService.register(data)
  res.status(201).json(user)
}

export async function login(req: Request, res: Response): Promise<void> {
  const data = loginSchema.parse(req.body)
  const result = await authService.login(data)
  res.json(result)
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const { refreshToken } = refreshTokenSchema.parse(req.body)
  const tokens = await authService.refreshAccessToken(refreshToken)
  res.json(tokens)
}

export async function logout(req: Request, res: Response): Promise<void> {
  const { refreshToken } = refreshTokenSchema.parse(req.body)
  await authService.logout(refreshToken)
  res.status(204).send()
}

export async function getProfile(req: Request, res: Response): Promise<void> {
  const user = await authService.getProfile(req.user!.sub)
  res.json(user)
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const data = updateProfileSchema.parse(req.body)
  const user = await authService.updateProfile(req.user!.sub, data)
  res.json(user)
}
