import { inject, injectable } from 'tsyringe'
import { I18n } from '../../../modules/i18n'

import { IPreferencesStorage } from '../preferences-storage'
import { Preference } from '../models'
import { InvalidValueForPreferenceError } from '../errors/invalid-value-for-preference.error'

@injectable()
export class SetPreferenceUseCase {
  private i18n = new I18n()

  constructor(
    @inject('PreferencesStorage')
    private preferencesStorage: IPreferencesStorage
  ) {}

  async run(key: Preference, value: string) {
    const lang = this.fixCasing(value)

    this.throwIfLanguageIsNotValid(lang)

    await this.preferencesStorage.set(key, lang)
  }

  private fixCasing(languageCode: string) {
    if (languageCode.includes('-')) {
      const [firstPart, secondPart] = languageCode.split('-')
      return `${firstPart.toLowerCase()}-${secondPart.toUpperCase()}`
    }

    return languageCode.toLowerCase()
  }

  private throwIfLanguageIsNotValid(value: string) {
    if (this.i18n.isLanguageCode(value)) {
      return
    }

    throw new InvalidValueForPreferenceError('lang')
  }
}
