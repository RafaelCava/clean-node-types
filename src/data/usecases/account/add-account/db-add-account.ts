import { AddAccount, Hasher, AddAccountRepository, LoadAccountByEmailRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccount.Params): Promise<AddAccount.Result> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)
    if (account) return false
    const hashedPassword = await this.hasher.hash(accountData.password)
    const isValid = await this.addAccountRepository.add({ ...accountData, password: hashedPassword }) || false
    return isValid
  }
}
