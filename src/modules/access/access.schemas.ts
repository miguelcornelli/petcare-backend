import { z } from 'zod'

export const requestAccessSchema = z.object({
  tutorCpf: z.string().min(11, 'CPF inválido'),
  petId: z.string().uuid(),
})

export type RequestAccessInput = z.infer<typeof requestAccessSchema>
