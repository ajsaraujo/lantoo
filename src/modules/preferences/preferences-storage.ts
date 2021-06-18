import * as fs from 'fs-extra'
import * as path from 'path'

export interface IPreferencesStorage {
  get(key: string): Promise<string>
  set(key: string, value: string): Promise<void>
  configDirectory: string
}

export class PreferencesStorage implements IPreferencesStorage {
  private configFilePath = ''

  private configObject: Record<string, string> = {}

  set configDirectory(directory: string) {
    this.configFilePath = path.join(directory, 'config.json')
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

export class MockPreferenceStorage implements IPreferencesStorage {
  configDirectory = ''

  private preferencesObject: { [key: string]: string } = {}

  async get(key: string) {
    return this.preferencesObject[key]
  }

  async set(key: string, value: string) {
    this.preferencesObject[key] = value
  }
}
