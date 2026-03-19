import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import path from 'path'
import { authRouter } from './modules/auth/auth.routes'
import { petsRouter } from './modules/pets/pets.routes'
import { vaccinesRouter, vaccinesBaseRouter } from './modules/vaccines/vaccines.routes'
import { parasitesRouter, parasitesBaseRouter } from './modules/parasites/parasites.routes'
import { consultsRouter } from './modules/consults/consults.routes'
import { examsRouter } from './modules/exams/exams.routes'
import { allergiesRouter } from './modules/allergies/allergies.routes'
import { accessRouter } from './modules/access/access.routes'
import { reportsRouter } from './modules/reports/reports.routes'
import { errorHandler } from './shared/middlewares/errorHandler'
import { apiLimiter } from './shared/middlewares/rateLimiter'
import { env } from './config/env'

export const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)))
app.use('/api', apiLimiter)

app.use('/api/auth', authRouter)
app.use('/api/pets', petsRouter)
app.use('/api/pets/:petId/vaccines', vaccinesRouter)
app.use('/api/vaccines', vaccinesBaseRouter)
app.use('/api/pets/:petId/parasites', parasitesRouter)
app.use('/api/parasites', parasitesBaseRouter)
app.use('/api/pets/:petId/consults', consultsRouter)
app.use('/api/pets/:petId/exams', examsRouter)
app.use('/api/pets/:petId/allergies', allergiesRouter)
app.use('/api/pets/:petId/report', reportsRouter)
app.use('/api/access', accessRouter)

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }))

app.use(errorHandler)
