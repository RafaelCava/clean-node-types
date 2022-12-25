import { AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'
import { DbAddSurvey } from './db-add-survey'

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

describe('DbAddSurvey UseCase', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData = makeFakeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should throws if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const surveyData = makeFakeSurveyData()
    const httpResponse = sut.add(surveyData)
    await expect(httpResponse).rejects.toThrow()
  })
})
