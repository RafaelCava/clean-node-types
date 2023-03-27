import { DbLoadAnswersBySurvey } from '@/data/usecases/survey/load-answers-by-survey/db-load-answers-by-survey'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answers-by-survey'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyById = (): LoadAnswersBySurvey => {
  return new DbLoadAnswersBySurvey(new SurveyMongoRepository())
}
