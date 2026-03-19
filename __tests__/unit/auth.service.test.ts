import { register, login } from '../../src/modules/auth/auth.service'
import { prisma } from '../../src/config/prisma'
import bcrypt from 'bcryptjs'
import { ConflictError, UnauthorizedError } from '../../src/shared/errors/AppError'

jest.mock('../../src/config/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('AuthService', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('register', () => {
    it('should throw ConflictError if email already exists', async () => {
      ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({ id: '1', email: 'test@test.com' })
      await expect(register({ name: 'Test', email: 'test@test.com', password: '123456', role: 'TUTOR' })).rejects.toThrow(ConflictError)
    })

    it('should create user when email is new', async () => {
      ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      ;(mockPrisma.user.create as jest.Mock).mockResolvedValue({ id: '1', name: 'Test', email: 'test@test.com', role: 'TUTOR', createdAt: new Date() })
      const result = await register({ name: 'Test', email: 'test@test.com', password: '123456', role: 'TUTOR' })
      expect(result.email).toBe('test@test.com')
    })
  })

  describe('login', () => {
    it('should throw UnauthorizedError if user not found', async () => {
      ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      await expect(login({ email: 'x@x.com', password: '123456' })).rejects.toThrow(UnauthorizedError)
    })

    it('should throw UnauthorizedError if password is wrong', async () => {
      ;(mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: '1', email: 'x@x.com', password: await bcrypt.hash('correct', 12), role: 'TUTOR', deletedAt: null,
      })
      await expect(login({ email: 'x@x.com', password: 'wrong' })).rejects.toThrow(UnauthorizedError)
    })
  })
})
