import { inject, injectable } from 'tsyringe'

import { TranslationKey } from '../models/translation-key'
import { CodeParser } from './code-parser'
import { KeyAssembler } from './key-assembler'
import { ITranslationFiles } from './translation-files'

/**
 * Parses translation files and the codebase to
 * get translation keys.
 */
@injectable()
export class Codebase {
	constructor(
		private codeParser: CodeParser,
		@inject('TranslationFiles') private translationFiles: ITranslationFiles,
	) {}

	async getUntranslatedKeys(language: string): Promise<TranslationKey[]> {
		const keys = await this.getAllKeys(language)
		return keys.filter((key) => key.isUntranslated)
	}

	async getUnusedKeys(language: string): Promise<TranslationKey[]> {
		const keys = await this.getAllKeys(language)
		return keys.filter((key) => key.isUnused)
	}

	async getKey(
		key: string,
		language: string,
	): Promise<TranslationKey | undefined> {
		const occurrence = await this.codeParser.getKeyOccurrence(key)
		const translation = await this.translationFiles.getTranslation(
			key,
			language,
		)

		const result = TranslationKey.create(translation, occurrence)

		if (result.isFailure) {
			return undefined
		}

		return result.value
	}

	private async getAllKeys(language: string): Promise<TranslationKey[]> {
		const occurrences = await this.codeParser.getKeyOccurrences()
		const translations = await this.translationFiles.getTranslations(language)
		return new KeyAssembler(occurrences, translations).assemble()
	}
}
