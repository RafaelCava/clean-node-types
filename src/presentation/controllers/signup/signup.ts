import { MissingParamError, InvalidParamError } from '../../erros'
import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { badRequest, serverError } from '../../helpers/http-helper'
export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const account = this.addAccount.add({
        name,
        email,
        password
      })
      return {
        statusCode: 200,
        body: account
      }
    } catch (error) {
      return serverError()
    }
  }
}
