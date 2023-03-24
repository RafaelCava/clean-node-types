import { mockSurveyResultModel, throwError } from '@/domain/test'
import { InvalidParamError } from '@/presentation/erros'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadSurveyByIdSpy, LoadSurveyResultSpy } from '@/presentation/test'
import MockDate from 'mockdate'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { HttpRequest, LoadSurveyById, LoadSurveyResult } from './load-survey-result-controller-protocols'

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyResultStub: LoadSurveyResult
  loadSurveyByIdStub: LoadSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyResultStub = LoadSurveyResultSpy()
  const loadSurveyByIdStub = LoadSurveyByIdSpy()
  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)
  return {
    sut,
    loadSurveyResultStub,
    loadSurveyByIdStub
  }
}

const mockFakeRequest = (): HttpRequest => ({
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

  test('Should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const httpRequest = mockFakeRequest()
    await sut.handle(httpRequest)
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should returns 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpRequest = mockFakeRequest()
    const res = await sut.handle(httpRequest)
    expect(res).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should returns 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockImplementationOnce(throwError)
    const httpRequest = mockFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyResultStub, 'load')
    const httpRequest = mockFakeRequest()
    await sut.handle(httpRequest)
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id', 'any_account_id')
  })

  test('Should returns 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError)
    const httpRequest = mockFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should returns 200 if LoadSurveyResult returns empty values', async () => {
    const { sut } = makeSut()
    const httpRequest = mockFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
    for (const item of [0, 1, 2]) {
      expect(httpResponse.body.answers[item].count).toBe(0)
      expect(httpResponse.body.answers[item].percent).toBe(0)
    }
  })
})
