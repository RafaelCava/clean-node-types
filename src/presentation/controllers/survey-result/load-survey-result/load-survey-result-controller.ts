import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller } from '@/presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../save-survey-result/save-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyResult: LoadSurveyResult) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyResult = await this.loadSurveyResult.load(httpRequest.params.surveyId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
