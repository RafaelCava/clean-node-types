import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../erros'
import { forbidden, serverError } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (private readonly loadAccountByToken: LoadAccountByToken) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.headers) return forbidden(new AccessDeniedError())
      if (httpRequest.headers && !httpRequest.headers['x-access-token']) {
        return forbidden(new AccessDeniedError())
      }
      await this.loadAccountByToken.load(httpRequest.headers['x-access-token'])
      return new Promise(resolve => resolve(null))
    } catch (err) {
      return serverError(err)
    }
  }
}
