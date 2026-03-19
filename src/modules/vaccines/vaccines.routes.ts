import { Router } from 'express'
import { asyncHandler } from '../../shared/utils/asyncHandler'
import * as controller from './vaccines.controller'
import { authenticate, authorize } from '../../shared/middlewares/auth'
import { upload } from '../../config/multer'

export const vaccinesRouter = Router({ mergeParams: true })

vaccinesRouter.use(authenticate)
vaccinesRouter.get('/', asyncHandler(controller.listVaccines))
vaccinesRouter.post('/', authorize('VET'), upload.single('labelPhoto'), asyncHandler(controller.createVaccine))

export const vaccinesBaseRouter = Router()
vaccinesBaseRouter.use(authenticate)
vaccinesBaseRouter.put('/:id', authorize('VET'), asyncHandler(controller.updateVaccine))
