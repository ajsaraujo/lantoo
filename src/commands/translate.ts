import { flags } from '@oclif/parser'

import Command from './base'

export default class Translate extends Command {
	static description = 'add new translations'

	static usage = 'translate --key Away_female --value Ausente'

	static examples = [
		'$ lantoo translate --key Away_female --value Ausente',
		'$ lantoo translate --interactive',
		'$ lantoo translate --interactive --lang en',
	]

	static flags = {
  	lang: flags.string({ char: 'l' }),
		key: flags.string({ char: 'k' }),
		interactive: flags.boolean({ char: 'i' }),
		value: flags.string({ char: 'v' }),
	}

	async run(): Promise<void> {
		const { flags } = this.parse(Translate);
		const { key, value, interactive, lang } = flags;

		const requiredFlagsWerePassed = (key && value) || interactive;
		if (!requiredFlagsWerePassed) {
			this.log('You should either pass --key and --value flags or --interactive');
		}
	}
}
