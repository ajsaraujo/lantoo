import { IPreferencesStorage } from '../preferences-storage'

export class SetPreferenceUseCase {
  constructor(private preferencesStorage: IPreferencesStorage) {}

  async run(key: string, value: string) {
    this.preferencesStorage.set(key, value)
  }
}
