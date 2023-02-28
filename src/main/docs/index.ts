import { badRequest, serverError, unauthorized } from './components'
import {
  errorSchema,
  accountSchema,
  loginParamsSchema
} from './schemas'
import { loginPath } from './paths'

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
    name: 'Surveys'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    serverError,
    unauthorized
  }
}
