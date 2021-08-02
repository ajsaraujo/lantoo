import { expect, test } from '@oclif/test';
import { container } from 'tsyringe';
import sinon, { SinonSpy } from 'sinon';

import { TranslationFiles } from '@modules/i18n/codebase/translation-files';
import { IPreferencesStorage, MockPreferenceStorage } from '@modules/preferences';
import { FileSystem } from '@modules/io';

let addTranslationSpy: SinonSpy

describe('translate command', () => {
	test
		.stdout()
		.command(['translate'])
		.it('should ask the user to provide arguments', (ctx) => {
			expect(ctx.stdout).to.contain('You should either pass --key and --value flags or --interactive');
		})

	test
		.do(mockTranslationFiles)
		.stdout()
		.command(['translate', '--key', 'away_male', '--value', 'ausente', '--lang', 'pt-BR'])
		.it('should add the translation if key and value are passed', (ctx) => {
			expect(ctx.stdout).to.contain("✔️ 'away_male' -> 'ausente' was added to the pt-BR translation file.");
			expect(addTranslationSpy.calledWith('away_male', 'ausente', 'pt-BR'))
		})
})

function mockTranslationFiles() {
	container.reset();

	const fileSystemStub = sinon.createStubInstance(FileSystem);
	fileSystemStub.readJSON.resolves({});

	container.registerInstance(FileSystem, fileSystemStub);
	container.registerSingleton<IPreferencesStorage>('PreferencesStorage', MockPreferenceStorage);

	const translationFiles = container.resolve(TranslationFiles);
	addTranslationSpy = sinon.spy(translationFiles, 'addTranslation');
}
