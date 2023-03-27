import MockDate from 'mockdate'
import { SaveSurveyResult, SaveSurveyResultParams } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { serverError, forbidden, ok } from '@/presentation/helpers/http/http-helper'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answers-by-survey'
import { InvalidParamError, MissingParamError } from '@/presentation/erros'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import { LoadAnswersBySurveySpy, SaveSurveyResultSpy } from '@/presentation/test'

type SutTypes = {
  sut: SaveSurveyResultController
  saveSurveyResultStub: SaveSurveyResult
  loadAnswersBySurveySpy: LoadAnswersBySurvey
}

const makeSut = (): SutTypes => {
  const saveSurveyResultStub = SaveSurveyResultSpy()
  const loadAnswersBySurveySpy = LoadAnswersBySurveySpy()
  const sut = new SaveSurveyResultController(loadAnswersBySurveySpy, saveSurveyResultStub)
  return {
    sut,
    saveSurveyResultStub,
    loadAnswersBySurveySpy
  }
}

const mockSaveSurveyResultModel = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})

const mockFakeRequest = (): SaveSurveyResultController.Request => ({
  accountId: 'any_account_id',
  answer: 'any_answer',
  surveyId: 'any_survey_id'
})

const mockFakeRequestWithoutAnswer = (): Omit<SaveSurveyResultController.Request, 'answer'> => ({
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

  test('Should call LoadSurveyById', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    const loadByIdSpy = jest.spyOn(loadAnswersBySurveySpy, 'loadAnswers')
    const request = mockFakeRequest()
    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should returns 500 if LoadSurveyById throws', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    jest.spyOn(loadAnswersBySurveySpy, 'loadAnswers').mockImplementationOnce(throwError)
    const request = mockFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should returns 403 if LoadSurveyById returns null', async () => {
    const { sut, loadAnswersBySurveySpy } = makeSut()
    jest.spyOn(loadAnswersBySurveySpy, 'loadAnswers').mockReturnValueOnce(Promise.resolve(null))
    const request = mockFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should returns 403 if invalid answer are provided', async () => {
    const { sut } = makeSut()
    const request = mockFakeRequest()
    request.answer = 'invalid_answer'
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should returns 403 if no answer are provided', async () => {
    const { sut } = makeSut()
    const request = mockFakeRequestWithoutAnswer()
    const httpResponse = await sut.handle(request as any)
    expect(httpResponse).toEqual(forbidden(new MissingParamError('answer')))
  })

  test('Should call SaveSurveyResult', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const request = mockFakeRequest()
    await sut.handle(request)
    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultModel())
  })

  test('Should returns 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    jest.spyOn(saveSurveyResultStub, 'save').mockImplementationOnce(throwError)
    const request = mockFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should returns 200 if SaveSurveyResult save result', async () => {
    const { sut } = makeSut()
    const request = mockFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
