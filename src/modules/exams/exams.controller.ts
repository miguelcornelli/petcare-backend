import { Request, Response } from 'express'
import * as service from './exams.service'
import { createExamSchema } from './exams.schemas'

export async function listExams(req: Request, res: Response): Promise<void> {
  const result = await service.listExams(req.params.petId as string, req.user!.sub, req.user!.role, req.query as { page?: number; limit?: number })
  res.json(result)
}

export async function createExam(req: Request, res: Response): Promise<void> {
  const data = createExamSchema.parse(req.body)
  const fileUrl = req.file?.filename
  const exam = await service.createExam(req.params.petId as string, req.user!.sub, req.user!.role, data, fileUrl)
  res.status(201).json(exam)
}
