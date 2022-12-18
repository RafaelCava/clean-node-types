import { HttpRequest, HttpResponse } from './https'

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
