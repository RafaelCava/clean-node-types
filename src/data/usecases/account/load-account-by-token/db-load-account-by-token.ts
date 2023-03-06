import { LoadAccountByToken, Decrypter, LoadAccountByTokenRepository, AccountModel } from './db-load-account-by-token-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    let validate: string
    try {
      validate = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }
    if (!validate) return null
    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    return account
  }
}
