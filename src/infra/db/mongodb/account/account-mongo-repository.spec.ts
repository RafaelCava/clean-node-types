import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

const makeFakeAccountData = (): any => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as any)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('add()', () => {
    test('Should return an account on add success', async () => {
      const sut = makeSut()
      const accountData = makeFakeAccountData()
      const account = await sut.add(accountData)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      for (const key of ['name', 'email', 'password']) {
        expect(account[key]).toBe(accountData[key])
      }
    })
  })

  describe('loadByEmail()', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut()
      const accountData = makeFakeAccountData()
      await accountCollection.insertOne(accountData)
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      for (const key of ['name', 'email', 'password']) {
        expect(account[key]).toBe(accountData[key])
      }
    })
    test('Should return null if loadByEmail fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByEmail('any_email@mail.com')
      expect(account).toBeNull()
    })
  })

  describe('updateAccessToken()', () => {
    test('Should return an account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const accountData = makeFakeAccountData()
      const result = (await accountCollection.insertOne(accountData)).insertedId
      let account: any = await accountCollection.findOne({ _id: result })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBeFalsy()
      await sut.updateAccessToken(result.toString(), 'any_token')
      account = await accountCollection.findOne({ _id: result })
      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('Should return an account on loadByToken without role', async () => {
      const sut = makeSut()
      const accountData = makeFakeAccountData()
      accountData.accessToken = 'any_token'
      await accountCollection.insertOne(accountData)
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      for (const key of ['name', 'email', 'password']) {
        expect(account[key]).toBe(accountData[key])
      }
    })

    test('Should return an account on loadByToken with role', async () => {
      const sut = makeSut()
      const accountData = makeFakeAccountData()
      accountData.accessToken = 'any_token'
      accountData.role = 'admin'
      await accountCollection.insertOne(accountData)
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      for (const key of ['name', 'email', 'password', 'role']) {
        expect(account[key]).toBe(accountData[key])
      }
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut()
      const accountData = makeFakeAccountData()
      accountData.accessToken = 'any_token'
      accountData.role = 'operator'
      await accountCollection.insertOne(accountData)
      const account = await sut.loadByToken('any_token', 'admin')
      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut()
      const accountData = makeFakeAccountData()
      accountData.accessToken = 'any_token'
      accountData.role = 'admin'
      await accountCollection.insertOne(accountData)
      const account = await sut.loadByToken('any_token')
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      for (const key of ['name', 'email', 'password', 'role']) {
        expect(account[key]).toBe(accountData[key])
      }
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('any_token')
      expect(account).toBeNull()
    })
  })
})
