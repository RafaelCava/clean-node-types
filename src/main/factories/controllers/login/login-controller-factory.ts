import { makeLoginValidation } from './login-validation-factory'
import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../../presentation/protocols'
import { LogMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'

export const makeLoginController = (): Controller => {
  return new LogControllerDecorator(
    new LoginController(makeDbAuthentication(), makeLoginValidation()),
    new LogMongoRepository()
  )
}
