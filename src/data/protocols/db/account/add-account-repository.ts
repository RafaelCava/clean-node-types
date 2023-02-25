import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { AccountModel } from '@/domain/models/account'

export interface AddAccountRepository {
  add: (account: AddAccountParams) => Promise<AccountModel>
}
