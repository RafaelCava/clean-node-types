import { SignUpController } from './signup-controller'
import { MissingParamError, ServerError, EmailInUseError } from '../../../erros'
import {
  AddAccount,
  Validation,
  Authentication
} from './signup-controller-protocols'
import { badRequest, forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { AuthenticationSpy, ValidationSpy, AddAccountSpy } from '@/presentation/test'

type SutTypes = {
  sut: SignUpController
  validationStub: Validation
  addAccountStub: AddAccount
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = AddAccountSpy()
  const validationStub = ValidationSpy()
  const authenticationStub = AuthenticationSpy()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return { sut, validationStub, addAccountStub, authenticationStub }
}

const mockRequest = (): SignUpController.Request => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_value',
  passwordConfirmation: 'any_value'
})

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null as any)))
  })

  test('Should return 400 if Validation throws an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = mockRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(mockRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_value'
    })
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null as any))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token', name: 'any_name' }))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const request = mockRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_value'
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null as any)))
  })
})
