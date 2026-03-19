import { z } from 'zod'

export const createAllergySchema = z.object({
  name: z.string().min(1),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  notes: z.string().optional(),
})

export const updateAllergySchema = createAllergySchema.partial()

export type CreateAllergyInput = z.infer<typeof createAllergySchema>
