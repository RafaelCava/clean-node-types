import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from '../erros'
import { forbidden } from '../helpers/http/http-helper'

const makeSut = (): AuthMiddleware => {
  return new AuthMiddleware()
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
