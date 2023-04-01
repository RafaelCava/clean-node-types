import MockDate from 'mockdate'
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { LoadSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '@/data/test'
import { mockSurveyResultModel, throwError } from '@/domain/test'
import { DbLoadSurveyResult } from './db-load-survey-result'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepository
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = LoadSurveyResultRepositorySpy()
  const loadSurveyByIdRepositorySpy = LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy)
  return {
    sut,
    loadSurveyResultRepositorySpy,
    loadSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId')
    await sut.load('any_survey_id', 'any_account_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id', 'any_account_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledTimes(1)
  })

  test('Should throws if LoadSurveyResultRepository throws', () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.load('any_survey_id', 'any_account_id')
    expect(promise).rejects.toThrow()
  })

  test('Should calls LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, loadSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositorySpy, 'loadById')
    await sut.load('any_survey_id', 'any_account_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return surveyResultModel with all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'loadBySurveyId').mockReturnValueOnce(Promise.resolve(null))
    const surveyResult = await sut.load('any_survey_id', 'any_account_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })

  test('Should return surveyResultModel on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any_survey_id', 'any_account_id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
