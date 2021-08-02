import 'reflect-metadata'

import Command from '@oclif/command'
import { container } from 'tsyringe'

import { Preferences, PreferencesStorage } from '../modules/preferences'
import { LanguageUtils } from '../modules/i18n'

export default abstract class extends Command {
	async init(): Promise<void> {
		await super.init()

		this.setConfigFilePath()
	}

	/**
	 * Parses the language (--lang) flag. If it was not passed,
	 * the default language is fetched from the preferences.
	 * If no language is set in the preferences, en-US is returned.
	 */
	protected async parseLanguageFlagOrGetFromPreferences(
		language: string | undefined,
	): Promise<string> {
		if (language) {
			return this.parseLanguage(language)
		}

		let preferredLanguage = await this.getLanguageFromPreferences()

		if (!preferredLanguage) {
			await this.setPreferredLanguageToEnUs()
			preferredLanguage = 'en'
		}

		return preferredLanguage
	}

	private parseLanguage(language: string) {
		const utils = container.resolve(LanguageUtils)
		const fixedLanguage = utils.fixCasing(language)

		if (!utils.isLanguageCode(fixedLanguage)) {
			this.log(`${ language } is not a valid language.`)
			this.exit()
		}

		return fixedLanguage
	}

	private async setPreferredLanguageToEnUs() {
		const preferences = container.resolve(Preferences)
		await preferences.set('lang', 'en-US')
	}

	private async getLanguageFromPreferences() {
		const preferences = container.resolve(Preferences)
		const language = await preferences.get('lang')

		return language
	}

	private setConfigFilePath() {
		const storage = container.resolve(PreferencesStorage);
		storage.configDirectory = this.config.configDir
	}
}
