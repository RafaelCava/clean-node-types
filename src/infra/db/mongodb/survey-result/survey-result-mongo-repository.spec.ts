import { Collection, ObjectId } from 'mongodb'
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
      expect(surveyResult.surveyId).toEqual(survey.insertedId)
      expect(surveyResult.answers[0].count).toEqual(1)
      expect(surveyResult.answers[0].percent).toEqual(100)
      expect(surveyResult.answers[0].answer).toBe(mockSurveyModel().answers[0].answer)
      expect(surveyResult.answers[1].count).toEqual(0)
      expect(surveyResult.answers[1].percent).toEqual(0)
    })

    test('Should update a survey result if its not new', async () => {
      const sut = makeSut()
      const accountFake = await accountCollection.insertOne(mockAccountModel())
      const surveyFake = await surveyCollection.insertOne(mockSurveyModel())
      surveyResultCollection.insertOne({
        surveyId: new ObjectId(surveyFake.insertedId),
        accountId: new ObjectId(accountFake.insertedId),
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
      expect(surveyResult.surveyId).toEqual(surveyFake.insertedId)
      expect(surveyResult.answers[1].count).toEqual(0)
      expect(surveyResult.answers[1].percent).toEqual(0)
      expect(surveyResult.answers[0].count).toEqual(1)
      expect(surveyResult.answers[0].percent).toEqual(100)
      expect(surveyResult.answers[0].answer).toBe(mockSurveyModel().answers[1].answer)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should load survey result', async () => {
      const sut = makeSut()
      const accountFake = await accountCollection.insertOne(mockAccountModel())
      const surveyFake = await surveyCollection.insertOne(mockSurveyModel())
      const surveyResult = await sut.save({
        surveyId: surveyFake.insertedId as unknown as string,
        accountId: accountFake.insertedId as unknown as string,
        answer: mockSurveyModel().answers[1].answer,
        date: new Date()
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toEqual(surveyFake.insertedId)
      expect(surveyResult.answers[0].count).toEqual(1)
      expect(surveyResult.answers[0].percent).toEqual(100)
      expect(surveyResult.answers[0].answer).toBe(mockSurveyModel().answers[1].answer)
      expect(surveyResult.answers[1].count).toEqual(0)
      expect(surveyResult.answers[1].percent).toEqual(0)
      expect(surveyResult.answers[2].count).toEqual(0)
      expect(surveyResult.answers[2].percent).toEqual(0)
    })
  })
})
