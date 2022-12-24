import { AccessDeniedError } from '../erros'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.headers) return new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
    if (httpRequest.headers && !httpRequest.headers['x-access-token']) {
      return new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
    }
    return new Promise(resolve => resolve(null))
  }
}
