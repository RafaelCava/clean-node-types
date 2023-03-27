import { Controller } from '@/presentation/protocols'
import { UserInputError, AuthenticationError, ForbiddenError, ApolloError } from 'apollo-server-express'

export const adaptResolver = async (controller: Controller, args?: any): Promise<any> => {
  const request = { ...(args || {}) }
  const response = await controller.handle(request)
  const strategies = {
    200: () => response.body,
    204: () => response.body,
    400: () => { throw new UserInputError(response.body.message) },
    401: () => { throw new AuthenticationError(response.body.message) },
    403: () => { throw new ForbiddenError(response.body.message) }
  }
  return strategies[response.statusCode]() || (() => { throw new ApolloError(response.body.message || 'vapo') })()
}
