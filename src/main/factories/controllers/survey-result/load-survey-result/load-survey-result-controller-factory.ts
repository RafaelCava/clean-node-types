import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result/load-survey-result/db-load-survey-result-factory'
import { makeDbCheckSurveyById } from '@/main/factories/usecases/survey/check-survey-by-id/db-check-survey-by-id-factory'

export const makeLoadSurveyResultController = (): Controller => {
  return makeLogControllerDecorator(new LoadSurveyResultController(makeDbCheckSurveyById(), makeDbLoadSurveyResult()))
}
