import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const accountData = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    const account = await sut.add(accountData)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    for (const key of ['name', 'email', 'password']) {
      expect(account[key]).toBe(accountData[key])
    }
  })
})
