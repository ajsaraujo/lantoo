import { container } from 'tsyringe'

import { IPreferencesStorage, PreferencesStorage } from '../modules/preferences'
import {
	ITranslationFiles,
	MockTranslationFiles,
} from '../modules/i18n/codebase/translation-files'

function registerSingletons(): void {
	// Don't register the singletons below in test environment
	if (process.env.NODE_ENV === 'test') {
		return
	}

	container.registerSingleton<IPreferencesStorage>(
		'PreferencesStorage',
		PreferencesStorage,
	)

	container.registerSingleton<ITranslationFiles>(
		'TranslationFiles',
		MockTranslationFiles,
	)
}

export default registerSingletons
