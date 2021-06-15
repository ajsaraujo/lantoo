import Command from '@oclif/command'
import { IConfig } from '@oclif/config'

import 'reflect-metadata'
import { container } from 'tsyringe'

import {
  PreferencesStorage,
  GetPreferenceUseCase,
} from '../modules/preferences'

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
    const { args } = this.parse(Config)
    const { key, value } = args

    if (!value) {
      await this.findKey(key)
    }
  }

  private initPreferencesStorage() {
    const storage = container.resolve(PreferencesStorage)
    storage.configDirectory = this.config.configDir
  }

  private async findKey(key: string) {
    const getPreference =
      container.resolve<GetPreferenceUseCase>(GetPreferenceUseCase)

    const value = await getPreference.run(key)

    if (value) {
      this.log(value)
    } else {
      this.log(`No value is set for the '${key}' key.`)
    }
  }
}
