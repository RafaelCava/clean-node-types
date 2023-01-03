import { AuthenticationModel } from '../../models/authentication'

export interface Authentication {
  auth: (authentication: AuthenticationModel) => Promise<string>
}
