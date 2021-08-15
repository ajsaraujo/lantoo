import { container } from 'tsyringe'

import { AppFactory } from '../modules/i18n/apps';

async function registerSingletons(this: { error: (message: string) => void }): Promise<void> {
	// Don't register the singletons below in test environment
	if (process.env.NODE_ENV === 'test') {
		return
	}

	try {
		const appFactory = container.resolve(AppFactory);
		const app = await appFactory.getCurrentApp();
		container.registerInstance('App', app);
	} catch (err) {
		this.error('Could not find a package.json file. For lantoo to work properly, please run it at the root folder of a Rocket.Chat project.\n');
	}
}

export default registerSingletons
