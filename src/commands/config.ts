import { IConfig } from '@oclif/config'

import { container } from 'tsyringe'

import { GetPreferenceUseCase } from '../modules/preferences'
import Command from './base'

export default class Config extends Command {
  static description = 'get/set user preferences'

  static help = 'hi'

  static usage = 'config lang'

  static examples = ['$ lantoo config lang pt-BR', '$ lantoo config lang']

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

  private async findKey(key: string) {
    const getPreference =
      container.resolve<GetPreferenceUseCase>(GetPreferenceUseCase)

    const value = await getPreference.run(key)

    if (value) {
      this.log(value)
    } else {
      this.log(`No value is set for the '${key}' key.\n`)
      this.log(`To set one, run $ lantoo config lang <<value>>`)
    }
  }
}
