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

  private configObjectWasLoaded = false

  set configDirectory(directory: string) {
    this.configFilePath = path.join(directory, 'config.json')
  }

  async get(key: string): Promise<string> {
    await this.getConfigObject()
    return this.configObject[key]
  }

  async set(key: string, value: string): Promise<void> {
    await this.getConfigObject()

    this.configObject[key] = value

    await this.writeConfigToFileSystem()
  }

  private async getConfigObject() {
    if (!this.configObjectWasLoaded) {
      this.configObject = await fs.readJSON(this.configFilePath)
      this.configObjectWasLoaded = true
    }
  }

  private async writeConfigToFileSystem() {
    await fs.writeJson(this.configFilePath, this.configObject)
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

  clear() {
    this.preferencesObject = {}
  }
}
