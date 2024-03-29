import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { setupApp } from '../config/app'
import { hash } from 'bcrypt'
import { Express } from 'express'

let accountCollection: Collection
let app: Express

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as any)
    app = await setupApp()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Rafael',
          email: 'randomw123@gmail.com',
          password: 'any_value',
          passwordConfirmation: 'any_value'
        })
        .expect(200)
    })

    test('Should return 400 on fails', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Rafael',
          email: 'rafael.cavalcante@gmail.com',
          password: 'any_value'
        })
        .expect(400)
    })

    test('Should return a error on body if fails', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Rafael',
          email: 'rafael.cavalcante@gmail.com',
          password: 'any_value'
        })
        .expect(400)
        .then(res => {
          expect(res.body.error).toBeTruthy()
          expect(typeof res.body.error).toBe('string')
        })
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('any_value', 12)
      await accountCollection.insertOne({
        name: 'Rafael',
        email: 'rafael.cavalcante@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'rafael.cavalcante@gmail.com',
          password: 'any_value'
        })
        .expect(200)
    })

    test('Should return 401 if the email is not located', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'rafael.cavalcante@gmail.com',
          password: 'any_value'
        })
        .expect(401)
    })

    test('Should return 401 if invalid password are provided', async () => {
      const password = await hash('any_value', 12)
      await accountCollection.insertOne({
        name: 'Rafael',
        email: 'rafael.cavalcante@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'rafael.cavalcante@gmail.com',
          password: 'any_value5'
        })
        .expect(401)
    })

    test('Should return a accessToken on body if succeeds', async () => {
      const password = await hash('any_value', 12)
      await accountCollection.insertOne({
        name: 'Rafael',
        email: 'rafael.cavalcante@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'rafael.cavalcante@gmail.com',
          password: 'any_value'
        })
        .expect(200)
        .then(res => {
          expect(res.body.accessToken).toBeTruthy()
          expect(typeof res.body.accessToken).toBe('string')
        })
    })

    test('Should return a error on body if fails', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'rafael.cavalcante@gmail.com',
          password: 'any_value'
        })
        .expect(401)
        .then(res => {
          expect(res.body.error).toBeTruthy()
          expect(typeof res.body.error).toBe('string')
        })
    })
  })
})
