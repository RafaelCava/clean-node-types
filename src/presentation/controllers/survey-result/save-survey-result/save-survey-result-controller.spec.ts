import MockDate from 'mockdate'
import { HttpRequest, SaveSurveyResult, SaveSurveyResultModel, SurveyResultModel, SurveyModel } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { serverError, forbidden, ok } from '@/presentation/helpers/http/http-helper'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError, MissingParamError } from '@/presentation/erros'

const makeLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById (id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(makeFakeSurveyModel()))
    }
  }
  return new LoadSurveyByIdStub()
}

const makeSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(makeFakeSurveyResultModel()))
    }
  }
  return new SaveSurveyResultStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  saveSurveyResultStub: SaveSurveyResult
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = makeSaveSurveyResult()
  const loadSurveyByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
  return {
    sut,
    saveSurveyResultStub,
    loadSurveyByIdStub
  }
}

const makeFakeSurveyResultModel = (): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSaveSurveyResultModel = (): SaveSurveyResultModel => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSurveyModel = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const mockFakeRequest = (): HttpRequest => ({
  accountId: 'any_account_id',
  body: {
    answer: 'any_answer'
  },
  params: {
    surveyId: 'any_survey_id'
  }
})

const mockFakeRequestWithoutAnswer = (): HttpRequest => ({
  accountId: 'any_account_id',
  body: {},
  params: {
    surveyId: 'any_survey_id'
  }
})

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const httpRequest = mockFakeRequest()
    await sut.handle(httpRequest)
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should returns 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockRejectedValueOnce(new Error())
    const httpRequest = mockFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should returns 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = mockFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should returns 403 if invalid answer are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = mockFakeRequest()
    httpRequest.body.answer = 'invalid_answer'
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should returns 403 if no answer are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = mockFakeRequestWithoutAnswer()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new MissingParamError('answer')))
  })

  test('Should call SaveSurveyResult', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const httpRequest = mockFakeRequest()
    await sut.handle(httpRequest)
    expect(saveSpy).toHaveBeenCalledWith(makeFakeSaveSurveyResultModel())
  })

  test('Should returns 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockRejectedValueOnce(new Error())
    const httpRequest = mockFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should returns 200 if SaveSurveyResult save result', async () => {
    const { sut } = makeSut()
    const httpRequest = mockFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeSurveyResultModel()))
  })
})
