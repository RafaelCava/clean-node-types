import { HttpResponse } from './https'

export interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse>
}
