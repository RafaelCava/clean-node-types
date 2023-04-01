import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory'
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { ForbiddenError } from 'apollo-server-express'
import { GraphQLSchema } from 'graphql'

export const authDirectiveTransformer = (schema: GraphQLSchema): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')
      if (authDirective) {
        const { resolve } = fieldConfig
        fieldConfig.resolve = async (parent, args, context, info) => {
          const request = {
            accessToken: context?.req?.headers?.['x-access-token']
          }
          const response = await makeAuthMiddleware().handle(request)
          if (response.statusCode === 200) {
            Object.assign(context?.req, response.body)
            return resolve.call(this, parent, args, context, info)
          } else {
            throw new ForbiddenError(response.body.message)
          }
        }
      }
      return fieldConfig
    }
  })
}
