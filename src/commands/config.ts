import Command from '@oclif/command'
import { IConfig } from '@oclif/config'
import { container } from 'tsyringe'

import { PreferencesStorage, GetPreferencesUseCase } from '@modules/preferences'
import { GetPreferenceUseCase } from '@modules/preferences/use-cases/get-preference-use-case'

export default class Config extends Command {
  static description = 'get/set user preferences'

  static help = 'hi'

  static usage = 'config lang'

  static examples = [
    '$ lantoo config lang pt-BR',
    '$ lantoo config lang',
    '$ lantoo config --help',
  ]

  static args = [
    {
      name: 'key',
      required: true,
      description: 'the key to get/set',
      options: ['lang'],
    },
    {
      name: 'value',
      required: false,
      description: 'a value to set to the key',
    },
  ]

  constructor(argv: string[], config: IConfig) {
    super(argv, config)
  }

  async run() {
    try {
      const { args } = this.parse(Config)
      const { key, value } = args

      if (!value) {
        const value = this.findKey(key)
        this.log(`Found: ${value}`)
      }
    } catch (error) {
      this._help()
    }
  }

  private initPreferencesStorage() {
    const storage = container.resolve(PreferencesStorage)
    storage.configDirectory = this.config.configDir
  }

  private findKey(key: string) {
    const getPreference = container.resolve<GetPreferenceUseCase>(
      GetPreferencesUseCase
    )

    return getPreference.run(key)
  }
}
