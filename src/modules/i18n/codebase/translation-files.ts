import { inject, injectable } from 'tsyringe'

import { IFileSystem } from '../../shared'
import { Translation } from '../models/translation-key'

export interface ITranslationFiles {
	getTranslation(
		key: string,
		language: string
	): Promise<Translation | undefined>

	getTranslations(language: string): Promise<Record<string, Translation>>
}

@injectable()
export class TranslationFiles implements ITranslationFiles {
	constructor(@inject('FileSystem') private fileSystem: IFileSystem) {}

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
		const json: Record<string, string> = await this.fileSystem.readJSON(
			language,
		)

		const map: Record<string, Translation> = {}

		for (const [key, value] of Object.entries(json)) {
			map[key] = new Translation(key, value)
		}

		return map
	}
}

export class MockTranslationFiles extends TranslationFiles {
	async getTranslations(language: string) {
		return {
			Page_title: new Translation('Page_title', 'Título da Página'),
			away_female: new Translation('away_female', 'Ausente'),
		}
	}
}
