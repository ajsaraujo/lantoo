import { flags } from '@oclif/parser'
import { container } from 'tsyringe'
import * as inquirer from 'inquirer';

import { ITranslationFiles } from '../modules/i18n/codebase/translation-files';
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

	private language!: string;

	async run(): Promise<void> {
		const { flags } = this.parse(Translate);
		const { key, value, interactive, lang } = flags;

		const requiredFlagsWerePassed = (key && value) || interactive;
		if (!requiredFlagsWerePassed) {
			this.log('You should either pass --key and --value flags or --interactive');
			return;
		}

		this.language = await this.parseLanguageFlagOrGetFromPreferences(lang);

		if (interactive) {
			this.runInteractiveMode();
		} else {
			this.addTranslation(key as string, value as string);
		}
	}

	private async addTranslation(key: string, value: string) {
		const translationFiles: ITranslationFiles = container.resolve('TranslationFiles');
		await translationFiles.addTranslation(key, value, this.language);

		this.log(`✔️ '${ key }':'${ value }' was added to the ${ this.language } translation file.`)
	}

	private async runInteractiveMode() {
		const EXISTING_KEYS = 0;
		const BRAND_NEW_KEYS = 1;

		const responses = await inquirer.prompt([{
			name: 'mode',
			message: 'what do you want to do?',
			type: 'list',
			choices: [{ name: 'add translations to existing untranslated keys', value: EXISTING_KEYS }, { name: 'add brand new translation keys', value: BRAND_NEW_KEYS }],
		}]);
	}
}
