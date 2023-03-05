import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export const mockSurveyModel = (): SurveyModel => ({
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }, {
    answer: 'other_answer'
  }, {
    answer: 'any_answer_3'
  }],
  date: new Date(),
  id: 'any_id',
  question: 'any_question'
})

export const mockSurveysModels = (): SurveyModel[] => ([
  {
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }, {
      answer: 'any_answer_2'
    }],
    date: new Date(),
    id: 'any_id',
    question: 'any_question'
  }
])

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})
