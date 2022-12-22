import { MissingParamError } from '../../erros'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return new MissingParamError('field')
    }
  }
  return new ValidationStub()
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const validationStub = makeValidation()
    const sut = new ValidationComposite([validationStub])
    const error = sut.validate({ other_field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
