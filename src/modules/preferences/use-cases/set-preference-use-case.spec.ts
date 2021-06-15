import { expect } from 'chai'
import { MockPreferenceStorage } from '../preferences-storage'
import { SetPreferenceUseCase } from './set-preference-use-case'

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
