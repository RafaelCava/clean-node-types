import { DbCheckSurveyById } from '@/data/usecases/survey/check-survey-by-id/db-check-survey-by-id'
import { CheckSurveyById } from '@/domain/usecases/survey/check-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbCheckSurveyById = (): CheckSurveyById => {
  return new DbCheckSurveyById(new SurveyMongoRepository())
}
