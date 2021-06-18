import { IConfig } from '@oclif/config'

import { container } from 'tsyringe'

import {
  GetPreferenceUseCase,
  SetPreferenceUseCase,
} from '../modules/preferences'
import Command from './base'

export default class Config extends Command {
  static description = 'get/set user preferences'

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

  async run() {
    const { args } = this.parse(Config)
    const { key, value } = args

    if (value) {
      await this.set(key, value)
    } else {
      await this.get(key)
    }
  }

  private async set(key: string, value: string) {
    const setPreference =
      container.resolve<SetPreferenceUseCase>(SetPreferenceUseCase)

    await setPreference.run(key, value)
  }

  private async get(key: string) {
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
