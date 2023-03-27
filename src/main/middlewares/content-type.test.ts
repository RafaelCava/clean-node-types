import { Express } from 'express'
import request from 'supertest'
import { setupApp } from '../config/app'

let app: Express

describe('Content Type middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  test('Should return default content type as json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/ig)
  })
  test('Should return xml content type when forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/ig)
  })
})
