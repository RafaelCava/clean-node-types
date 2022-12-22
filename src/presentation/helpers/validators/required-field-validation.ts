import { MissingParamError } from '../../erros'
import { Validation } from '../../protocols'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}
  validate (input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}
