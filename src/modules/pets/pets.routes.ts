import { Router } from 'express'
import { asyncHandler } from '../../shared/utils/asyncHandler'
import * as controller from './pets.controller'
import { authenticate, authorize } from '../../shared/middlewares/auth'
import { upload } from '../../config/multer'

export const petsRouter = Router()

petsRouter.use(authenticate)

petsRouter.get('/', asyncHandler(controller.listPets))
petsRouter.post('/', upload.single('photo'), asyncHandler(controller.createPet))
petsRouter.get('/:id', asyncHandler(controller.getPet))
petsRouter.put('/:id', authorize('TUTOR'), upload.single('photo'), asyncHandler(controller.updatePet))
petsRouter.delete('/:id', authorize('TUTOR'), asyncHandler(controller.deletePet))
petsRouter.post('/:id/weights', authorize('TUTOR'), asyncHandler(controller.addWeight))
