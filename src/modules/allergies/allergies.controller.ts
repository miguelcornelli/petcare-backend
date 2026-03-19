import { Request, Response } from 'express'
import * as service from './allergies.service'
import { createAllergySchema } from './allergies.schemas'

export async function listAllergies(req: Request, res: Response): Promise<void> {
  const result = await service.listAllergies(req.params.petId as string, req.user!.sub, req.user!.role, req.query as { page?: number; limit?: number })
  res.json(result)
}

export async function createAllergy(req: Request, res: Response): Promise<void> {
  const data = createAllergySchema.parse(req.body)
  const allergy = await service.createAllergy(req.params.petId as string, req.user!.sub, req.user!.role, data)
  res.status(201).json(allergy)
}
