import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../erros'
import {
  Middleware,
  LoadAccountByToken,
  HttpRequest,
  HttpResponse
} from './middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.headers) return forbidden(new AccessDeniedError())
      if (httpRequest.headers && !httpRequest.headers['x-access-token']) {
        return forbidden(new AccessDeniedError())
      }
      const account = await this.loadAccountByToken.load(httpRequest.headers['x-access-token'], this.role)
      if (!account) return forbidden(new AccessDeniedError())
      return ok({ accountId: account.id })
    } catch (err) {
      return serverError(err)
    }
  }
}
