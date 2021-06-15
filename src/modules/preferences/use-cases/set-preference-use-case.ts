import { injectable } from 'tsyringe'
import { IPreferencesStorage } from '../preferences-storage'

@injectable()
export class SetPreferenceUseCase {
  constructor(private preferencesStorage: IPreferencesStorage) {}

  async run(key: string, value: string) {
    this.preferencesStorage.set(key, value)
  }
}
