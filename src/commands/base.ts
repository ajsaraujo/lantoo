import 'reflect-metadata'

import Command from '@oclif/command'
import { container } from 'tsyringe'

import { FileSystem } from '../modules/io'
import { Preferences, PreferencesStorage } from '../modules/preferences'
import { LanguageUtils, PRIMARY_LANGUAGE } from '../modules/i18n'

export default abstract class extends Command {
	async init(): Promise<void> {
		await super.init()
		await this.setConfigFilePath()
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
			await this.setPreferredLanguageToPrimaryLanguage()
			preferredLanguage = PRIMARY_LANGUAGE;
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

	private async setPreferredLanguageToPrimaryLanguage() {
		const preferences = container.resolve(Preferences)
		await preferences.set('lang', PRIMARY_LANGUAGE)
	}

	private async getLanguageFromPreferences() {
		const preferences = container.resolve(Preferences)
		const language = await preferences.get('lang')

		return language
	}

	private async setConfigFilePath() {
		const fileSystem = container.resolve(FileSystem);
		const storage = container.resolve(PreferencesStorage);
		const configFileDirectory = this.config.configDir;

		await fileSystem.ensureDirectoryExists(configFileDirectory);

		storage.configDirectory = configFileDirectory;
	}
}
