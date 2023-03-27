import { Express } from 'express'
import request from 'supertest'
import { setupApp } from '../config/app'

let app: Express

describe('BodyParser', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'any_name' })
      .expect({ name: 'any_name' })
  })
})
