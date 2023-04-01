
import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { hash } from 'bcrypt'
import { createTestClient } from 'apollo-server-integration-testing'
import { makeApolloServer } from './helpers'
import { gql } from 'apollo-server-express'

let accountCollection: Collection
let apolloServer: any

describe('Login GraphQL', () => {
  beforeAll(async () => {
    apolloServer = await makeApolloServer()
    await MongoHelper.connect(process.env.MONGO_URL as any)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const loginQuery = gql`
    query login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        accessToken
        name
      }
    }
  `

  test('Should return an Account on valid credentials', async () => {
    const password = await hash('any_value', 12)
    await accountCollection.insertOne({
      name: 'Rafael',
      email: 'rafael.cavalcante@gmail.com',
      password
    })
    const { query } = createTestClient({ apolloServer })
    const res: any = await query(loginQuery, {
      variables: {
        email: 'rafael.cavalcante@gmail.com',
        password: 'any_value'
      }
    })
    expect(res.data.login.accessToken).toBeTruthy()
    expect(res.data.login.name).toBe('Rafael')
  })
})
