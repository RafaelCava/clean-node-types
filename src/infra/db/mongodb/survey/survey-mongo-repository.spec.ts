import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as any)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

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
