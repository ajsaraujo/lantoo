import { expect } from 'chai'
import { MockPreferenceStorage } from '../preferences-storage'
import { GetPreferenceUseCase } from './get-preference-use-case'

describe('GetPreferenceUseCase', () => {
  let storage: MockPreferenceStorage
  let getPreference: GetPreferenceUseCase

  beforeEach(() => {
    storage = new MockPreferenceStorage()
    getPreference = new GetPreferenceUseCase(storage)
  })

  it('should return a falsy value if there is no value set', () => {
    expect(getPreference.run('lang')).to.eventually.not.be.ok
  })

  it('should return a value if there is one', () => {
    storage.set('lang', 'pt-BR')
    expect(getPreference.run('lang')).to.eventually.equal('pt-BR')
  })
})
