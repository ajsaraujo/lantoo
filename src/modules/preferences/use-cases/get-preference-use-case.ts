import { inject, injectable } from 'tsyringe'
import { IPreferencesStorage } from '../preferences-storage'

@injectable()
export class GetPreferenceUseCase {
  constructor(
    @inject('PreferencesStorage')
    private preferencesStorage: IPreferencesStorage
  ) {
    console.log(`Fui instanciado com ${preferencesStorage.name}`)
  }

  async run(key: string): Promise<string> {
    console.log(this.preferencesStorage.name)
    return this.preferencesStorage.get(key)
  }
}
