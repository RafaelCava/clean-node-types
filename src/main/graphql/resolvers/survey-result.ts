import { adaptResolver } from '@/main/adapters/apollo-server-resolver-adapter'
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey-result/load-survey-result/load-survey-result-controller-factory'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'

export default {
  Query: {
    surveyResult: async (parent: any, args: any, ctx: any) => adaptResolver(makeLoadSurveyResultController(), args, ctx)
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any, ctx: any) => adaptResolver(makeSaveSurveyResultController(), args, ctx)
  }
}
