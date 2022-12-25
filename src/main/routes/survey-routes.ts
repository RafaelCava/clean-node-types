import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeAddSurveyController()))
}
