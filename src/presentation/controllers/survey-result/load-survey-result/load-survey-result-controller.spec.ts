import { mockSurveyResultModel, throwError } from '@/domain/test'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyResult } from '@/presentation/test'
import MockDate from 'mockdate'
import { HttpRequest } from '../save-survey-result/save-survey-result-controller-protocols'
import { LoadSurveyResultController } from './load-survey-result-controller'

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyResultStub: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyResultStub = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(loadSurveyResultStub)
  return {
    sut,
    loadSurveyResultStub
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

  test('Should call LoadSurveyResult', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyResultStub, 'load')
    const httpRequest = mockFakeRequest()
    await sut.handle(httpRequest)
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
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
    expect(httpResponse.body.answers[0].count).toBe(0)
    expect(httpResponse.body.answers[0].percent).toBe(0)
    expect(httpResponse.body.answers[1].count).toBe(0)
    expect(httpResponse.body.answers[1].percent).toBe(0)
    expect(httpResponse.body.answers[2].count).toBe(0)
    expect(httpResponse.body.answers[2].percent).toBe(0)
  })
})
