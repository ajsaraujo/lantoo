import { inject, injectable } from 'tsyringe'

import { IFileSystem } from '../../shared'
import { Translation } from '../models/translation-key'

export interface ITranslationFiles {
	getTranslation(
		key: string,
		language: string
	): Promise<Translation | undefined>

	getTranslations(language: string): Promise<Record<string, Translation>>

	addTranslation(key: string, value: string, language: string): Promise<void>;
}

@injectable()
export class TranslationFiles implements ITranslationFiles {
	constructor(@inject('FileSystem') private fileSystem: IFileSystem) {}

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

export class MockTranslationFiles extends TranslationFiles {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async addTranslation(key: string, value: string, lang: string): Promise<void> {}

	async getTranslations(_: string): Promise<Record<string, Translation>> {
		return {
			Page_title: new Translation('Page_title', 'Título da Página'),
			away_female: new Translation('away_female', 'Ausente'),
		}
	}
}
