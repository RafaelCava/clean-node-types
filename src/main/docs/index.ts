import { badRequest, serverError, unauthorized, forbidden } from './components'
import {
  errorSchema,
  accountSchema,
  loginParamsSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
  apiKeyAuthSchema
} from './schemas'
import { loginPath, surveysPath } from './paths'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do curso do Mango para realizar enquetes entre programadores',
    version: '2.3.1',
    license: {
      name: 'MIT',
      url: 'https://github.com/RafaelCava/clean-node-types/blob/master/LICENSE'
    },
    contact: {
      name: 'Rafael Cavalcante',
      email: 'ra.facavalcante@hotmail.com',
      url: 'https://www.linkedin.com/in/rafael-cavalcantee/'
    }
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquete'
  }],
  paths: {
    '/login': loginPath,
    '/surveys': surveysPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    surveyAnswer: surveyAnswerSchema,
    survey: surveySchema,
    surveys: surveysSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    serverError,
    unauthorized,
    forbidden
  }
}
