import { expect, test } from '@oclif/test'
import { container } from 'tsyringe'
import {
  IPreferencesStorage,
  MockPreferenceStorage,
} from '../modules/preferences/preferences-storage'

const resolve = container.resolve.bind(container)
const storage = new MockPreferenceStorage()

container.register<IPreferencesStorage>('PreferencesStorage', {
  useClass: MockPreferenceStorage,
})

describe('config', () => {
  test
    .stdout()
    .command(['config', 'lang'])
    .it('should complain if no value is set', (ctx) => {
      expect(ctx.stdout).to.contain("No value is set for the 'lang' key")
      expect(ctx.stdout).to.contain(
        'To set one, run $ lantoo config lang <<value>>'
      )
    })

  storage.set('lang', 'pt-BR')

  test
    .stdout()
    .command(['config', 'lang'])
    .it('should retrieve a value from the storage if there is one', (ctx) => {
      expect(ctx.stdout).to.contain('pt-BR')
    })
})
