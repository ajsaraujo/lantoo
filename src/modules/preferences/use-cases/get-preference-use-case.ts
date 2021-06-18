import { inject, injectable } from 'tsyringe'
import { IPreferencesStorage } from '../preferences-storage'

@injectable()
export class GetPreferenceUseCase {
  constructor(
    @inject('PreferencesStorage')
    private preferencesStorage: IPreferencesStorage
  ) {}

  async run(key: string): Promise<string> {
    return this.preferencesStorage.get(key)
  }
}
