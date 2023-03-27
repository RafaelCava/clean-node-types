import express from 'express'
import setupMiddlewares from './middlewares'
import setupApolloServer from './apollo-server'
import setupRoutes from './routes'
import setupSwagger from './swagger'

const app = express()
setupApolloServer(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)

export default app
