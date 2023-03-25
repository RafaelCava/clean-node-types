import { HttpResponse } from './https'

export interface Middleware {
  handle: (request: any) => Promise<HttpResponse>
}
