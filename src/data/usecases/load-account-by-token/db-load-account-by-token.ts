import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '@/data/usecases/add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const validate = await this.decrypter.decrypt(accessToken)
    if (!validate) return null
    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    return account
  }
}
