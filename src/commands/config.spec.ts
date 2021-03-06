import { expect, test } from '@oclif/test';
import { container } from 'tsyringe';

import {
	IPreferencesStorage,
	MockPreferenceStorage,
} from '../modules/preferences/storage/preferences-storage';

container.registerSingleton<IPreferencesStorage>(
	'PreferencesStorage',
	MockPreferenceStorage,
);

const storage: MockPreferenceStorage = container.resolve('PreferencesStorage');
const setup = test.do(() => storage.clear());

describe('config command', () => {
	setup
		.stdout()
		.command(['config', 'lang'])
		.it('should complain if no value is set', (ctx) => {
			expect(ctx.stdout).to.contain("No value is set for the 'lang' key");
			expect(ctx.stdout).to.contain(
				'To set one, run $ lantoo config lang <<value>>',
			);
		});

	setup
		.do(() => storage.set('lang', 'pt-BR'))
		.stdout()
		.command(['config', 'lang'])
		.it('should retrieve a value from the storage if there is one', (ctx) => {
			expect(ctx.stdout).to.contain('pt-BR');
		});

	setup
		.stdout()
		.command(['config', 'lang', 'pt-BR'])
		.it(
			'should set the language value to pt-BR in the storage',
			async (ctx) => {
				const lang = await storage.get('lang');

				expect(ctx.stdout).to.be.empty;
				expect(lang).to.equal('pt-BR');
			},
		);

	setup
		.stdout()
		.command(['config', 'lang', 'dragonforce'])
		.it('should complain if you pass an invalid language', async (ctx) => {
			expect(ctx.stdout).to.include(
				"❌ 'dragonforce' is not a valid ISO 632-9 language code",
			);
		});

	setup
		.stdout()
		.command(['config', 'lang', 'pt-br'])
		.it(
			'should fix the casing when you pass a valid language with wrong casing',
			async (ctx) => {
				const lang = await storage.get('lang');

				expect(ctx.stdout).to.be.empty;
				expect(lang).to.equal('pt-BR');
			},
		);

	setup
		.stdout()
		.command(['config', 'lang', 'pt-nr'])
		.it('should give you a suggestion when you make a typo', async (ctx) => {
			expect(ctx.stdout).to.include(
				"❌ 'pt-nr' is not a valid ISO 632-9 language code",
			);

			expect(ctx.stdout).to.include("Did you mean 'pt-BR'?");
		});
});
