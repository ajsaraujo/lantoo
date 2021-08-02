import { singleton } from 'tsyringe'

import { FileSystem } from '../../io';
import { Translation } from '../models/translation-key'

@singleton()
export class TranslationFiles {
	constructor(private fileSystem: FileSystem) {}

	async addTranslation(key: string, value: string, language: string): Promise<void> {
		const translations = await this.getTranslationFile(language);

		translations[key] = value;

		const path = this.translationFilePath(language);

		await this.fileSystem.writeJSON(path, translations);
	}

	async getTranslation(
		key: string,
		language: string,
	): Promise<Translation | undefined> {
		const translations = await this.getTranslations(language)
		return translations[key]
	}

	async getTranslations(
		language: string,
	): Promise<Record<string, Translation>> {
		const json = await this.getTranslationFile(language);

		const map: Record<string, Translation> = {}

		for (const [key, value] of Object.entries(json)) {
			map[key] = new Translation(key, value)
		}

		return map
	}

	private async getTranslationFile(language: string): Promise<Record<string, string>> {
		const path = await this.translationFilePath(language);

		const json = await this.fileSystem.readJSON(
			path,
		) as Record<string, string>

		return json;
	}

	private translationFilePath(language: string) {
		return language;
	}
}

@singleton()
export class MockTranslationFiles extends TranslationFiles {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async addTranslation(key: string, value: string, lang: string): Promise<void> {}

	async getTranslations(_: string): Promise<Record<string, Translation>> {
		return {
			away_female: new Translation('away_female', 'Ausente'),
		}
	}
}
