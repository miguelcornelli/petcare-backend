import { Router } from 'express'
import { asyncHandler } from '../../shared/utils/asyncHandler'
import * as controller from './exams.controller'
import { authenticate, authorize } from '../../shared/middlewares/auth'
import { upload } from '../../config/multer'

export const examsRouter = Router({ mergeParams: true })
examsRouter.use(authenticate)
examsRouter.get('/', asyncHandler(controller.listExams))
examsRouter.post('/', authorize('VET'), upload.single('file'), asyncHandler(controller.createExam))
