import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import MockDate from 'mockdate'
import { mockAccountModel, mockAddSurveyParams } from '@/domain/test'

let surveyCollection: Collection
let accountCollection: Collection
let surveyResultCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
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

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut = makeSut()
      const surveyData = {
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        },
        {
          answer: 'other_answer'
        }],
        date: new Date()
      }
      await sut.add(surveyData)
      const survey = await surveyCollection.findOne({ question: surveyData.question })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should return all surveys on success', async () => {
      const sut = makeSut()
      const account = await accountCollection.insertOne(mockAccountModel())
      const addSurveyModels = [mockAddSurveyParams(), mockAddSurveyParams()]
      const result = await surveyCollection.insertMany(addSurveyModels)
      await surveyResultCollection.insertOne({
        accountId: account.insertedId,
        surveyId: result.insertedIds[0],
        answer: addSurveyModels[0].answers[0].answer,
        date: new Date()
      })
      const surveys = await sut.loadAll(account.insertedId.toString())
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe(addSurveyModels[0].question)
      expect(surveys[0].didAnswer).toBe(true)
      expect(surveys[1].question).toBe(addSurveyModels[1].question)
      expect(surveys[1].didAnswer).toBe(false)
    })

    test('Should load a empty list', async () => {
      const account = await accountCollection.insertOne(mockAccountModel())
      const sut = makeSut()
      const surveys = await sut.loadAll(account.insertedId.toString())
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should return survey if survey exists', async () => {
      const sut = makeSut()
      const survey = await surveyCollection.insertOne({
        question: 'any_question_1',
        answers: [{
          image: 'any_image_1',
          answer: 'any_answer_1'
        },
        {
          answer: 'other_answer_1'
        }],
        date: new Date()
      })
      const surveyFound = await surveyCollection.findOne(survey.insertedId)
      const surveyLoad = await sut.loadById(survey.insertedId.toString())
      expect(surveyLoad).toEqual(MongoHelper.map(surveyFound))
    })

    test('Should return null with survey not exists', async () => {
      const sut = makeSut()
      const surveyLoad = await sut.loadById(new ObjectId().toString())
      expect(surveyLoad).toBeNull()
    })
  })

  describe('loadAnswers()', () => {
    test('Should load answers if survey exists', async () => {
      const sut = makeSut()
      const survey = await surveyCollection.insertOne({
        question: 'any_question_1',
        answers: [{
          image: 'any_image_1',
          answer: 'any_answer_1'
        },
        {
          answer: 'other_answer_1'
        }],
        date: new Date()
      })
      const answers = await sut.loadAnswers(survey.insertedId.toString())
      expect(answers).toEqual([
        'any_answer_1',
        'other_answer_1'
      ])
    })

    test("Should return an empty array if survey don't exists", async () => {
      const sut = makeSut()
      const surveyLoad = await sut.loadAnswers(new ObjectId().toString())
      expect(surveyLoad).toEqual([])
    })
  })

  describe('checkById()', () => {
    test("Should return false if survey don't exists", async () => {
      const sut = makeSut()
      const surveyLoad = await sut.checkById(new ObjectId().toString())
      expect(surveyLoad).toBe(false)
    })

    test('Should return true if survey exists', async () => {
      const sut = makeSut()
      const survey = await surveyCollection.insertOne({
        question: 'any_question_1',
        answers: [{
          image: 'any_image_1',
          answer: 'any_answer_1'
        },
        {
          answer: 'other_answer_1'
        }],
        date: new Date()
      })
      const surveyLoad = await sut.checkById(survey.insertedId.toString())
      expect(surveyLoad).toBe(true)
    })
  })
})
