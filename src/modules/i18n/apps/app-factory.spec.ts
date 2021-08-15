import test from 'fancy-test';
import Sinon, { SinonStubbedInstance } from 'sinon';
import { expect } from 'chai';

import { FileSystem } from '@modules/io';

import { DesktopApp, MobileApp, WebApp } from './apps';
import { AppFactory } from './app-factory';

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
		itShouldReturn: (expectedClass: new () => Object) => test.it(`should return ${ expectedClass.name }`, async () => {
			const appFactory = createAppFactory(name);
			const app = await appFactory.getCurrentApp();
			expect(app instanceof expectedClass).to.be.true;
		}),
	}
}

function createAppFactory(name: string) {
	const fs: SinonStubbedInstance<FileSystem> = Sinon.createStubInstance(FileSystem);
	fs.readJSON.resolves({ name });

	return new AppFactory(fs);
}
