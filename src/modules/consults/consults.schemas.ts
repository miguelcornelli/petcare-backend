import { z } from 'zod'

export const createConsultSchema = z.object({
  date: z.string().datetime(),
  clinic: z.string().optional(),
  reason: z.string().min(1),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  notes: z.string().optional(),
})

export const updateConsultSchema = createConsultSchema.partial()

export type CreateConsultInput = z.infer<typeof createConsultSchema>
export type UpdateConsultInput = z.infer<typeof updateConsultSchema>
