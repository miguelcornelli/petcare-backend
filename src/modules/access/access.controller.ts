import { Request, Response } from 'express'
import * as service from './access.service'
import { requestAccessSchema } from './access.schemas'

export async function requestAccess(req: Request, res: Response): Promise<void> {
  const data = requestAccessSchema.parse(req.body)
  const result = await service.requestAccess(req.user!.sub, data)
  res.status(201).json(result)
}

export async function approveAccess(req: Request, res: Response): Promise<void> {
  const result = await service.approveAccess(req.params.id as string, req.user!.sub)
  res.json(result)
}

export async function rejectAccess(req: Request, res: Response): Promise<void> {
  const result = await service.rejectAccess(req.params.id as string, req.user!.sub)
  res.json(result)
}

export async function getAccessLogs(req: Request, res: Response): Promise<void> {
  const result = await service.getAccessLogs(req.user!.sub, req.query as { page?: number; limit?: number })
  res.json(result)
}
