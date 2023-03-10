import { badRequest, serverError, noContent } from '../../../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Validation, Controller, AddSurvey } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation, private readonly addSurvey: AddSurvey) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { question, answers } = httpRequest.body
      await this.addSurvey.add({ question, answers, date: new Date() })
      return noContent()
    } catch (err) {
      return serverError(err)
    }
  }
}
