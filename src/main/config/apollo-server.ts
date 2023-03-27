import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'
import { Express } from 'express'
import { ApolloServer } from 'apollo-server-express'

export default (app: Express): void => {
  const server = new ApolloServer({
    resolvers,
    typeDefs
  })
  server.start().then(() => {
    server.applyMiddleware({ app })
  })
}
