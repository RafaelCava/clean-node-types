import { SurveyAnswerModel } from '../models/survey'

export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}

export interface LoadSurveys {
  load: () => Promise<SurveyModel[]>
}
