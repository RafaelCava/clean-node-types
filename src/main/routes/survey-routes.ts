import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory'
import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeAddSurveyController()))
}
