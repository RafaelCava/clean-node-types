import { InvalidParamError } from '@/presentation/erros'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { HttpRequest, HttpResponse, LoadSurveyById, LoadSurveyResult, Controller } from './load-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById, private readonly loadSurveyResult: LoadSurveyResult) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const surveyResult = await this.loadSurveyResult.load(httpRequest.params.surveyId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
