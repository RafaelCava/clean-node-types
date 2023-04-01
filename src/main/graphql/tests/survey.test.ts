import MockDate from 'mockdate'
import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { createTestClient } from 'apollo-server-integration-testing'
import { makeApolloServer } from './helpers'
import { gql } from 'apollo-server-express'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let accountCollection: Collection
let surveyCollection: Collection
let apolloServer: any

const mockAccessToken = async (): Promise<string> => {
  const result = await accountCollection.insertOne({
    name: 'Rafael',
    email: 'rafael.cavalcante@gmail.com',
    password: 'any_value',
    role: 'admin'
  })
  const accessToken = sign({ id: result.insertedId }, env.jwtSecret)
  await accountCollection.updateOne({ _id: result.insertedId }, { $set: { accessToken } })
  return accessToken
}

describe('Survey GraphQL', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    apolloServer = await makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL as any)
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
  })

  const surveysQuery = gql`
    query surveys {
      surveys {
        id
        question
        answers {
          image
          answer
        }
        date
        didAnswer
      }
    }
  `

  test('Should return surveys', async () => {
    const accessToken = await mockAccessToken()
    const date = new Date()
    await surveyCollection.insertOne({
      question: 'any_question',
      answers: [
        {
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'other_answer'
        }
      ],
      date
    })
    const { query } = createTestClient({
      apolloServer,
      extendMockRequest: {
        headers: {
          'x-access-token': accessToken
        }
      }
    })
    const res: any = await query(surveysQuery)
    expect(res.data.surveys.length).toBe(1)
    expect(res.data.surveys[0].question).toBe('any_question')
    expect(res.data.surveys[0].date).toBe(date.getTime().toString())
    expect(res.data.surveys[0].didAnswer).toBe(false)
    expect(res.data.surveys[0].answers[0].answer).toBe('any_answer')
  })

  test('Should return AccessDeniedError on invalid credentials', async () => {
    const { query } = createTestClient({
      apolloServer
    })
    const res: any = await query(surveysQuery)
    expect(res.data).toBeFalsy()
    expect(res.errors[0].message).toBe('Access denied')
  })
})
