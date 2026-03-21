import { prisma } from '../../config/prisma'
import { CreateExamInput } from './exams.schemas'
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError'
import { getPaginationParams, buildPaginatedResult } from '../../shared/utils/pagination'

export async function listExams(petId: string, userId: string, role: string, query: { page?: number; limit?: number }) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  if (role === 'TUTOR' && pet.tutorId !== userId) throw new ForbiddenError()

  const { page, limit, skip } = getPaginationParams(query)
  const where = { petId, deletedAt: null }
  const [items, total] = await Promise.all([
    prisma.exam.findMany({ where, skip, take: limit, include: { vet: { select: { name: true, crmv: true } } }, orderBy: { date: 'desc' } }),
    prisma.exam.count({ where }),
  ])
  return buildPaginatedResult(items, total, page, limit)
}

export async function createExam(petId: string, userId: string, role: string, data: CreateExamInput, fileUrl?: string) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  if (role === 'TUTOR' && pet.tutorId !== userId) throw new ForbiddenError()

  return prisma.exam.create({
    data: {
      petId,
      vetId: role === 'VET' ? userId : null,
      ...data,
      date: new Date(data.date),
      fileUrl,
    },
  })
}
