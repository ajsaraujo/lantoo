import test, { expect } from 'fancy-test';
import sinon, { SinonStubbedInstance } from 'sinon';

import { PRIMARY_LANGUAGE } from '../languages';
import { KeyOccurrence, Translation } from '../models/translation-key';
import { CodeParser } from './code-parser';
import { Codebase } from './codebase';
import { TranslationFiles } from './translation-files';

describe('Codebase', () => {
	let codeParser: SinonStubbedInstance<CodeParser>;
	let translationFiles: SinonStubbedInstance<TranslationFiles>;
	let codebase: Codebase;

	const setup = test.do(() => {
		codeParser = sinon.createStubInstance(CodeParser);
		translationFiles = sinon.createStubInstance(TranslationFiles);
		codebase = new Codebase(codeParser, translationFiles as unknown as TranslationFiles);
	})

	describe('getUntranslatedKeys()', () => {
		setup.it('should return keys that are found in the codebase but not in translation files', async () => {
			translationFiles.getTranslations.resolves({});
			codeParser.getKeyOccurrences.resolves([new KeyOccurrence('Your_workspace_is_ready', 'workspace.js')])

			const keys = await codebase.getUntranslatedKeys(PRIMARY_LANGUAGE);

			expect(keys[0].key).to.equal('Your_workspace_is_ready');
		});

		setup.it('should also compare to en translation file if the language is one other than english', async () => {
			translationFiles.getTranslations.withArgs(PRIMARY_LANGUAGE).resolves({
				Your_workspace_is_ready: new Translation('Your_workspace_is_ready', 'Your workspace is ready'),
			});

			translationFiles.getTranslations.withArgs('pt-BR').resolves({});

			codeParser.getKeyOccurrences.resolves([]);

			const keys = await codebase.getUntranslatedKeys('pt-BR');

			expect(keys[0].key).to.equal('Your_workspace_is_ready');
		})
	})
})
