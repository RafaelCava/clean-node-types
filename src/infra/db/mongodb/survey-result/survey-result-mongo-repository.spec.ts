import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import MockDate from 'mockdate'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { mockAccountModel, mockSurveyModel } from '@/domain/test'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

describe('Survey Result Mongo Repository', () => {
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
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('save()', () => {
    test('Should save a survey result if its new', async () => {
      const sut = makeSut()
      const account = await accountCollection.insertOne(mockAccountModel())
      const survey = await surveyCollection.insertOne(mockSurveyModel())
      const surveyResult = await sut.save({
        surveyId: survey.insertedId as unknown as string,
        accountId: account.insertedId as unknown as string,
        answer: mockSurveyModel().answers[0].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      const testsCases = [
        { field: 'accountId', value: account.insertedId.toString() },
        { field: 'surveyId', value: survey.insertedId.toString() },
        { field: 'answer', value: mockSurveyModel().answers[0].answer }
      ]
      testsCases.forEach(({ field, value }) => {
        if (field !== 'answer') {
          expect(surveyResult[field].toString()).toBe(value)
        } else {
          expect(surveyResult[field]).toBe(value)
        }
      })
      expect(surveyResult.id).toBeTruthy()
    })

    test('Should update a survey result if its not new', async () => {
      const sut = makeSut()
      const accountFake = await accountCollection.insertOne(mockAccountModel())
      const surveyFake = await surveyCollection.insertOne(mockSurveyModel())
      const res = await surveyResultCollection.insertOne({
        surveyId: surveyFake.insertedId,
        accountId: accountFake.insertedId,
        answer: mockSurveyModel().answers[0].answer,
        date: new Date()
      })
      const surveyResult = await sut.save({
        surveyId: surveyFake.insertedId as unknown as string,
        accountId: accountFake.insertedId as unknown as string,
        answer: mockSurveyModel().answers[1].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      const testsCases = [
        { field: 'accountId', value: accountFake.insertedId.toString() },
        { field: 'surveyId', value: surveyFake.insertedId.toString() },
        { field: 'answer', value: mockSurveyModel().answers[1].answer }
      ]
      testsCases.forEach(({ field, value }) => {
        if (field !== 'answer') {
          expect(surveyResult[field].toString()).toBe(value)
        } else {
          expect(surveyResult[field]).toBe(value)
        }
      })
      expect(surveyResult.id).toEqual(res.insertedId)
    })
  })
})
