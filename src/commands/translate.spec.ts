import { expect, test } from '@oclif/test';

describe('translate command', () => {
	test.stdout().command(['translate']).it('should ask the user to provide arguments', (ctx) => {
		expect(ctx.stdout).to.contain('You should either pass --key and --value flags or --interactive');
	})
})
