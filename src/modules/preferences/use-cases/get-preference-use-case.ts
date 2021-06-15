import { IPreferencesStorage } from '../preferences-storage'

export class GetPreferenceUseCase {
  constructor(private preferencesStorage: IPreferencesStorage) {}

  async run(key: string): Promise<string> {
    return this.preferencesStorage.get(key)
  }
}
