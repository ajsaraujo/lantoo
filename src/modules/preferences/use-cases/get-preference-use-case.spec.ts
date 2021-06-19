import { expect, fancy } from 'fancy-test'
import { MockPreferenceStorage } from '../preferences-storage'
import { GetPreferenceUseCase } from './get-preference-use-case'

describe('GetPreferenceUseCase', () => {
  let storage: MockPreferenceStorage
  let getPreference: GetPreferenceUseCase

  const test = fancy.do(() => {
    storage = new MockPreferenceStorage()
    getPreference = new GetPreferenceUseCase(storage)
  })

  test.it('should return a falsy value if there is no value set', () => {
    expect(getPreference.run('lang')).to.eventually.not.be.ok
  })

  test.it('should return a value if there is one', () => {
    storage.set('lang', 'pt-BR')
    expect(getPreference.run('lang')).to.eventually.equal('pt-BR')
  })
})
