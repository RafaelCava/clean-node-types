import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountColletion = MongoHelper.getCollection('accounts')
    const result = await accountColletion.insertOne(accountData)
    const accountId = result.insertedId
    const account = await accountColletion.findOne({ _id: accountId })
    const { _id, ...accountWithoutId } = account
    return Object.assign({}, accountWithoutId, { id: _id }) as any
  }
}
