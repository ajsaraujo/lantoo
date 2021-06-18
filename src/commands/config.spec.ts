import { expect, test } from '@oclif/test'
import { PreferencesStorage } from '../modules/preferences/preferences-storage'

describe('config', () => {
  test
    .stub(PreferencesStorage.prototype, 'get', () => undefined)
    .stdout()
    .command(['config', 'lang'])
    .it('should complain if no value is set', (ctx) => {
      expect(ctx.stdout).to.contain("No value is set for the 'lang' key")
      expect(ctx.stdout).to.contain(
        'To set one, run $ lantoo config lang <<value>>'
      )
    })

  test
    .stub(PreferencesStorage.prototype, 'get', () => 'pt-BR')
    .stdout()
    .command(['config', 'lang'])
    .it('should retrieve a value from the storage if there is one', (ctx) => {
      expect(ctx.stdout).to.contain('pt-BR')
    })
})
