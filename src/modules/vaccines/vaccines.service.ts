import { prisma } from '../../config/prisma'
import { CreateVaccineInput, UpdateVaccineInput } from './vaccines.schemas'
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError'
import { getPaginationParams, buildPaginatedResult } from '../../shared/utils/pagination'

async function assertPetAccess(petId: string, userId: string, role: string) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  if (role === 'TUTOR' && pet.tutorId !== userId) throw new ForbiddenError()
  return pet
}

export async function listVaccines(petId: string, userId: string, role: string, query: { page?: number; limit?: number }) {
  await assertPetAccess(petId, userId, role)
  const { page, limit, skip } = getPaginationParams(query)
  const where = { petId, deletedAt: null }
  const [vaccines, total] = await Promise.all([
    prisma.vaccine.findMany({ where, skip, take: limit, include: { vet: { select: { name: true, crmv: true } } }, orderBy: { appliedAt: 'desc' } }),
    prisma.vaccine.count({ where }),
  ])
  return buildPaginatedResult(vaccines, total, page, limit)
}

export async function createVaccine(petId: string, vetId: string, data: CreateVaccineInput, labelPhoto?: string) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  return prisma.vaccine.create({
    data: { petId, vetId, ...data, appliedAt: new Date(data.appliedAt), expiresAt: new Date(data.expiresAt), labelPhoto },
  })
}

export async function updateVaccine(id: string, vetId: string, data: UpdateVaccineInput) {
  const vaccine = await prisma.vaccine.findFirst({ where: { id, deletedAt: null } })
  if (!vaccine) throw new NotFoundError('Vacina não encontrada')
  if (vaccine.vetId !== vetId) throw new ForbiddenError()
  return prisma.vaccine.update({
    where: { id },
    data: {
      ...data,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    },
  })
}
