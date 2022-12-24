import { serverError } from '../../../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Validation, Controller } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)
      return new Promise(resolve => resolve(null))
    } catch (err) {
      return serverError(err)
    }
  }
}
