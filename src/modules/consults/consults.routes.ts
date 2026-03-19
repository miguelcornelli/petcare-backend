import { Router } from 'express'
import { asyncHandler } from '../../shared/utils/asyncHandler'
import * as controller from './consults.controller'
import { authenticate, authorize } from '../../shared/middlewares/auth'
import { upload } from '../../config/multer'

export const consultsRouter = Router({ mergeParams: true })
consultsRouter.use(authenticate)
consultsRouter.get('/', asyncHandler(controller.listConsults))
consultsRouter.post('/', authorize('VET'), upload.array('attachments', 5), asyncHandler(controller.createConsult))
