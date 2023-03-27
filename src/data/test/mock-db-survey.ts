import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey/check-survey-by-id-repository'
import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey/load-answers-by-survey-repository'
import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel, mockSurveysModels } from '@/domain/test'
import { LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository'

export const AddSurveyRepositorySpy = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyRepository.Params): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyRepositoryStub()
}

export const LoadSurveyByIdRepositorySpy = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (): Promise<LoadSurveyByIdRepository.Result> {
      return Promise.resolve(mockSurveyModel())
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const LoadSurveysRepositorySpy = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll (accountId: string): Promise<SurveyModel[]> {
      return Promise.resolve(mockSurveysModels())
    }
  }
  return new LoadSurveysRepositoryStub()
}

export const CheckSurveyByIdRepositorySpy = (): CheckSurveyByIdRepository => {
  class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
    async checkById (surveyId: string): Promise<CheckSurveyByIdRepository.Result> {
      return Promise.resolve(true)
    }
  }
  return new CheckSurveyByIdRepositorySpy()
}

export const LoadAnswersBySurveyRepositorySpy = (): LoadAnswersBySurveyRepository => {
  class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
    async loadAnswers (surveyId: string): Promise<LoadAnswersBySurveyRepository.Result> {
      return Promise.resolve([
        'any_answer',
        'other_answer',
        'any_answer_3'
      ])
    }
  }
  return new LoadAnswersBySurveyRepositorySpy()
}
