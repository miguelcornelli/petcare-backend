import { z } from 'zod'

export const createPetSchema = z.object({
  name: z.string().min(1),
  species: z.string().min(1),
  breed: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']),
  birthDate: z.string().datetime(),
  microchip: z.string().optional(),
  color: z.string().optional(),
})

export const updatePetSchema = createPetSchema.partial()

export const addWeightSchema = z.object({
  weight: z.number().positive(),
  date: z.string().datetime(),
})

export type CreatePetInput = z.infer<typeof createPetSchema>
export type UpdatePetInput = z.infer<typeof updatePetSchema>
export type AddWeightInput = z.infer<typeof addWeightSchema>
