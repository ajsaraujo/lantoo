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
    if (key === 'lang') {
      this.throwIfLanguageIsNotValid(value)
    }

    await this.preferencesStorage.set(key, value)
  }

  private throwIfLanguageIsNotValid(value: string) {
    if (!this.i18n.isLanguageCode(value)) {
      throw new InvalidValueForPreferenceError('lang')
    }
  }
}
