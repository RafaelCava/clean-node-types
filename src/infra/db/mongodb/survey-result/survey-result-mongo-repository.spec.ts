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
      await sut.save({
        surveyId: survey.insertedId as unknown as string,
        accountId: account.insertedId as unknown as string,
        answer: mockSurveyModel().answers[0].answer,
        date: new Date()
      })
      const saveResult = await surveyResultCollection.findOne({ surveyId: survey.insertedId, accountId: account.insertedId })
      expect(saveResult).toBeTruthy()
      expect(saveResult.answer).toBe(mockSurveyModel().answers[0].answer)
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
      await sut.save({
        surveyId: surveyFake.insertedId as unknown as string,
        accountId: accountFake.insertedId as unknown as string,
        answer: mockSurveyModel().answers[1].answer,
        date: new Date()
      })
      const saveResult = await surveyResultCollection.findOne({ surveyId: surveyFake.insertedId, accountId: accountFake.insertedId })
      expect(saveResult).toBeTruthy()
      expect(saveResult.answer).toBe(mockSurveyModel().answers[1].answer)
    })
  })

  describe('loadBySurveyId()', () => {
    test('Should return null if not have surveyResult', async () => {
      const sut = makeSut()
      const surveyFake = await surveyCollection.insertOne(mockSurveyModel())
      const surveyResult = await sut.loadBySurveyId(surveyFake.insertedId.toString())
      expect(surveyResult).toBeNull()
    })
  })
})
