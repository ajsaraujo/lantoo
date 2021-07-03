import { container } from 'tsyringe'

import {
	possiblePreferences,
	Preferences,
	Preference,
	InvalidValueForPreferenceError,
} from '../modules/preferences'
import Command from './base'

export default class Config extends Command {
	static description = 'get/set user preferences'

	static usage = 'config lang'

	static examples = ['$ lantoo config lang pt-br', '$ lantoo config lang']

	static args = [
		{
			name: 'key',
			required: true,
			description: 'the key to get/set',
			options: possiblePreferences,
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

	private async set(key: Preference, value: string) {
		const preferences = container.resolve<Preferences>(Preferences)

		try {
			await preferences.set(key, value)
		} catch (error) {
			this.handleSetPreferenceError(error, value)
		}
	}

	private handleSetPreferenceError(error: any, value: string) {
		if (error instanceof InvalidValueForPreferenceError) {
			this.log(`❌ '${ value }' is not a valid ISO 632-9 language code`)

			if (error.suggestion) {
				this.log(`🤔 Did you mean '${ error.suggestion }'?`)
			}

			return
		}

		throw error
	}

	private async get(key: Preference) {
		const preferences = container.resolve<Preferences>(Preferences)

		const value = await preferences.get(key)

		if (value) {
			this.log(value)
		} else {
			this.log(
				`No value is set for the '${ key }' key.`
          + '\n'
          + 'To set one, run $ lantoo config lang <<value>>',
			)
		}
	}
}
