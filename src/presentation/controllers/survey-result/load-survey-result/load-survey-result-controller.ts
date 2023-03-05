import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, HttpResponse, LoadSurveyById, LoadSurveyResult, Controller } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById, private readonly loadSurveyResult: LoadSurveyResult) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.loadSurveyById.loadById(httpRequest.params.surveyId)
      const surveyResult = await this.loadSurveyResult.load(httpRequest.params.surveyId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
