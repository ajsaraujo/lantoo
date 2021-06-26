import sinon, { SinonSpy } from 'sinon'
import { expect, fancy } from 'fancy-test'
import { PreferencesStorage } from './preferences-storage'
import { IFileSystem } from './file-system'

let storage: PreferencesStorage
let fileSystem: MockFileSystem
let writeSpy: SinonSpy

class MockFileSystem implements IFileSystem {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async readJSON(): Promise<any> {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async writeJSON(_: string, __: any) {}
}

function setup() {
  fileSystem = new MockFileSystem()
  storage = new PreferencesStorage(fileSystem)
  writeSpy = sinon.spy(fileSystem, 'writeJSON')
  storage.configDirectory = 'mock/path'
}

const test = fancy.do(setup)

describe('PreferencesStorage', () => {
  test.it('should read JSON from file system', async () => {
    sinon.stub(fileSystem, 'readJSON').resolves({ lang: 'pt-BR' })

    const value = await storage.get('lang')

    expect(value).to.equal('pt-BR')
  })

  test.it('should call write JSON on set', async () => {
    sinon.stub(fileSystem, 'readJSON').resolves({})

    await storage.set('lang', 'en-US')

    expect(writeSpy.firstCall.lastArg).to.eql({ lang: 'en-US' })
  })

  test.it(
    'should create an empy JSON file if one does not exist yet',
    async () => {
      sinon.stub(fileSystem, 'readJSON').throws({ code: 'ENOENT' })

      await storage.get('lang')

      expect(writeSpy.firstCall.lastArg).to.eql({})
    }
  )
})
