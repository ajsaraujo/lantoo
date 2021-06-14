import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

import { IPreferencesStorage } from '../preferences-storage'
import { SetPreferenceUseCase } from './set-preference-use-case'

chai.use(chaiAsPromised)

class MockPreferenceStorage implements IPreferencesStorage {
  private preferencesObject: { [key: string]: string } = {}

  async get(key: string) {
    return this.preferencesObject[key]
  }

  async set(key: string, value: string) {
    this.preferencesObject[key] = value
  }
}

describe('SetPreferenceUseCase', () => {
  let storage: MockPreferenceStorage
  let setPreference: SetPreferenceUseCase

  beforeEach(() => {
    storage = new MockPreferenceStorage()
    setPreference = new SetPreferenceUseCase(storage)
  })

  it('should set the value of a preference if there is no value set', () => {
    setPreference.run('lang', 'pt-BR')
    expect(storage.get('lang')).to.eventually.equal('pt-BR')
  })

  it('should overwrite the value if one already exists', () => {
    storage.set('lang', 'en-US')
    setPreference.run('lang', 'pt-BR')

    expect(storage.get('lang')).to.eventually.equal('pt-BR')
  })
})
