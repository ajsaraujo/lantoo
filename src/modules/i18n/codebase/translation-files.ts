/* eslint-disable @typescript-eslint/no-empty-interface */
import { container, singleton } from 'tsyringe'

import { FileSystem } from '../../io';
import { App } from '../apps';
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
		const translations = this.parseJSON(json);

		for (const translation of translations) {
			map[translation.key] = translation;
		}

		return map
	}

	async getAllTranslationsFromAllLanguages(): Promise<string[]> {
		const app: App = container.resolve('App');
		const translationFilesFolder = app.translationFileFolder;
		const translationFiles = this.fileSystem.getFileNames(translationFilesFolder);

		return translationFiles;
	}

	private parseJSON(json: Record<string, unknown>, prefix = ''): Translation[] {
		const translations: Translation[] = [];

		for (const [key, value] of Object.entries(json)) {
			const prefixedKey = prefix.length === 0 ? key : `${ prefix }.${ key }`;

			if (typeof value === 'string') {
				translations.push(new Translation(prefixedKey, value));
			}

			if (typeof value === 'object') {
				translations.push(...this.parseJSON(json[key] as Record<string, unknown>, prefixedKey));
			}
		}

		return translations;
	}

	private async getTranslationFile(language: string): Promise<Record<string, unknown>> {
		const path = this.translationFilePath(language);

		const json = await this.fileSystem.readJSON(
			path,
		) as Record<string, string>

		return json;
	}

	private translationFilePath(language: string) {
		const app: App = container.resolve('App');
		return app.getTranslationFilePath(language);
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
