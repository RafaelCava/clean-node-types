import { HttpResponse, Controller } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LogControllerDecorator } from './log-controller-decorator'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { LogErrorRepositorySpy } from '@/data/test'
import { mockAccountModel } from '@/domain/test'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (request: any): Promise<HttpResponse> {
      return Promise.resolve(ok(mockAccountModel()))
    }
  }
  return new ControllerStub()
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = LogErrorRepositorySpy()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const request = ''
    await sut.handle(request)
    expect(handleSpy).toHaveBeenCalledWith(request)
  })

  test('Should call logErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error))
    const request = ''
    await sut.handle(request)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
