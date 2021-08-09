import test from 'fancy-test';
import sinon, { SinonStubbedInstance } from 'sinon';
import { expect } from 'chai';

import { FileSystem } from '@modules/io';

import { TranslationFiles } from './translation-files';

describe('TranslationFiles', () => {
	let fs: SinonStubbedInstance<FileSystem>;
	let translationFiles: TranslationFiles;

	const { it } = test.do(() => {
		fs = sinon.createStubInstance(FileSystem);
		fs.readJSON.resolves({});
		translationFiles = new TranslationFiles(fs);
	});

	describe('addTranslation()', () => {
		it('should add a translation to the file', async () => {
			await translationFiles.addTranslation('to_infinity_and_beyond', 'Ao infinito, e além!', 'pt-BR');
			const translationsWritten = fs.writeJSON.firstCall.args[1] as Record<string, string>;
			expect(translationsWritten.to_infinity_and_beyond).to.equal('Ao infinito, e além!');
		})
	})
})
