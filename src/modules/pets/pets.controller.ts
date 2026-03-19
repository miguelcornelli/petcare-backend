import { Request, Response } from 'express'
import * as service from './pets.service'
import { createPetSchema, updatePetSchema, addWeightSchema } from './pets.schemas'

export async function listPets(req: Request, res: Response): Promise<void> {
  const result = await service.listPets(req.user!.sub, req.query as { page?: number; limit?: number })
  res.json(result)
}

export async function getPet(req: Request, res: Response): Promise<void> {
  const pet = await service.getPet(req.params.id as string, req.user!.sub, req.user!.role)
  res.json(pet)
}

export async function createPet(req: Request, res: Response): Promise<void> {
  const data = createPetSchema.parse(req.body)
  const photoPath = req.file?.filename
  const pet = await service.createPet(req.user!.sub, data, photoPath)
  res.status(201).json(pet)
}

export async function updatePet(req: Request, res: Response): Promise<void> {
  const data = updatePetSchema.parse(req.body)
  const photoPath = req.file?.filename
  const pet = await service.updatePet(req.params.id as string, req.user!.sub, data, photoPath)
  res.json(pet)
}

export async function deletePet(req: Request, res: Response): Promise<void> {
  await service.deletePet(req.params.id as string, req.user!.sub)
  res.status(204).send()
}

export async function addWeight(req: Request, res: Response): Promise<void> {
  const data = addWeightSchema.parse(req.body)
  const weight = await service.addWeight(req.params.id as string, req.user!.sub, data)
  res.status(201).json(weight)
}
