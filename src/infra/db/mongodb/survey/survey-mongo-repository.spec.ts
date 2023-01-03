import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import MockDate from 'mockdate'

let surveyCollection: Collection

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
      await surveyCollection.insertMany([{
        question: 'any_question_1',
        answers: [{
          image: 'any_image_1',
          answer: 'any_answer_1'
        },
        {
          answer: 'other_answer_1'
        }],
        date: new Date()
      },
      {
        question: 'any_question_2',
        answers: [{
          image: 'any_image_2',
          answer: 'any_answer_2'
        },
        {
          answer: 'other_answer_2'
        }],
        date: new Date()
      }])
      const surveysFound = await surveyCollection.find().toArray()
      const surveys = await sut.loadAll()
      expect(surveys).toEqual(MongoHelper.map(surveysFound))
    })

    test('Should load a empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
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

    test('Should return null with load survey by id fails', async () => {
      const sut = makeSut()
      const surveyLoad = await sut.loadById(new ObjectId().toString())
      expect(surveyLoad).toBeNull()
    })
  })
})
