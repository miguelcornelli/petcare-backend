import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../../config/prisma'
import { env } from '../../config/env'
import { LoginInput, RegisterInput } from './auth.schemas'
import { UnauthorizedError, ConflictError, NotFoundError } from '../../shared/errors/AppError'
import { JwtPayload } from '../../shared/middlewares/auth'

function generateTokens(payload: JwtPayload) {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions)

  const refreshToken = jwt.sign({ sub: payload.sub }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)

  return { accessToken, refreshToken }
}

export async function register(data: RegisterInput) {
  const exists = await prisma.user.findUnique({ where: { email: data.email } })
  if (exists) throw new ConflictError('E-mail já cadastrado')

  const hashed = await bcrypt.hash(data.password, 12)
  const user = await prisma.user.create({
    data: { ...data, password: hashed },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  return user
}

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: data.email } })
  if (!user || user.deletedAt) throw new UnauthorizedError('Credenciais inválidas')

  const valid = await bcrypt.compare(data.password, user.password)
  if (!valid) throw new UnauthorizedError('Credenciais inválidas')

  const payload: JwtPayload = { sub: user.id, role: user.role, email: user.email }
  const { accessToken, refreshToken } = generateTokens(payload)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await prisma.refreshToken.create({
    data: { id: uuidv4(), token: refreshToken, userId: user.id, expiresAt },
  })

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  }
}

export async function refreshAccessToken(refreshToken: string) {
  let payload: { sub: string }
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { sub: string }
  } catch {
    throw new UnauthorizedError('Refresh token inválido ou expirado')
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
  if (!stored || stored.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token inválido ou expirado')
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } })
  if (!user || user.deletedAt) throw new NotFoundError('Usuário não encontrado')

  const jwtPayload: JwtPayload = { sub: user.id, role: user.role, email: user.email }
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(jwtPayload)

  await prisma.refreshToken.delete({ where: { token: refreshToken } })

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await prisma.refreshToken.create({
    data: { id: uuidv4(), token: newRefreshToken, userId: user.id, expiresAt },
  })

  return { accessToken, refreshToken: newRefreshToken }
}

export async function logout(refreshToken: string) {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
}
