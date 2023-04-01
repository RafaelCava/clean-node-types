import { mockSurveyResultModel, throwError } from '@/domain/test'
import { InvalidParamError } from '@/presentation/erros'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { CheckSurveyByIdSpy, LoadSurveyResultSpy } from '@/presentation/test'
import MockDate from 'mockdate'
import { LoadSurveyResultController } from './load-survey-result-controller'
import { CheckSurveyById, LoadSurveyResult } from './load-survey-result-controller-protocols'

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyResultStub: LoadSurveyResult
  checkSurveyByIdSpy: CheckSurveyById
}

const makeSut = (): SutTypes => {
  const loadSurveyResultStub = LoadSurveyResultSpy()
  const checkSurveyByIdSpy = CheckSurveyByIdSpy()
  const sut = new LoadSurveyResultController(checkSurveyByIdSpy, loadSurveyResultStub)
  return {
    sut,
    loadSurveyResultStub,
    checkSurveyByIdSpy
  }
}

const mockFakeRequest = (): LoadSurveyResultController.Request => ({
  accountId: 'any_account_id',
  surveyId: 'any_survey_id'
})

describe('SaveSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call checkSurveyById with correct value', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    const loadByIdSpy = jest.spyOn(checkSurveyByIdSpy, 'checkById')
    const request = mockFakeRequest()
    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should returns 403 if checkSurveyByIdSpy returns false', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    jest.spyOn(checkSurveyByIdSpy, 'checkById').mockReturnValueOnce(Promise.resolve(false))
    const request = mockFakeRequest()
    const res = await sut.handle(request)
    expect(res).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should returns 500 if checkSurveyByIdSpy throws', async () => {
    const { sut, checkSurveyByIdSpy } = makeSut()
    jest.spyOn(checkSurveyByIdSpy, 'checkById').mockImplementationOnce(throwError)
    const request = mockFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyResultStub, 'load')
    const request = mockFakeRequest()
    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id', 'any_account_id')
  })

  test('Should returns 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    jest.spyOn(loadSurveyResultStub, 'load').mockImplementationOnce(throwError)
    const request = mockFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should returns 200 if LoadSurveyResult returns empty values', async () => {
    const { sut } = makeSut()
    const request = mockFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
    for (const item of [0, 1, 2]) {
      expect(httpResponse.body.answers[item].count).toBe(0)
      expect(httpResponse.body.answers[item].percent).toBe(0)
    }
  })
})
