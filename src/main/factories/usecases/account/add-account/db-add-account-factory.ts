import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12
  return new DbAddAccount(
    new BcryptAdapter(salt),
    new AccountMongoRepository(),
    new AccountMongoRepository()
  )
}
