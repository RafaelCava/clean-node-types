import { mockAccountModel, mockAuthenticationModel } from '@/domain/test'
import { AddAccount } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/domain/models/account'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AuthenticationModel } from '@/domain/models/authentication'

export const AddAccountSpy = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccount.Params): Promise<AddAccount.Result> {
      return Promise.resolve(true)
    }
  }
  return new AddAccountStub()
}

export const AuthenticationSpy = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<AuthenticationModel> {
      return Promise.resolve(mockAuthenticationModel())
    }
  }
  return new AuthenticationStub()
}

export const LoadAccountByTokenSpy = (): LoadAccountByToken => {
  class LoadAccountByToken implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByToken()
}
