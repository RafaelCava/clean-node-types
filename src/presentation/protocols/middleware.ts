import { HttpRequest, HttpResponse } from './https'

export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
