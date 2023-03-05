import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

export const LogErrorRepositorySpy = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}
