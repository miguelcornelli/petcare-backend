import { app } from './app'
import { env } from './config/env'
import { logger } from './config/logger'

app.listen(env.PORT, () => {
  logger.info(`PetCare API running on port ${env.PORT} [${env.NODE_ENV}]`)
})
