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
      const accountFake = await accountCollection.insertOne(mockAccountModel())
      const surveyResult = await sut.loadBySurveyId(surveyFake.insertedId.toString(), accountFake.insertedId.toString())
      expect(surveyResult).toBeNull()
    })

    test('Should load survey result', async () => {
      const sut = makeSut()
      const accountFake = await accountCollection.insertOne(mockAccountModel())
      const accountFake2 = await accountCollection.insertOne(mockAccountModel())
      const surveyFake = await surveyCollection.insertOne(mockSurveyModel())
      await sut.save({
        surveyId: surveyFake.insertedId as unknown as string,
        accountId: accountFake.insertedId as unknown as string,
        answer: mockSurveyModel().answers[1].answer,
        date: new Date()
      })
      await sut.save({
        surveyId: surveyFake.insertedId as unknown as string,
        accountId: accountFake2.insertedId as unknown as string,
        answer: mockSurveyModel().answers[1].answer,
        date: new Date()
      })
      const surveyResult = await sut.loadBySurveyId(surveyFake.insertedId.toString(), accountFake.insertedId.toString())
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].percent).toBe(0)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[2].percent).toBe(0)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result 2', async () => {
      const sut = makeSut()
      const accountFake = await accountCollection.insertOne(mockAccountModel())
      const accountFake2 = await accountCollection.insertOne(mockAccountModel())
      const accountFake3 = await accountCollection.insertOne(mockAccountModel())
      const surveyFake = await surveyCollection.insertOne(mockSurveyModel())
      await sut.save({
        surveyId: surveyFake.insertedId as unknown as string,
        accountId: accountFake.insertedId as unknown as string,
        answer: mockSurveyModel().answers[0].answer,
        date: new Date()
      })
      await sut.save({
        surveyId: surveyFake.insertedId as unknown as string,
        accountId: accountFake2.insertedId as unknown as string,
        answer: mockSurveyModel().answers[1].answer,
        date: new Date()
      })
      await sut.save({
        surveyId: surveyFake.insertedId as unknown as string,
        accountId: accountFake3.insertedId as unknown as string,
        answer: mockSurveyModel().answers[1].answer,
        date: new Date()
      })
      const surveyResult = await sut.loadBySurveyId(surveyFake.insertedId.toString(), accountFake2.insertedId.toString())
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answers[0].percent).toBe(67)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(surveyResult.answers[1].percent).toBe(33)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[2].percent).toBe(0)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].isCurrentAccountAnswer).toBe(false)
    })

    test('Should load survey result 3', async () => {
      const sut = makeSut()
      const accountFake = await accountCollection.insertOne(mockAccountModel())
      const accountFake2 = await accountCollection.insertOne(mockAccountModel())
      const accountFake3 = await accountCollection.insertOne(mockAccountModel())
      const surveyFake = await surveyCollection.insertOne(mockSurveyModel())
      await sut.save({
        surveyId: surveyFake.insertedId as unknown as string,
        accountId: accountFake.insertedId as unknown as string,
        answer: mockSurveyModel().answers[0].answer,
        date: new Date()
      })
      await sut.save({
        surveyId: surveyFake.insertedId as unknown as string,
        accountId: accountFake2.insertedId as unknown as string,
        answer: mockSurveyModel().answers[1].answer,
        date: new Date()
      })
      const surveyResult = await sut.loadBySurveyId(surveyFake.insertedId.toString(), accountFake3.insertedId.toString())
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
      expect(surveyResult.answers[2].percent).toBe(0)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].isCurrentAccountAnswer).toBe(false)
    })
  })
})
