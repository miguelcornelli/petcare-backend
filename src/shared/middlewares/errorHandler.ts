import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/AppError'
import { logger } from '../../config/logger'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(422).json({
      error: 'VALIDATION_ERROR',
      message: 'Dados inválidos',
      details: err.issues.map((e) => ({ field: e.path.join('.'), message: e.message })),
    })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code ?? err.name,
      message: err.message,
    })
    return
  }

  logger.error('Unhandled error', { error: err })
  res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Erro interno do servidor',
  })
}
