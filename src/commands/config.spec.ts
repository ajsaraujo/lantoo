import { expect, test } from '@oclif/test'

describe('config', () => {
  test
    .stdout()
    .command(['config', 'lang'])
    .it('should complain if no value is set', (ctx) => {
      expect(ctx.stdout).to.contain('No value is set for "lang" key')
      expect(ctx.stdout).to.contain(
        'To set one, run $ lantoo config lang <<value>>'
      )
    })
})
