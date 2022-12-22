export interface Encrypter {
  generate: (value: string) => Promise<string>
}
