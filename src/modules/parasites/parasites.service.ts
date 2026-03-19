import { prisma } from '../../config/prisma'
import { CreateParasiteInput, UpdateParasiteInput } from './parasites.schemas'
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError'
import { getPaginationParams, buildPaginatedResult } from '../../shared/utils/pagination'

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export async function listParasites(petId: string, tutorId: string, role: string, query: { page?: number; limit?: number }) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  if (role === 'TUTOR' && pet.tutorId !== tutorId) throw new ForbiddenError()

  const { page, limit, skip } = getPaginationParams(query)
  const where = { petId, deletedAt: null }
  const [items, total] = await Promise.all([
    prisma.antiParasite.findMany({ where, skip, take: limit, orderBy: { appliedAt: 'desc' } }),
    prisma.antiParasite.count({ where }),
  ])
  return buildPaginatedResult(items, total, page, limit)
}

export async function createParasite(petId: string, tutorId: string, data: CreateParasiteInput, boxPhoto?: string, photoTimestamp?: Date) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  if (pet.tutorId !== tutorId) throw new ForbiddenError()

  const appliedAt = new Date(data.appliedAt)
  const expiresAt = data.expiresAt ? new Date(data.expiresAt) : addMonths(appliedAt, 3)

  return prisma.antiParasite.create({
    data: { petId, tutorId, ...data, appliedAt, expiresAt, boxPhoto, photoTimestamp },
  })
}

export async function updateParasite(id: string, tutorId: string, data: UpdateParasiteInput) {
  const item = await prisma.antiParasite.findFirst({ where: { id, deletedAt: null } })
  if (!item) throw new NotFoundError('Registro não encontrado')
  if (item.tutorId !== tutorId) throw new ForbiddenError()

  return prisma.antiParasite.update({
    where: { id },
    data: {
      ...data,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    },
  })
}
