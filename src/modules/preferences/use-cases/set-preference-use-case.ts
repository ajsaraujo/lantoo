import { inject, injectable } from 'tsyringe'
import { IPreferencesStorage } from '../preferences-storage'

@injectable()
export class SetPreferenceUseCase {
  constructor(
    @inject('PreferencesStorage')
    private preferencesStorage: IPreferencesStorage
  ) {}

  async run(key: string, value: string) {
    await this.preferencesStorage.set(key, value)
  }
}
