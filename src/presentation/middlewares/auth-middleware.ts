import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../erros'
import {
  Middleware,
  LoadAccountByToken,
  HttpResponse
} from './middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (!accessToken) return forbidden(new AccessDeniedError())
      const account = await this.loadAccountByToken.load(accessToken, this.role)
      if (!account) return forbidden(new AccessDeniedError())
      return ok({ accountId: account.id })
    } catch (err) {
      return serverError(err)
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
