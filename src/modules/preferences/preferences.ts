import { inject, injectable } from 'tsyringe'

import { I18n } from '../../modules/i18n'
import { InvalidValueForPreferenceError } from './errors'
import { IPreferencesStorage } from './storage/preferences-storage'

export type Preference = 'lang'
export const possiblePreferences: Preference[] = ['lang']

@injectable()
export class Preferences {
  constructor(
    @inject('PreferencesStorage') private storage: IPreferencesStorage,
    private i18n: I18n
  ) {}

  async set(key: Preference, value: string): Promise<void> {
    const lang = this.i18n.fixCasing(value)

    this.throwIfLanguageIsNotValid(lang)

    await this.storage.set(key, lang)
  }

  async get(key: Preference): Promise<string> {
    const value = await this.storage.get(key)
    return value
  }

  private throwIfLanguageIsNotValid(value: string) {
    if (this.i18n.isLanguageCode(value)) {
      return
    }

    const suggestion = this.i18n.findSimilarLanguageCode(value)

    throw new InvalidValueForPreferenceError('lang', suggestion)
  }
}
