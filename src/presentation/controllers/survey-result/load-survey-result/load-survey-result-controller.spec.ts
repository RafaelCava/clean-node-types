import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
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
})
