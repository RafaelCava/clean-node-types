import { InvalidParamError } from '@/presentation/erros'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, SaveSurveyResult, LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById, private readonly saveSurveyResult: SaveSurveyResult) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      httpRequest.body = Object.assign({}, httpRequest.body, { date: new Date(), surveyId: httpRequest.params.surveyId })
      const surveyResult = await this.saveSurveyResult.save(httpRequest.body)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
