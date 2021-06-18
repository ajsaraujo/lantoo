import * as path from 'path'
import assert from 'assert'
import { FileSystem, IFileSystem } from './file-system'

export interface IPreferencesStorage {
  get(key: string): Promise<string>
  set(key: string, value: string): Promise<void>
  configDirectory: string
}

export class PreferencesStorage implements IPreferencesStorage {
  private configFilePath = ''

  private configObject: Record<string, string> = {}

  private configObjectWasLoaded = false

  constructor(private fs: IFileSystem = new FileSystem()) {}

  set configDirectory(directory: string) {
    this.configFilePath = path.join(directory, 'config.json')
  }

  async get(key: string): Promise<string> {
    this.assertConfigFilePathIsDefined()

    await this.getConfigObject()

    return this.configObject[key]
  }

  async set(key: string, value: string): Promise<void> {
    this.assertConfigFilePathIsDefined()

    await this.getConfigObject()

    this.configObject[key] = value

    await this.writeConfigToFileSystem()
  }

  private async getConfigObject() {
    if (!this.configObjectWasLoaded) {
      this.configObject = await this.fs.readJSON(this.configFilePath)
      this.configObjectWasLoaded = true
    }
  }

  private async writeConfigToFileSystem() {
    await this.fs.writeJSON(this.configFilePath, this.configObject)
  }

  private assertConfigFilePathIsDefined() {
    assert(this.configFilePath, 'Config file path is not defined')
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
