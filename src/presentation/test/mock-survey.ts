import { AddSurvey } from '@/domain/usecases/survey/add-survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { mockSurveysModels } from '@/domain/test'
import { LoadAnswersBySurvey } from '@/domain/usecases/survey/load-answers-by-survey'
import { CheckSurveyById } from '@/domain/usecases/survey/check-survey-by-id'

export const AddSurveySpy = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurvey.Params): Promise<void> {
      return Promise.resolve()
    }
  }
  return new AddSurveyStub()
}

export const LoadSurveysSpy = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load (accountId: string): Promise<LoadSurveys.Result> {
      return Promise.resolve(mockSurveysModels())
    }
  }
  return new LoadSurveysStub()
}

export const LoadAnswersBySurveySpy = (): LoadAnswersBySurvey => {
  class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
    async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
      return Promise.resolve(['any_answer'])
    }
  }
  return new LoadAnswersBySurveySpy()
}

export const CheckSurveyByIdSpy = (): CheckSurveyById => {
  class CheckSurveyByIdSpy implements CheckSurveyById {
    async checkById (id: string): Promise<CheckSurveyById.Result> {
      return Promise.resolve(true)
    }
  }
  return new CheckSurveyByIdSpy()
}
