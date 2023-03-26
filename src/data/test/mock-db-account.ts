import {
  UpdateAccessTokenRepository,
  LoadAccountByTokenRepository,
  LoadAccountByEmailRepository,
  AddAccountRepository,
  CheckAccountByEmailRepository
} from '@/data/protocols/db/account'
import { mockAccountModel } from '@/domain/test'

export const AddAccountRepositorySpy = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountRepository.Params): Promise<AddAccountRepository.Result> {
      return Promise.resolve(true)
    }
  }
  return new AddAccountRepositoryStub()
}

export const LoadAccountByEmailRepositorySpy = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<LoadAccountByEmailRepository.Result> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const LoadAccountByTokenRepositorySpy = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepository.Result> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

export const UpdateAccessTokenRepositorySpy = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, token: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

export const CheckAccountByEmailRepositorySpy = (): CheckAccountByEmailRepository => {
  class CheckAccountByEmailRepositorySpy implements CheckAccountByEmailRepository {
    async checkByEmail (email: string): Promise<boolean> {
      return Promise.resolve(false)
    }
  }
  return new CheckAccountByEmailRepositorySpy()
}
