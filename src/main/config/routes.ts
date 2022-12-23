import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import path from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(path.resolve(__dirname, '..', 'routes'))
    .map(async file => {
      if (!file.match(/spec/g) && !file.match(/test/g)) {
        await import(`../routes/${file}`).then(route => route.default(router))
      }
    })
}
