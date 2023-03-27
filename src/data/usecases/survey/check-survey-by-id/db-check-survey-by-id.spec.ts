import { DbCheckSurveyById } from './db-check-survey-by-id'
import { CheckSurveyByIdRepository } from './db-check-survey-by-id-protocols'
import { CheckSurveyByIdRepositorySpy } from '@/data/test'
import { throwError } from '@/domain/test'
type SutTypes = {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)
  return {
    sut,
    checkSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyById UseCase', () => {
  test('Should call CheckSurveyByIdRepository with correct mail', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    const loadByIdSpy = jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById')
    await sut.checkById('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throws if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById').mockImplementationOnce(throwError)
    const promise = sut.checkById('any_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should return true if CheckSurveyByIdRepository returns true', async () => {
    const { sut } = makeSut()
    const survey = await sut.checkById('any_id')
    expect(survey).toBe(true)
  })

  test('Should return null if CheckSurveyByIdRepository returns null', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(checkSurveyByIdRepositorySpy, 'checkById').mockReturnValueOnce(Promise.resolve(false))
    const survey = await sut.checkById('invalid_id')
    expect(survey).toBe(false)
  })
})
