import { mockAddAccountParams, throwError } from '@/domain/test'
import { HasherSpy, AddAccountRepositorySpy, CheckAccountByEmailRepositorySpy } from '@/data/test'
import { DbAddAccount } from './db-add-account'
import { Hasher, AddAccountRepository, CheckAccountByEmailRepository } from './db-add-account-protocols'

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  checkAccountByEmailRepositorySpy: CheckAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = HasherSpy()
  const addAccountRepositoryStub = AddAccountRepositorySpy()
  const checkAccountByEmailRepositorySpy = CheckAccountByEmailRepositorySpy()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub, checkAccountByEmailRepositorySpy)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositorySpy
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = mockAddAccountParams()
    await sut.add(accountData)
    expect(hasherSpy).toHaveBeenCalledWith('any_value')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)
    const accountData = mockAddAccountParams()
    const isValid = sut.add(accountData)
    await expect(isValid).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = mockAddAccountParams()
    await sut.add(accountData)
    accountData.password = 'hashed_password'
    expect(addSpy).toHaveBeenCalledWith(accountData)
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)
    const accountData = mockAddAccountParams()
    const isValid = sut.add(accountData)
    await expect(isValid).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()
    const accountData = mockAddAccountParams()
    const isValid = await sut.add(accountData)
    expect(isValid).toEqual(true)
  })

  test('Should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.resolve(false))
    const accountData = mockAddAccountParams()
    const isValid = await sut.add(accountData)
    expect(isValid).toBe(false)
  })

  test('Should returns false if CheckAccountByEmailRepository returns false', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    jest.spyOn(checkAccountByEmailRepositorySpy, 'checkByEmail').mockReturnValueOnce(Promise.resolve(true))
    const accountData = mockAddAccountParams()
    const isValid = await sut.add(accountData)
    expect(isValid).toBe(false)
  })

  test('Should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositorySpy } = makeSut()
    const loadByEmailSpy = jest.spyOn(checkAccountByEmailRepositorySpy, 'checkByEmail')
    const accountData = mockAddAccountParams()
    await sut.add(accountData)
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
