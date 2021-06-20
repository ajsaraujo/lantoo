import { inject, injectable } from 'tsyringe'
import { I18n } from '../../../modules/i18n'

import { IPreferencesStorage } from '../preferences-storage'
import { Preference } from '../models'
import { InvalidValueForPreferenceError } from '../errors/invalid-value-for-preference.error'

@injectable()
export class SetPreferenceUseCase {
  constructor(
    @inject('PreferencesStorage')
    private preferencesStorage: IPreferencesStorage,
    private i18n: I18n
  ) {}

  async run(key: Preference, value: string) {
    const lang = this.i18n.fixCasing(value)

    this.throwIfLanguageIsNotValid(lang)

    await this.preferencesStorage.set(key, lang)
  }

  private throwIfLanguageIsNotValid(value: string) {
    if (this.i18n.isLanguageCode(value)) {
      return
    }

    const suggestion = this.i18n.findSimilarLanguageCode(value)

    throw new InvalidValueForPreferenceError('lang', suggestion)
  }
}
