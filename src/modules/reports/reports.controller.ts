import { Request, Response } from 'express'
import * as service from './reports.service'

export async function getPetReport(req: Request, res: Response): Promise<void> {
  const report = await service.getPetReport(req.params.petId as string, req.user!.sub)
  res.json(report)
}
