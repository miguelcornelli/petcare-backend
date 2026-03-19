import { Request, Response } from 'express'
import * as service from './vaccines.service'
import { createVaccineSchema, updateVaccineSchema } from './vaccines.schemas'

export async function listVaccines(req: Request, res: Response): Promise<void> {
  const result = await service.listVaccines(req.params.petId as string, req.user!.sub, req.user!.role, req.query as { page?: number; limit?: number })
  res.json(result)
}

export async function createVaccine(req: Request, res: Response): Promise<void> {
  const data = createVaccineSchema.parse(req.body)
  const labelPhoto = req.file?.filename
  const vaccine = await service.createVaccine(req.params.petId as string, req.user!.sub, data, labelPhoto)
  res.status(201).json(vaccine)
}

export async function updateVaccine(req: Request, res: Response): Promise<void> {
  const data = updateVaccineSchema.parse(req.body)
  const vaccine = await service.updateVaccine(req.params.id as string, req.user!.sub, data)
  res.json(vaccine)
}
