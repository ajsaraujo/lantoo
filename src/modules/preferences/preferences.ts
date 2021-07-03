import { inject, injectable } from 'tsyringe'

import { LanguageUtils } from '../i18n'
import { InvalidValueForPreferenceError } from './errors'
import { IPreferencesStorage } from './storage/preferences-storage'

export type Preference = 'lang'
export const possiblePreferences: Preference[] = ['lang']

@injectable()
export class Preferences {
	constructor(
		@inject('PreferencesStorage') private storage: IPreferencesStorage,
		private languageUtils: LanguageUtils,
	) {}

	async set(key: Preference, value: string): Promise<void> {
		const lang = this.languageUtils.fixCasing(value)

		this.throwIfLanguageIsNotValid(lang)

		await this.storage.set(key, lang)
	}

	async get(key: Preference): Promise<string> {
		const value = await this.storage.get(key)
		return value
	}

	private throwIfLanguageIsNotValid(value: string) {
		if (this.languageUtils.isLanguageCode(value)) {
			return
		}

		const suggestion = this.languageUtils.findSimilarLanguageCode(value)

		throw new InvalidValueForPreferenceError('lang', suggestion)
	}
}
