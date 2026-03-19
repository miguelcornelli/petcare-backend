import { z } from 'zod'

export const createParasiteSchema = z.object({
  medicationName: z.string().min(1),
  brand: z.string().optional(),
  appliedAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  notes: z.string().optional(),
})

export const updateParasiteSchema = createParasiteSchema.partial()

export type CreateParasiteInput = z.infer<typeof createParasiteSchema>
export type UpdateParasiteInput = z.infer<typeof updateParasiteSchema>
