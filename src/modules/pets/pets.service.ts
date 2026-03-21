import { prisma } from '../../config/prisma'
import { CreatePetInput, UpdatePetInput, AddWeightInput } from './pets.schemas'
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError'
import { getPaginationParams, buildPaginatedResult } from '../../shared/utils/pagination'

export async function listPets(tutorId: string, query: { page?: number; limit?: number }) {
  const { page, limit, skip } = getPaginationParams(query)
  const where = { tutorId, deletedAt: null }
  const [pets, total] = await Promise.all([
    prisma.pet.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.pet.count({ where }),
  ])
  return buildPaginatedResult(pets, total, page, limit)
}

export async function getPet(id: string, requesterId: string, requesterRole: string) {
  const pet = await prisma.pet.findFirst({ where: { id, deletedAt: null }, include: { weights: true } })
  if (!pet) throw new NotFoundError('Pet não encontrado')

  if (requesterRole === 'TUTOR' && pet.tutorId !== requesterId) throw new ForbiddenError()

  return pet
}

export async function createPet(tutorId: string, data: CreatePetInput, photoPath?: string) {
  return prisma.pet.create({
    data: { ...data, tutorId, birthDate: new Date(data.birthDate), photo: photoPath },
  })
}

export async function updatePet(id: string, tutorId: string, data: UpdatePetInput, photoPath?: string) {
  const pet = await prisma.pet.findFirst({ where: { id, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  if (pet.tutorId !== tutorId) throw new ForbiddenError()

  return prisma.pet.update({
    where: { id },
    data: {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      photo: photoPath ?? pet.photo,
    },
  })
}

export async function deletePet(id: string, tutorId: string) {
  const pet = await prisma.pet.findFirst({ where: { id, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  if (pet.tutorId !== tutorId) throw new ForbiddenError()
  await prisma.pet.update({ where: { id }, data: { deletedAt: new Date() } })
}

export async function addWeight(petId: string, tutorId: string, data: AddWeightInput) {
  const pet = await prisma.pet.findFirst({ where: { id: petId, deletedAt: null } })
  if (!pet) throw new NotFoundError('Pet não encontrado')
  if (pet.tutorId !== tutorId) throw new ForbiddenError()
  return prisma.petWeight.create({ data: { petId, weight: data.weight, date: new Date(data.date) } })
}

export async function searchPetsByCpf(cpf: string) {
  const tutor = await prisma.user.findFirst({
    where: { cpf, role: 'TUTOR', deletedAt: null },
    select: { id: true, name: true, email: true, phone: true, cpf: true },
  })
  if (!tutor) throw new NotFoundError('Tutor não encontrado com este CPF')

  const pets = await prisma.pet.findMany({
    where: { tutorId: tutor.id, deletedAt: null },
    orderBy: { name: 'asc' },
  })
  return { tutor, pets }
}
