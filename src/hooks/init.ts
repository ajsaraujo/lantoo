import { container } from 'tsyringe'

import {
	MockTranslationFiles, TranslationFiles,
} from '../modules/i18n/codebase/translation-files'

function registerSingletons(): void {
	// Don't register the singletons below in test environment
	if (process.env.NODE_ENV === 'test') {
		return
	}

	container.register(TranslationFiles, MockTranslationFiles);
}

export default registerSingletons
