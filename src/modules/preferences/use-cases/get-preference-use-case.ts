import { inject, injectable } from 'tsyringe'
import { IPreferencesStorage } from '../preferences-storage'
import { Preference } from '../models'

@injectable()
export class GetPreferenceUseCase {
  constructor(
    @inject('PreferencesStorage')
    private preferencesStorage: IPreferencesStorage
  ) {}

  async run(key: Preference): Promise<string> {
    const value = await this.preferencesStorage.get(key)
    return value
  }
}
