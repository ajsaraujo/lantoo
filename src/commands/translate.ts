/* eslint-disable no-await-in-loop */
import { flags } from '@oclif/parser'
import { container } from 'tsyringe'
import * as inquirer from 'inquirer';
import instance from 'tsyringe/dist/typings/dependency-container';

import { Codebase } from '../modules/i18n/codebase/codebase';
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
			this.explainCommandUsage();
			return;
		}

		this.language = await this.parseLanguageFlagOrGetFromPreferences(lang);

		if (interactive) {
			await this.runInteractiveMode();
		} else {
			await this.runKeyAndValueMode(key as string, value as string);
		}
	}

	private explainCommandUsage() {
		this.log('You should either pass --key and --value flags or --interactive. E.g:\n');
		Translate.examples.map((example) => this.log(example));
	}

	private async runKeyAndValueMode(key: string, value: string) {
		await this.addTranslation(key, value);

		this.log(`✔️ '${ key }' -> '${ value }' was added to the ${ this.language } translation file.`)
	}

	private async addTranslation(key: string, value: string) {
		const codebase: Codebase = container.resolve(Codebase);
		await codebase.addTranslation(key, value, this.language);
	}

	private async runInteractiveMode() {
		enum InteractiveModeOptions {
			ExistingKeys,
			BrandNewKeys
		}

		const response = await inquirer.prompt([{
			name: 'mode',
			message: 'what do you want to do?',
			type: 'list',
			choices: [
				{ name: 'add translations to existing untranslated keys', value: InteractiveModeOptions.ExistingKeys },
				{ name: 'add brand new translation keys', value: InteractiveModeOptions.BrandNewKeys },
			],
		}]);

		if (response.mode === InteractiveModeOptions.ExistingKeys) {
			await this.addTranslationsToExistingKeys();
		} else {
			await this.addNewTranslationKeys();
		}
	}

	private async addNewTranslationKeys() {
		this.log(`\nAdding new translations to the ${ this.language } translation file.`);
		this.log('Enter Q at any moment to finish entering keys.\n');

		let translationsAdded = 0;

		// eslint-disable-next-line no-constant-condition
		while (true) {
			try {
				const key = await this.readInput('key');
				const value = await this.readInput('value');

				await this.addTranslation(key, value);

				translationsAdded++;

				this.log('\nAdded successfully! Enter the next one or Q to quit.');
			} catch (err) {
				if (err instanceof QuitButtonPressedError) {
					break;
				}
			}
		}

		this.outputHowManyTranslationsWereAdded(translationsAdded);
	}

	private outputHowManyTranslationsWereAdded(translationsAdded: number) {
		if (translationsAdded === 0) {
			this.log('\nNo translations were added.');
		} else if (translationsAdded === 1) {
			this.log('\n✔️ Added one new translation.');
		} else {
			this.log(`\n✔️ Added ${ translationsAdded } new translations.`);
		}
	}

	private async addTranslationsToExistingKeys() {
		const codebase = container.resolve(Codebase);
		const untranslatedKeys = await codebase.getUntranslatedKeys(this.language);

		if (untranslatedKeys.length === 0) {
			this.log(`Did not found any untranslated keys in ${ this.language }`);
			return;
		}

		this.log(`Found ${ untranslatedKeys.length } untranslated key(s).`);
		this.log('Leave the translation empty to skip a key. Enter Q to quit.');

		let translationsAdded = 0;

		for (const { key } of untranslatedKeys) {
			try {
				const translation = await this.readInput(key);

				const userSkippedThisTranslation = !translation;
				if (userSkippedThisTranslation) {
					continue;
				}

				await this.addTranslation(key, translation);

				translationsAdded++;
			} catch (err) {
				if (err instanceof QuitButtonPressedError) {
					break;
				}
			}
		}

		this.outputHowManyTranslationsWereAdded(translationsAdded);
	}

	private async readInput(message: string): Promise<string> {
		const { value } = await inquirer.prompt([{ message, name: 'value', type: 'input' }]);
		const parsedValue = (value as string).trim();

		if (parsedValue.toUpperCase() === 'Q') {
			throw new QuitButtonPressedError();
		}

		return parsedValue;
	}
}

class QuitButtonPressedError extends Error {
	constructor() {
		super('quit button pressed');
	}
}
