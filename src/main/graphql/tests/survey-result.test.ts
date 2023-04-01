import MockDate from 'mockdate'
import { Collection, ObjectId } from 'mongodb'
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

describe('SurveyResult GraphQL', () => {
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

  describe('LoadSurveyResult Query', () => {
    const surveysResultQuery = gql`
      query surveyResult ($surveyId: String!) {
        surveyResult (surveyId: $surveyId) { 
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `
    test('Should return surveyResult', async () => {
      const accessToken = await mockAccessToken()
      const date = new Date()
      const survey = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          },
          {
            image: 'any_image',
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
      const res: any = await query(surveysResultQuery, {
        variables: {
          surveyId: survey.insertedId.toString()
        }
      })

      expect(res.data.surveyResult).toBeTruthy()
      expect(res.data.surveyResult.question).toBe('any_question')
      expect(res.data.surveyResult.date).toBe(date.getTime().toString())
      expect(res.data.surveyResult.answers[0].image).toBeFalsy()
      expect(res.data.surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(res.data.surveyResult.answers[1].image).toBeFalsy()
      expect(res.data.surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should return AccessDeniedError on invalid credentials', async () => {
      const survey = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          },
          {
            image: 'any_image',
            answer: 'other_answer'
          }
        ],
        date: new Date()
      })
      const { query } = createTestClient({
        apolloServer
      })
      const res: any = await query(surveysResultQuery, {
        variables: {
          surveyId: survey.insertedId.toString()
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Access denied')
    })

    test('Should return InvalidParamError if survey not exists', async () => {
      const accessToken = await mockAccessToken()
      const { query } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await query(surveysResultQuery, {
        variables: {
          surveyId: new ObjectId().toString()
        }
      })
      expect(res.data).toBeFalsy()
      expect(res.errors[0].message).toBe('Invalid param: surveyId')
    })
  })

  describe('SaveSurveyResult Mutation', () => {
    const saveSurveyResultMutation = gql`
      mutation saveSurveyResult ($surveyId: String!, $answer: String!) {
        saveSurveyResult (surveyId: $surveyId, answer: $answer) { 
          surveyId
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }
    `
    test('Should return SurveyResult', async () => {
      const accessToken = await mockAccessToken()
      const date = new Date()
      const survey = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          },
          {
            image: 'any_image',
            answer: 'other_answer'
          }
        ],
        date
      })
      const { mutate } = createTestClient({
        apolloServer,
        extendMockRequest: {
          headers: {
            'x-access-token': accessToken
          }
        }
      })
      const res: any = await mutate(saveSurveyResultMutation, {
        variables: {
          surveyId: survey.insertedId.toString(),
          answer: 'any_answer'
        }
      })

      expect(res.data.saveSurveyResult).toBeTruthy()
      expect(res.data.saveSurveyResult.question).toBe('any_question')
      expect(res.data.saveSurveyResult.date).toBe(date.getTime().toString())
      expect(res.data.saveSurveyResult.answers).toEqual([
        {
          answer: 'any_answer',
          count: 1,
          percent: 100,
          isCurrentAccountAnswer: true
        },
        {
          answer: 'other_answer',
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ])
    })
  })
})
