import { Router } from 'express'
import { asyncHandler } from '../../shared/utils/asyncHandler'
import * as controller from './reports.controller'
import { authenticate, authorize } from '../../shared/middlewares/auth'

export const reportsRouter = Router({ mergeParams: true })
reportsRouter.use(authenticate)
reportsRouter.get('/', authorize('TUTOR'), asyncHandler(controller.getPetReport))
