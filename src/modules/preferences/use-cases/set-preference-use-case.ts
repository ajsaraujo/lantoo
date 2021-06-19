import { inject, injectable } from 'tsyringe'
import { I18n } from '../../../modules/i18n'

import { IPreferencesStorage } from '../preferences-storage'
import { Preference } from '../models'

@injectable()
export class SetPreferenceUseCase {
  private i18n = new I18n()

  constructor(
    @inject('PreferencesStorage')
    private preferencesStorage: IPreferencesStorage
  ) {}

  async run(key: Preference, value: string) {
    await this.preferencesStorage.set(key, value)
  }
}
