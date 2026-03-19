import { prisma } from '../../config/prisma'
import { CreateAllergyInput } from './allergies.schemas'
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError'
import { getPaginationParams, buildPaginatedResult } from '../../shared/utils/pagination'

export async function listAllergies(petId: string, userId: string, role: string, query: { page?: number; limit?: number }) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  if (role === 'TUTOR' && pet.tutorId !== userId) throw new ForbiddenError()

  const { page, limit, skip } = getPaginationParams(query)
  const where = { petId, deletedAt: null }
  const [items, total] = await Promise.all([
    prisma.allergy.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.allergy.count({ where }),
  ])
  return buildPaginatedResult(items, total, page, limit)
}

export async function createAllergy(petId: string, registeredById: string, role: string, data: CreateAllergyInput) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  if (role === 'TUTOR' && pet.tutorId !== registeredById) throw new ForbiddenError()
  return prisma.allergy.create({ data: { petId, registeredById, ...data } })
}
