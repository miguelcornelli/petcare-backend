import { z } from 'zod'

export const createExamSchema = z.object({
  date: z.string().datetime(),
  type: z.string().min(1),
  lab: z.string().optional(),
  result: z.string().optional(),
  notes: z.string().optional(),
})

export const updateExamSchema = createExamSchema.partial()

export type CreateExamInput = z.infer<typeof createExamSchema>
