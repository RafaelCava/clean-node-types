import { Collection, ObjectId } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
import MockDate from 'mockdate'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<any> => {
  const result = await accountCollection.insertOne({
    name: 'Rafael',
    email: 'rafael.cavalcante@gmail.com',
    password: '1234',
    role: 'admin'
  })
  const accessToken = sign({ id: result.insertedId }, env.jwtSecret)
  await accountCollection.updateOne({ _id: result.insertedId }, { $set: { accessToken } })
  return {
    accessToken,
    accountId: result.insertedId
  }
}

describe('Survey Result Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as any)
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })
  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 403 on save survey result with valid accessToken and invalid surveyId', async () => {
      const { accessToken } = await makeAccessToken()
      await request(app)
        .put(`/api/surveys/${new ObjectId().toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    test('Should return 403 on save survey result with accessToken and invalid answer', async () => {
      const { accessToken } = await makeAccessToken()
      const survey = await surveyCollection.insertOne({
        question: 'Question 2',
        answers: [{
          image: 'http://image-name.com',
          answer: 'Answer 1'
        },
        {
          answer: 'Answer 2'
        }],
        date: new Date()
      })
      await request(app)
        .put(`/api/surveys/${survey.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'invalid_answer'
        })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken and valid answer', async () => {
      const { accessToken } = await makeAccessToken()
      const survey = await surveyCollection.insertOne({
        question: 'Question 2',
        answers: [{
          image: 'http://image-name.com',
          answer: 'Answer 1'
        },
        {
          answer: 'Answer 2'
        }],
        date: new Date()
      })
      await request(app)
        .put(`/api/surveys/${survey.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })

    test('Should return 200 on update survey result with accessToken and valid answer', async () => {
      const { accessToken, accountId } = await makeAccessToken()
      const survey = await surveyCollection.insertOne({
        question: 'Question 2',
        answers: [{
          image: 'http://image-name.com',
          answer: 'Answer 1'
        },
        {
          answer: 'Answer 2'
        }],
        date: new Date()
      })
      await surveyResultCollection.insertOne({
        surveyId: survey.insertedId.toString(),
        accountId,
        answer: 'Answer 1',
        date: new Date()
      })
      await request(app)
        .put(`/api/surveys/${survey.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 2'
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on loads survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    test('Should return 403 on loads survey result with invalid surveyId', async () => {
      const { accessToken } = await makeAccessToken()
      await request(app)
        .get(`/api/surveys/${new ObjectId().toString()}/results`)
        .set('x-access-token', accessToken)
        .expect(403)
    })

    test('Should return 200 on load survey result with accessToken', async () => {
      const { accessToken } = await makeAccessToken()
      const survey = await surveyCollection.insertOne({
        question: 'Question 1',
        answers: [{
          image: 'http://image-name.com',
          answer: 'Answer 1'
        },
        {
          answer: 'Answer 2'
        }],
        date: new Date()
      })
      await request(app)
        .get(`/api/surveys/${survey.insertedId.toString()}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
