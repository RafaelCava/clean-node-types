import { HttpResponse, Controller, AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { EmailInUseError } from '../../../erros'
export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = request
      const isValid = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!isValid) return forbidden(new EmailInUseError())
      const authenticationModel = await this.authentication.auth({
        email,
        password
      })
      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }
}
