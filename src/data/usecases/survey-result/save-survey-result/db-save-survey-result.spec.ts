import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { mockSaveSurveyResultRepository } from '@/data/test'
import { mockSaveSurveyResultModel, mockSurveyResultModel, throwError } from '@/domain/test'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(mockSaveSurveyResultModel())
    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultModel())
  })

  test('Should throws if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
    const promise = sut.save(mockSaveSurveyResultModel())
    expect(promise).rejects.toThrow()
  })

  test('Should return save survey result on success', async () => {
    const { sut } = makeSut()
    const saveSurveyResult = await sut.save(mockSaveSurveyResultModel())
    expect(saveSurveyResult).toEqual(mockSurveyResultModel())
  })
})
