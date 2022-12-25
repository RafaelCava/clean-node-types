import { Encrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'
export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    return await jwt.sign({ id: value }, this.secret)
  }

  async decrypt (value: string): Promise<string> {
    return await jwt.verify(value, this.secret) as string
  }
}
