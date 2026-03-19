import { prisma } from '../../config/prisma'
import { RequestAccessInput } from './access.schemas'
import { NotFoundError, ForbiddenError, ConflictError } from '../../shared/errors/AppError'
import { getPaginationParams, buildPaginatedResult } from '../../shared/utils/pagination'

export async function requestAccess(clinicId: string, data: RequestAccessInput) {
  const tutor = await prisma.user.findFirst({ where: { cpf: data.tutorCpf, role: 'TUTOR', deletedAt: null } })
  if (!tutor) throw new NotFoundError('Tutor não encontrado com este CPF')

  const pet = await prisma.pet.findFirst({ where: { id: data.petId, tutorId: tutor.id, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado para este tutor')

  const existing = await prisma.accessRequest.findFirst({
    where: { clinicId, petId: pet.id, status: 'PENDING' },
  })
  if (existing) throw new ConflictError('Já existe uma solicitação pendente para este pet')

  return prisma.accessRequest.create({
    data: { clinicId, tutorId: tutor.id, petId: pet.id },
    include: { pet: { select: { name: true } }, tutor: { select: { name: true } } },
  })
}

export async function approveAccess(id: string, tutorId: string) {
  const request = await prisma.accessRequest.findFirst({ where: { id, status: 'PENDING' } })
  if (!request) throw new NotFoundError('Solicitação não encontrada')
  if (request.tutorId !== tutorId) throw new ForbiddenError()

  const updated = await prisma.accessRequest.update({
    where: { id },
    data: { status: 'APPROVED', resolvedAt: new Date() },
  })

  await prisma.accessLog.create({ data: { clinicId: request.clinicId, petId: request.petId } })

  return updated
}

export async function rejectAccess(id: string, tutorId: string) {
  const request = await prisma.accessRequest.findFirst({ where: { id, status: 'PENDING' } })
  if (!request) throw new NotFoundError('Solicitação não encontrada')
  if (request.tutorId !== tutorId) throw new ForbiddenError()

  return prisma.accessRequest.update({
    where: { id },
    data: { status: 'REJECTED', resolvedAt: new Date() },
  })
}

export async function getAccessLogs(tutorId: string, query: { page?: number; limit?: number }) {
  const { page, limit, skip } = getPaginationParams(query)
  const pets = await prisma.pet.findMany({ where: { tutorId, deletedAt: null }, select: { id: true } })
  const petIds = pets.map((p: { id: string }) => p.id)

  const where = { petId: { in: petIds } }
  const [logs, total] = await Promise.all([
    prisma.accessLog.findMany({ where, skip, take: limit, orderBy: { accessedAt: 'desc' }, include: { pet: { select: { name: true } } } }),
    prisma.accessLog.count({ where }),
  ])
  return buildPaginatedResult(logs, total, page, limit)
}
