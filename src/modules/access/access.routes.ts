import { Router } from 'express'
import { asyncHandler } from '../../shared/utils/asyncHandler'
import * as controller from './access.controller'
import { authenticate, authorize } from '../../shared/middlewares/auth'

export const accessRouter = Router()
accessRouter.use(authenticate)

accessRouter.post('/request', authorize('CLINIC'), asyncHandler(controller.requestAccess))
accessRouter.post('/:id/approve', authorize('TUTOR'), asyncHandler(controller.approveAccess))
accessRouter.post('/:id/reject', authorize('TUTOR'), asyncHandler(controller.rejectAccess))
accessRouter.get('/logs', authorize('TUTOR'), asyncHandler(controller.getAccessLogs))
