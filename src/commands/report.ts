import { container } from 'tsyringe';

import { TranslationFiles } from '../modules/i18n/codebase/translation-files'
import Command from './base'

export default class Report extends Command {
	static description = 'get a report on translation progress'

	async run(): Promise<void> {
		const translationFiles = container.resolve(TranslationFiles);
		const allTranslations = await translationFiles.getAllTranslationsFromAllLanguages();

		for (const language of Object.keys(allTranslations)) {
			const numOfTranslations = allTranslations[language].length;
			this.log(`${ language }: ${ numOfTranslations }`)
		}
	}
}
