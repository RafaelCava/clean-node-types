import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as any)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            image: 'http://image-name.com',
            answer: 'Answer 1'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const result = await accountCollection.insertOne({
        name: 'Rafael',
        email: 'rafael.cavalcante@gmail.com',
        password: '1234',
        role: 'admin'
      })
      const accessToken = sign({ id: result.insertedId }, env.jwtSecret)
      await accountCollection.updateOne({ _id: result.insertedId }, { $set: { accessToken } })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            image: 'http://image-name.com',
            answer: 'Answer 1'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(204)
    })

    test('Should return 500 on add survey with bad formated accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', 'invalid_token')
        .send({
          question: 'Question',
          answers: [{
            image: 'http://image-name.com',
            answer: 'Answer 1'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(500)
    })

    test('Should return 500 on add survey with invalid signature accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', sign({ id: 'invalid_id' }, '1234'))
        .send({
          question: 'Question',
          answers: [{
            image: 'http://image-name.com',
            answer: 'Answer 1'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(500)
    })

    test('Should return 403 on add survey with invalid accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', sign({ id: 'invalid_id' }, env.jwtSecret))
        .send({
          question: 'Question',
          answers: [{
            image: 'http://image-name.com',
            answer: 'Answer 1'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })
  })
})
