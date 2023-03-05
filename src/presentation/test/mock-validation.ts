import { Validation } from '@/presentation/protocols'

export const ValidationSpy = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null as any
    }
  }
  return new ValidationStub()
}
