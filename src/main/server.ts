import 'module-alias/register'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'
import apm from './config/apm'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.use(apm.middleware.connect())
    app.listen(env.port, () => console.log(`Server is running at http://localhost:${env.port}`))
  })
  .catch(console.error)
