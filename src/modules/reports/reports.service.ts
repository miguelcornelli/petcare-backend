import { prisma } from '../../config/prisma'
import { NotFoundError, ForbiddenError } from '../../shared/errors/AppError'

export async function getPetReport(petId: string, tutorId: string) {
  const pet = await prisma.pet.findFirst({
    where: { id: petId, deletedAt: null },
    include: {
      weights: { orderBy: { date: 'desc' } },
      vaccines: { where: { deletedAt: null }, include: { vet: { select: { name: true, crmv: true } } } },
      antiParasites: { where: { deletedAt: null } },
      consults: { where: { deletedAt: null }, include: { vet: { select: { name: true, crmv: true } } } },
      exams: { where: { deletedAt: null }, include: { vet: { select: { name: true, crmv: true } } } },
      allergies: { where: { deletedAt: null } },
      tutor: { select: { name: true, email: true, cpf: true } },
    },
  })

  if (!pet) throw new NotFoundError('Pet não encontrado')
  if (pet.tutorId !== tutorId) throw new ForbiddenError()

  return pet
}
