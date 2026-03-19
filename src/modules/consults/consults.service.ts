import { prisma } from '../../config/prisma'
import { CreateConsultInput } from './consults.schemas'
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError'
import { getPaginationParams, buildPaginatedResult } from '../../shared/utils/pagination'

export async function listConsults(petId: string, userId: string, role: string, query: { page?: number; limit?: number }) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  if (role === 'TUTOR' && pet.tutorId !== userId) throw new ForbiddenError()

  const { page, limit, skip } = getPaginationParams(query)
  const where = { petId, deletedAt: null }
  const [items, total] = await Promise.all([
    prisma.consult.findMany({ where, skip, take: limit, include: { vet: { select: { name: true, crmv: true } } }, orderBy: { date: 'desc' } }),
    prisma.consult.count({ where }),
  ])
  return buildPaginatedResult(items, total, page, limit)
}

export async function createConsult(petId: string, vetId: string, data: CreateConsultInput, attachments: string[]) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  return prisma.consult.create({
    data: { petId, vetId, ...data, date: new Date(data.date), attachments },
  })
}
