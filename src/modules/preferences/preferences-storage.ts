import * as fs from 'fs-extra'
import * as path from 'path'

export interface IPreferencesStorage {
  get(key: string): Promise<string>
  set(key: string, value: string): Promise<void>
}

export class PreferencesStorage implements IPreferencesStorage {
  private configFilePath: string

  private configObject: Record<string, string> = {}

  constructor(configDirectory: string) {
    this.configFilePath = path.join(configDirectory, 'config.json')
  }

  async get(key: string): Promise<string> {
    const userConfig = await this.getConfigObject()
    return userConfig[key]
  }

  async set(key: string, value: string): Promise<void> {
    const userConfig = await this.getConfigObject()
    userConfig[key] = value

    return this.writeConfigToFileSystem()
  }

  private async getConfigObject() {
    if (!this.configObject) {
      this.configObject = await fs.readJSON(this.configFilePath)
    }

    return this.configObject || {}
  }

  private writeConfigToFileSystem() {
    return fs.writeJson(this.configFilePath, this.configObject)
  }
}
