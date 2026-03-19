import { z } from 'zod'

export const createVaccineSchema = z.object({
  name: z.string().min(1),
  appliedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  lot: z.string().optional(),
  manufacturer: z.string().optional(),
  vetSignature: z.string().optional(),
})

export const updateVaccineSchema = createVaccineSchema.partial()

export type CreateVaccineInput = z.infer<typeof createVaccineSchema>
export type UpdateVaccineInput = z.infer<typeof updateVaccineSchema>
