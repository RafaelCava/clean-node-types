import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  },
  async verify (): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}))

const makeSut = (secret: string): JwtAdapter => {
  return new JwtAdapter(secret)
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut('secret')
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should return a encrypt value on sign succeeds', async () => {
      const sut = makeSut('secret')
      const encrypteValue = await sut.encrypt('any_id')
      expect(encrypteValue).toBe('any_token')
    })

    test('Should throws if sign throws', async () => {
      const sut = makeSut('secret')
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('Should call decrypt with correct values', async () => {
      const secret = 'secret'
      const sut = makeSut(secret)
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', secret)
    })

    test('Should return a value on verify succeeds', async () => {
      const secret = 'secret'
      const sut = makeSut(secret)
      const value = await sut.decrypt('any_token')
      expect(value).toBeTruthy()
      expect(value).toBe('any_token')
    })

    test('Should throws if verify throws', async () => {
      const sut = makeSut('secret')
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error() })
      const promise = sut.decrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })
})
