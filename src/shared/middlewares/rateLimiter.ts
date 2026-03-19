import rateLimit from 'express-rate-limit'

const isDev = process.env.NODE_ENV === 'development'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 10,
  message: { error: 'RATE_LIMIT', message: 'Muitas tentativas. Aguarde 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'RATE_LIMIT', message: 'Limite de requisições atingido.' },
  standardHeaders: true,
  legacyHeaders: false,
})
