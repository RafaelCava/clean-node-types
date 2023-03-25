import { AddAccount } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/domain/models/account'
import { Authentication } from '@/domain/usecases/account/authentication'

export const mockAddAccountParams = (): AddAccount.Params => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_value'
})

export const mockAccountModel = (): AccountModel => Object.assign({}, mockAddAccountParams(), { id: 'any_id' })

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: 'any_email@mail.com',
  password: 'any_value'
})

export const mockAuthenticationResult = (): Authentication.Result => ({
  accessToken: 'any_token',
  name: 'any_name'
})
