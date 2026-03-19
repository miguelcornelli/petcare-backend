import { Request, Response } from 'express'
import * as service from './consults.service'
import { createConsultSchema } from './consults.schemas'

export async function listConsults(req: Request, res: Response): Promise<void> {
  const result = await service.listConsults(req.params.petId as string, req.user!.sub, req.user!.role, req.query as { page?: number; limit?: number })
  res.json(result)
}

export async function createConsult(req: Request, res: Response): Promise<void> {
  const data = createConsultSchema.parse(req.body)
  const attachments = (req.files as Express.Multer.File[])?.map((f) => f.filename) ?? []
  const consult = await service.createConsult(req.params.petId as string, req.user!.sub, data, attachments)
  res.status(201).json(consult)
}
