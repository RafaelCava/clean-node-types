import { badRequest, serverError } from '../../../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Validation, Controller } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      return new Promise(resolve => resolve(null))
    } catch (err) {
      return serverError(err)
    }
  }
}
