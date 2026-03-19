import { Router } from 'express'
import { asyncHandler } from '../../shared/utils/asyncHandler'
import * as controller from './parasites.controller'
import { authenticate, authorize } from '../../shared/middlewares/auth'
import { upload } from '../../config/multer'

export const parasitesRouter = Router({ mergeParams: true })
parasitesRouter.use(authenticate)
parasitesRouter.get('/', asyncHandler(controller.listParasites))
parasitesRouter.post('/', authorize('TUTOR'), upload.single('boxPhoto'), asyncHandler(controller.createParasite))

export const parasitesBaseRouter = Router()
parasitesBaseRouter.use(authenticate)
parasitesBaseRouter.put('/:id', authorize('TUTOR'), asyncHandler(controller.updateParasite))
