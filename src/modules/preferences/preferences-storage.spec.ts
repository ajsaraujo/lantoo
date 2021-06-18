import { expect, fancy } from 'fancy-test'
import { PreferencesStorage } from './preferences-storage'
import { IFileSystem } from './file-system'

let storage: PreferencesStorage
let fileSystem: MockFileSystem

class MockFileSystem implements IFileSystem {
  writeJSONCalled = false

  async readJSON() {
    return { lang: 'pt-BR' }
  }

  async writeJSON(path: string, object: any) {
    this.writeJSONCalled = true
  }
}

function initStorage() {
  fileSystem = new MockFileSystem()
  storage = new PreferencesStorage(fileSystem)
}

const test = fancy.do(initStorage)

describe('PreferencesStorage', () => {
  test.it('should read JSON from file system', async () => {
    const value = await storage.get('lang')
    expect(value).to.equal('pt-BR')
  })

  test.it('should call write JSON on set', async () => {
    await storage.set('lang', 'en-US')
    expect(fileSystem.writeJSONCalled).to.be.true
  })
})
