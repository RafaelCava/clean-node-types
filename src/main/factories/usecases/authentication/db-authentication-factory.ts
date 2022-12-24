import env from '../../../config/env'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../../domain/usecases/authentication'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const { jwtSecret } = env
  return new DbAuthentication(
    new AccountMongoRepository(),
    new BcryptAdapter(salt),
    new JwtAdapter(jwtSecret),
    new AccountMongoRepository()
  )
}
