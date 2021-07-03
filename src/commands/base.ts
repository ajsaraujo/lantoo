import 'reflect-metadata'

import Command from '@oclif/command'
import { container } from 'tsyringe'

import { IPreferencesStorage, Preferences } from '../modules/preferences'
import { LanguageUtils } from '../modules/i18n'

export default abstract class extends Command {
  async init() {
    await super.init()

    this.setConfigFilePath()
  }

  protected async parseLanguageOptionOrGetFromPreferences(
    language: string | undefined
  ): Promise<string> {
    if (language) {
      return this.parseLanguage(language)
    }

    let preferredLanguage = await this.getLanguageFromPreferences()

    if (!preferredLanguage) {
      await this.setPreferredLanguageToEnUs()
      preferredLanguage = 'en-US'
    }

    return preferredLanguage
  }

  private parseLanguage(language: string) {
    const utils = container.resolve(LanguageUtils)
    const fixedLanguage = utils.fixCasing(language)

    if (!utils.isLanguageCode(fixedLanguage)) {
      this.log(`${language} is not a valid language.`)
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
    const storage = container.resolve<IPreferencesStorage>('PreferencesStorage')
    storage.configDirectory = this.config.configDir
  }
}
