import { expect, test } from '@oclif/test';
import { container } from 'tsyringe';
import sinon, { SinonSpy } from 'sinon';

import { ITranslationFiles, MockTranslationFiles } from '@modules/i18n/codebase/translation-files';
import { IFileSystem, MockFileSystem } from '@modules/shared';
import { IPreferencesStorage, MockPreferenceStorage } from '@modules/preferences';


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
			expect(ctx.stdout).to.contain("✔️ 'away_male':'ausente' was added to the pt-BR translation file.");
			expect(addTranslationSpy.calledWith('away_male', 'ausente', 'pt-BR'))
		})
})

function mockTranslationFiles() {
	container.reset();

	container.registerSingleton<IFileSystem>('FileSystem', MockFileSystem);
	container.registerSingleton<ITranslationFiles>('TranslationFiles', MockTranslationFiles);
	container.registerSingleton<IPreferencesStorage>('PreferencesStorage', MockPreferenceStorage);

	const translationFiles: ITranslationFiles = container.resolve('TranslationFiles');
	addTranslationSpy = sinon.spy(translationFiles, 'addTranslation');
}
