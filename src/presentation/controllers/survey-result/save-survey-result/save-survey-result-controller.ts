import { InvalidParamError, MissingParamError } from '@/presentation/erros'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse, SaveSurveyResult, LoadAnswersBySurvey } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadAnswersBySurvey, private readonly saveSurveyResult: SaveSurveyResult) {}
  async handle (request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { accountId, answer, surveyId } = request
      const answers = await this.loadSurveyById.loadAnswers(surveyId)
      if (!answers) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      if (!answer) {
        return forbidden(new MissingParamError('answer'))
      }
      if (!answers.find(item => (item === answer))) {
        return forbidden(new InvalidParamError('answer'))
      }
      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string
    answer: string
    accountId: string
  }
}
