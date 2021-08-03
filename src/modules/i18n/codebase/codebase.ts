import { injectable } from 'tsyringe'

import { FileSystem } from '../../io';
import { TranslationKey } from '../models/translation-key'
import { CodeParser } from './code-parser'
import { KeyAssembler } from './key-assembler'
import { TranslationFiles } from './translation-files';

/**
 * Parses translation files and the codebase to
 * get translation keys.
 */
@injectable()
export class Codebase {
	constructor(
		private codeParser: CodeParser,
		private translationFiles: TranslationFiles,
		private fileSystem: FileSystem,
	) {}

	async addTranslation(key: string, value: string, language: string): Promise<void> {
		await this.translationFiles.addTranslation(key, value, language);
	}

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

	async detectProject(): Promise<string> {
		const { name } = await this.fileSystem.readJSON('package.json') as Record<string, string>;

		switch (name) {
			case 'Rocket.Chat':
				return 'web';
			case 'rocket-chat-reactnative':
				return 'mobile';
			case 'rocketchat':
				return 'desktop';
			default:
				return '';
		}
	}

	private async getAllKeys(language: string): Promise<TranslationKey[]> {
		const occurrences = await this.codeParser.getKeyOccurrences()
		const translations = await this.translationFiles.getTranslations(language)
		return new KeyAssembler(occurrences, translations).assemble()
	}
}
