import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { makeDbLoadSurveyResult } from '@/main/factories/usecases/survey-result/load-survey-result/db-load-survey-result-factory'

export const makeLoadSurveyResultController = (): Controller => {
  return makeLogControllerDecorator(new LoadSurveyResultController(makeDbLoadSurveyById(), makeDbLoadSurveyResult()))
}
