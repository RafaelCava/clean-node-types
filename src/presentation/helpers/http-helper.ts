import { HttpResponse } from '../protocols/https'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
