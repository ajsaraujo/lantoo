import { container } from 'tsyringe'

import { Codebase } from '../modules/i18n/codebase/codebase';
import {
	MockTranslationFiles, TranslationFiles,
} from '../modules/i18n/codebase/translation-files'

async function registerSingletons(): Promise<void> {
	// Don't register the singletons below in test environment
	if (process.env.NODE_ENV === 'test') {
		return
	}

	container.register(TranslationFiles, MockTranslationFiles);

	try {
		const codebase = container.resolve(Codebase);
		const app = await codebase.detectProject();
		console.log(`project: ${ app }`);
	} catch (err) {
		console.log('Could not find a package.json file. For lantoo to work properly, please run it at the root folder of a Rocket.Chat project.');
	}
}

export default registerSingletons
