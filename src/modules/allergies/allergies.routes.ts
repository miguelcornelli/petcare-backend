import { Router } from 'express'
import { asyncHandler } from '../../shared/utils/asyncHandler'
import * as controller from './allergies.controller'
import { authenticate } from '../../shared/middlewares/auth'

export const allergiesRouter = Router({ mergeParams: true })
allergiesRouter.use(authenticate)
allergiesRouter.get('/', asyncHandler(controller.listAllergies))
allergiesRouter.post('/', asyncHandler(controller.createAllergy))
