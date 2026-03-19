import { Request, Response } from 'express'
import * as service from './parasites.service'
import { createParasiteSchema, updateParasiteSchema } from './parasites.schemas'

export async function listParasites(req: Request, res: Response): Promise<void> {
  const result = await service.listParasites(req.params.petId as string, req.user!.sub, req.user!.role, req.query as { page?: number; limit?: number })
  res.json(result)
}

export async function createParasite(req: Request, res: Response): Promise<void> {
  const data = createParasiteSchema.parse(req.body)
  const boxPhoto = req.file?.filename
  const photoTimestamp = req.file ? new Date() : undefined
  const item = await service.createParasite(req.params.petId as string, req.user!.sub, data, boxPhoto, photoTimestamp)
  res.status(201).json(item)
}

export async function updateParasite(req: Request, res: Response): Promise<void> {
  const data = updateParasiteSchema.parse(req.body)
  const item = await service.updateParasite(req.params.id as string, req.user!.sub, data)
  res.json(item)
}
