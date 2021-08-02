import * as path from 'path'
import assert from 'assert'

import { singleton } from 'tsyringe'

import { FileSystem } from '../../io'

interface IPreferencesStorage {
	configDirectory: string;

	get(key: string): Promise<string>
	set(key: string, value: string): Promise<void>
}

@singleton()
export class PreferencesStorage implements IPreferencesStorage {
	private configFilePath = ''

	private configObject: Record<string, string> = {}

	private configObjectWasLoaded = false

	constructor(private fs: FileSystem) {}

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
		if (this.configObjectWasLoaded) {
			return
		}

		await this.loadConfigObject()

		this.configObjectWasLoaded = true
	}

	private async loadConfigObject() {
		try {
			this.configObject = await this.fs.readJSON(this.configFilePath) as Record<string, string>
		} catch (error) {
			await this.handleReadJSONError(error)
		}
	}

	private async handleReadJSONError(error: any) {
		const configFileNotFound = error.code === 'ENOENT'

		if (configFileNotFound) {
			await this.createEmptyConfigFile()
		} else {
			throw error
		}
	}

	private async createEmptyConfigFile() {
		await this.fs.writeJSON(this.configFilePath, {})
		this.configObject = {}
	}

	private async writeConfigToFileSystem() {
		await this.fs.writeJSON(this.configFilePath, this.configObject)
	}

	private assertConfigFilePathIsDefined() {
		assert(this.configFilePath, 'Config file path is not defined')
	}
}

export class MockPreferenceStorage extends PreferencesStorage implements IPreferencesStorage {
	private preferencesObject: { [key: string]: string } = {}

	set configDirectory(value: string) {}

	async get(key: string): Promise<string> {
		return this.preferencesObject[key]
	}

	async set(key: string, value: string): Promise<void> {
		this.preferencesObject[key] = value
	}

	clear(): void {
		this.preferencesObject = {}
	}
}
