import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { makeDbAddsurvey } from '../../../usecases/survey/add-survey/db-add-survey-factory'

export const makeAddSurveyController = (): Controller => {
  return makeLogControllerDecorator(new AddSurveyController(makeAddSurveyValidation(), makeDbAddsurvey()))
}
