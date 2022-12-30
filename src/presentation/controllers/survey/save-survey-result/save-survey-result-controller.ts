import { Controller, HttpRequest, HttpResponse, SaveSurveyResult } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly saveSurveyResult: SaveSurveyResult) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveyResult = {
      ...httpRequest.body,
      date: new Date()
    }
    await this.saveSurveyResult.save(surveyResult)
    return new Promise(resolve => resolve(null))
  }
}
