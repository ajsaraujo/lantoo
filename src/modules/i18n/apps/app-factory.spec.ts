import test from 'fancy-test';
import Sinon from 'sinon';
import { expect } from 'chai';

import { FileSystem } from '@modules/io';

import { DesktopApp, MobileApp, WebApp } from './apps';

const fileSystem = Sinon.createStubInstance(FileSystem);

describe('AppFactory', () => {
	describe('detectProject()', () => {
		whenPackageJsonNameIs('Rocket.Chat').itShouldReturn(WebApp);
		whenPackageJsonNameIs('rocketchat').itShouldReturn(DesktopApp);
		whenPackageJsonNameIs('rocket-chat-reactnative').itShouldReturn(MobileApp);
	})
})

function whenPackageJsonNameIs(name: string) {
	return {
		// eslint-disable-next-line @typescript-eslint/ban-types
		itShouldReturn: (expectedClass: new () => Object) => test.do(() => fileSystem.readJSON.resolves({ name })).it(`should return ${ expectedClass }`, async () => {
			const codebase = createCodebase();
			const project = await codebase.detectProject();
			expect(project instanceof expectedClass).to.be.true;
		}),
	}
}

function createCodebase() {
	const codeParser: CodeParser = Sinon.createStubInstance(CodeParser);
	const translationFiles = Sinon.createStubInstance(TranslationFiles) as unknown as TranslationFiles;

	return new Codebase(codeParser, translationFiles, fileSystem);
}
