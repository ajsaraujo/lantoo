import test, { expect } from 'fancy-test';
import Sinon from 'sinon';

import { FileSystem } from '@modules/io';

import { Codebase } from './codebase';
import { CodeParser } from './code-parser';
import { TranslationFiles } from './translation-files';

const fileSystem = Sinon.createStubInstance(FileSystem);

describe('Codebase', () => {
	describe('detectProject()', () => {
		whenPackageJsonNameIs('Rocket.Chat').itShouldReturn('web');
		whenPackageJsonNameIs('rocketchat').itShouldReturn('desktop');
		whenPackageJsonNameIs('rocket-chat-reactnative').itShouldReturn('mobile');
	})
})

function whenPackageJsonNameIs(name: string) {
	return {
		itShouldReturn: (expectedValue: string) => test.do(() => fileSystem.readJSON.resolves({ name })).it(`should return ${ expectedValue }`, async () => {
			const codebase = createCodebase();
			const project = await codebase.detectProject();
			expect(project).to.equal(expectedValue);
		}),
	}
}

function createCodebase() {
	const codeParser: CodeParser = Sinon.createStubInstance(CodeParser);
	const translationFiles = Sinon.createStubInstance(TranslationFiles) as unknown as TranslationFiles;

	return new Codebase(codeParser, translationFiles, fileSystem);
}