import { injectable } from 'tsyringe';

import { FileSystem } from '@modules/io';

import { App, DesktopApp, MobileApp, WebApp } from './apps';

@injectable()
export class AppFactory {
	constructor(private fs: FileSystem) {}

	async getCurrentApp(): Promise<App> {
		const { name } = await this.fs.readJSON('package.json') as Record<string, string>;

		switch (name) {
			case 'Rocket.Chat':
				return new WebApp();
			case 'rocket-chat-reactnative':
				return new MobileApp();
			case 'rocketchat':
				return new DesktopApp();
			default:
				throw new Error('Unknown app');
		}
	}
}
